package com.devtrack.dao;

import com.devtrack.model.Student;
import com.devtrack.util.DatabaseConnection;

import java.sql.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Data Access Object for Student operations.
 */
public class StudentDAO {

    private static boolean schemaVerified = false;

    public StudentDAO() {
        ensureUsernameSchema();
    }

    /**
     * Safely ensures the 'username' column exists in the 'students' table.
     * Backfills any existing records with clean, unique usernames before enforcing NOT NULL UNIQUE.
     */
    public synchronized void ensureUsernameSchema() {
        if (schemaVerified) return;

        String checkColumnSql = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
                               "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'students' AND COLUMN_NAME = 'username'";
        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement()) {

            boolean columnExists = false;
            try (ResultSet rs = st.executeQuery(checkColumnSql)) {
                if (rs.next()) {
                    columnExists = rs.getInt(1) > 0;
                }
            }

            if (!columnExists) {
                try (Statement alterSt = conn.createStatement()) {
                    alterSt.executeUpdate("ALTER TABLE students ADD COLUMN username VARCHAR(50)");
                }
            }

            Set<String> usedUsernames = new HashSet<>();
            try (Statement st2 = conn.createStatement();
                 ResultSet existingUsernamesRs = st2.executeQuery("SELECT username FROM students WHERE username IS NOT NULL AND TRIM(username) != ''")) {
                while (existingUsernamesRs.next()) {
                    usedUsernames.add(existingUsernamesRs.getString("username").toLowerCase());
                }
            }

            // Backfill existing records with null or empty usernames
            String updateSql = "UPDATE students SET username = ? WHERE student_id = ?";
            try (Statement st3 = conn.createStatement();
                 ResultSet unassignedRs = st3.executeQuery("SELECT student_id, name, email FROM students WHERE username IS NULL OR TRIM(username) = ''");
                 PreparedStatement updatePs = conn.prepareStatement(updateSql)) {

                while (unassignedRs.next()) {
                    int id = unassignedRs.getInt("student_id");
                    String name = unassignedRs.getString("name");
                    String email = unassignedRs.getString("email");

                    String baseName = generateBaseUsername(name, email);
                    String uniqueUsername = baseName;
                    int counter = 2;
                    while (usedUsernames.contains(uniqueUsername.toLowerCase())) {
                        uniqueUsername = baseName + counter;
                        counter++;
                    }
                    usedUsernames.add(uniqueUsername.toLowerCase());

                    updatePs.setString(1, uniqueUsername);
                    updatePs.setInt(2, id);
                    updatePs.executeUpdate();
                }
            }

            if (!columnExists) {
                try (Statement st4 = conn.createStatement()) {
                    st4.executeUpdate("ALTER TABLE students MODIFY COLUMN username VARCHAR(50) NOT NULL");
                    st4.executeUpdate("ALTER TABLE students ADD UNIQUE INDEX idx_student_username (username)");
                } catch (SQLException ignored) {
                    // Index or constraint might already exist
                }
            }

            schemaVerified = true;

        } catch (SQLException e) {
            System.err.println("StudentDAO.ensureUsernameSchema Exception: " + e.getMessage());
        }
    }

    private String generateBaseUsername(String name, String email) {
        String base = "";
        if (name != null && !name.trim().isEmpty()) {
            base = name.trim().toLowerCase().replaceAll("[^a-z0-9_]", "_");
        } else if (email != null && email.contains("@")) {
            base = email.split("@")[0].trim().toLowerCase().replaceAll("[^a-z0-9_]", "_");
        }
        base = base.replaceAll("_+", "_").replaceAll("^_+|_+$", "");
        if (base.length() < 3) {
            base = base + "user";
        }
        if (base.length() > 40) {
            base = base.substring(0, 40);
        }
        return base;
    }

    /**
     * Retrieves student by ID from 'students' table.
     */
    public Student getStudentById(int studentId) {
        String sql = "SELECT student_id, name, username, email, password_hash, college, branch, year, created_at FROM students WHERE student_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToStudent(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("StudentDAO.getStudentById SQL Exception: " + e.getMessage());
        }
        return getFallbackStudent();
    }

    /**
     * Retrieves student by normalized username.
     */
    public Student getStudentByUsername(String username) {
        if (username == null) return null;
        String sql = "SELECT student_id, name, username, email, password_hash, college, branch, year, created_at FROM students WHERE LOWER(TRIM(username)) = LOWER(TRIM(?))";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToStudent(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("StudentDAO.getStudentByUsername SQL Exception: " + e.getMessage());
        }
        return null;
    }

    /**
     * Retrieves student by normalized email address.
     */
    public Student getStudentByEmail(String email) {
        if (email == null) return null;
        String sql = "SELECT student_id, name, username, email, password_hash, college, branch, year, created_at FROM students WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToStudent(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("StudentDAO.getStudentByEmail SQL Exception: " + e.getMessage());
        }
        return null;
    }

    /**
     * Checks whether a username already exists in the students table.
     */
    public boolean usernameExists(String username) {
        if (username == null) return false;
        String sql = "SELECT COUNT(*) FROM students WHERE LOWER(TRIM(username)) = LOWER(TRIM(?))";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            System.err.println("StudentDAO.usernameExists SQL Exception: " + e.getMessage());
        }
        return false;
    }

    /**
     * Checks whether an email address already exists in the students table.
     */
    public boolean emailExists(String email) {
        if (email == null) return false;
        String sql = "SELECT COUNT(*) FROM students WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            System.err.println("StudentDAO.emailExists SQL Exception: " + e.getMessage());
        }
        return false;
    }

    /**
     * Inserts a new student record into 'students' table with hashed password.
     * Returns generated student_id or -1 on failure.
     */
    public int createStudent(Student student, String passwordHash) {
        String sql = "INSERT INTO students (name, username, email, password_hash, college, branch, year) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, student.getName());
            ps.setString(2, student.getUsername().trim().toLowerCase());
            ps.setString(3, student.getEmail().trim().toLowerCase());
            ps.setString(4, passwordHash);
            ps.setString(5, student.getCollege());
            ps.setString(6, student.getBranch());
            ps.setInt(7, student.getYear());

            int affectedRows = ps.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        int generatedId = keys.getInt(1);
                        student.setStudentId(generatedId);
                        student.setPasswordHash(passwordHash);
                        return generatedId;
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("StudentDAO.createStudent SQL Exception: " + e.getMessage());
        }
        return -1;
    }

    /**
     * Retrieves the first available student or default fallback.
     */
    public Student getFirstStudent() {
        String sql = "SELECT student_id, name, username, email, password_hash, college, branch, year, created_at FROM students ORDER BY student_id ASC LIMIT 1";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return mapResultSetToStudent(rs);
            }
        } catch (SQLException e) {
            System.err.println("StudentDAO.getFirstStudent SQL Exception: " + e.getMessage());
        }
        return getFallbackStudent();
    }

    private Student mapResultSetToStudent(ResultSet rs) throws SQLException {
        String passHash = null;
        try {
            passHash = rs.getString("password_hash");
        } catch (SQLException ignored) {}

        String username = null;
        try {
            username = rs.getString("username");
        } catch (SQLException ignored) {}

        return new Student(
                rs.getInt("student_id"),
                rs.getString("name"),
                username,
                rs.getString("email"),
                passHash,
                rs.getString("college"),
                rs.getString("branch"),
                rs.getInt("year"),
                rs.getTimestamp("created_at")
        );
    }

    public boolean deleteStudent(int studentId) {
        String sql = "DELETE FROM students WHERE student_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("StudentDAO.deleteStudent SQL Exception: " + e.getMessage());
            return false;
        }
    }

    private Student getFallbackStudent() {
        return new Student(1, "Soham", "soham", "soham@devtrack.com", null, "Sanjivani University", "AI & Data Science", 3, null);
    }
}
