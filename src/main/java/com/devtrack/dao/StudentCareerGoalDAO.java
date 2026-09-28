package com.devtrack.dao;

import com.devtrack.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Data Access Object for Student Career Goal operations.
 * Manages the 'student_career_goals' table linking a student to their target career role.
 */
public class StudentCareerGoalDAO {

    public StudentCareerGoalDAO() {
        ensureTableExists();
    }

    /**
     * Ensures table 'student_career_goals' exists in MySQL 'devtrack'.
     */
    private void ensureTableExists() {
        String sql = "CREATE TABLE IF NOT EXISTS student_career_goals (" +
                     "student_id INT NOT NULL, " +
                     "role_id INT NOT NULL, " +
                     "PRIMARY KEY (student_id), " +
                     "FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE ON UPDATE CASCADE, " +
                     "FOREIGN KEY (role_id) REFERENCES career_roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE" +
                     ")";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(sql);
        } catch (SQLException e) {
            System.err.println("StudentCareerGoalDAO.ensureTableExists SQL Exception: " + e.getMessage());
        }
    }

    /**
     * Checks if a student has an explicitly selected career goal saved.
     */
    public boolean hasCareerGoal(int studentId) {
        String sql = "SELECT 1 FROM student_career_goals WHERE student_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            System.err.println("StudentCareerGoalDAO.hasCareerGoal SQL Exception: " + e.getMessage());
            return false;
        }
    }

    /**
     * Retrieves the selected career role ID for a student. Defaults to role ID 1 (Backend Developer) if not set.
     */
    public int getSelectedRoleId(int studentId) {
        String sql = "SELECT role_id FROM student_career_goals WHERE student_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("role_id");
                }
            }
        } catch (SQLException e) {
            System.err.println("StudentCareerGoalDAO.getSelectedRoleId SQL Exception: " + e.getMessage());
        }

        // If no goal set yet, insert default role 1 and return 1
        saveStudentCareerGoal(studentId, 1);
        return 1;
    }

    /**
     * Saves or replaces the student's selected career goal using JDBC transactions.
     */
    public boolean saveStudentCareerGoal(int studentId, int roleId) {
        String deleteSql = "DELETE FROM student_career_goals WHERE student_id = ?";
        String insertSql = "INSERT INTO student_career_goals (student_id, role_id) VALUES (?, ?)";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Begin transaction

            try (PreparedStatement psDelete = conn.prepareStatement(deleteSql)) {
                psDelete.setInt(1, studentId);
                psDelete.executeUpdate();
            }

            try (PreparedStatement psInsert = conn.prepareStatement(insertSql)) {
                psInsert.setInt(1, studentId);
                psInsert.setInt(2, roleId);
                psInsert.executeUpdate();
            }

            conn.commit(); // Commit transaction
            return true;
        } catch (SQLException e) {
            System.err.println("StudentCareerGoalDAO.saveStudentCareerGoal Transaction Failed: " + e.getMessage());
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException rollbackEx) {
                    System.err.println("Transaction Rollback Failed: " + rollbackEx.getMessage());
                }
            }
            return false;
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    // Ignore close exceptions
                }
            }
        }
    }
}
