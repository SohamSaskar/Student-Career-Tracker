package com.devtrack.dao;

import com.devtrack.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Data Access Object for managing student's acquired skills ('student_skills' table).
 */
public class StudentSkillDAO {

    /**
     * Adds a skill to the student's inventory or updates status if already present.
     * Safe against 'Not Started' status by removing from inventory.
     */
    public boolean addOrUpdateSkill(int studentId, int skillId, String status) {
        if ("Not Started".equalsIgnoreCase(status) || "Missing".equalsIgnoreCase(status)) {
            return removeSkill(studentId, skillId);
        }

        String sql = "INSERT INTO student_skills (student_id, skill_id, skill_status) VALUES (?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE skill_status = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, skillId);
            ps.setString(3, status);
            ps.setString(4, status);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("StudentSkillDAO.addOrUpdateSkill SQL Exception: " + e.getMessage());
            return false;
        }
    }

    /**
     * Updates the status of an existing student skill ('Completed' or 'Learning').
     * If status is reset to 'Not Started', removes the record cleanly.
     */
    public boolean updateSkillStatus(int studentId, int skillId, String newStatus) {
        if ("Not Started".equalsIgnoreCase(newStatus) || "Missing".equalsIgnoreCase(newStatus)) {
            return removeSkill(studentId, skillId);
        }

        String sql = "UPDATE student_skills SET skill_status = ? WHERE student_id = ? AND skill_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, newStatus);
            ps.setInt(2, studentId);
            ps.setInt(3, skillId);

            int updated = ps.executeUpdate();
            if (updated == 0) {
                // If not yet in table, insert it
                return addOrUpdateSkill(studentId, skillId, newStatus);
            }
            return true;
        } catch (SQLException e) {
            System.err.println("StudentSkillDAO.updateSkillStatus SQL Exception: " + e.getMessage());
            return false;
        }
    }

    /**
     * Removes a skill from the student's inventory.
     */
    public boolean removeSkill(int studentId, int skillId) {
        String sql = "DELETE FROM student_skills WHERE student_id = ? AND skill_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, skillId);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("StudentSkillDAO.removeSkill SQL Exception: " + e.getMessage());
            return false;
        }
    }

    /**
     * Checks if a student already possesses a specific skill.
     */
    public boolean hasSkill(int studentId, int skillId) {
        String sql = "SELECT 1 FROM student_skills WHERE student_id = ? AND skill_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, skillId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            System.err.println("StudentSkillDAO.hasSkill SQL Exception: " + e.getMessage());
            return false;
        }
    }
}
