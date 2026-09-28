package com.devtrack.dao;

import com.devtrack.model.Skill;
import com.devtrack.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Skill queries joining skills, student_skills, and role_skills tables.
 */
public class SkillDAO {

    /**
     * Retrieves all skills owned by a specific student.
     */
    public List<Skill> getStudentSkills(int studentId) {
        List<Skill> list = new ArrayList<>();
        String sql = "SELECT s.skill_id, s.skill_name, s.category, ss.skill_status " +
                     "FROM student_skills ss " +
                     "JOIN skills s ON ss.skill_id = s.skill_id " +
                     "WHERE ss.student_id = ? " +
                     "ORDER BY s.skill_id ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Skill s = new Skill();
                    s.setSkillId(rs.getInt("skill_id"));
                    s.setSkillName(rs.getString("skill_name"));
                    s.setCategory(rs.getString("category"));
                    s.setStatus(rs.getString("skill_status"));
                    s.setImportance("High");
                    s.setDetail(getSkillDetail(s.getSkillName(), s.getCategory()));
                    list.add(s);
                }
            }
        } catch (SQLException e) {
            System.err.println("SkillDAO.getStudentSkills SQL Exception: " + e.getMessage());
        }
        return list;
    }

    /**
     * Retrieves all skills required for a specific career role along with the student's current status.
     */
    public List<Skill> getRoleSkillsForStudent(int roleId, int studentId) {
        List<Skill> list = new ArrayList<>();
        String sql = "SELECT s.skill_id, s.skill_name, s.category, rs.importance, ss.skill_status " +
                     "FROM role_skills rs " +
                     "JOIN skills s ON rs.skill_id = s.skill_id " +
                     "LEFT JOIN student_skills ss ON (ss.skill_id = s.skill_id AND ss.student_id = ?) " +
                     "WHERE rs.role_id = ? " +
                     "ORDER BY rs.skill_id ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, roleId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Skill s = new Skill();
                    s.setSkillId(rs.getInt("skill_id"));
                    s.setSkillName(rs.getString("skill_name"));
                    s.setCategory(rs.getString("category"));
                    
                    String status = rs.getString("skill_status");
                    if (status == null || status.trim().isEmpty()) {
                        status = "Missing";
                    }
                    s.setStatus(status);
                    
                    String imp = rs.getString("importance");
                    s.setImportance(imp != null ? imp : "High");
                    s.setDetail(getSkillDetail(s.getSkillName(), s.getCategory()));
                    list.add(s);
                }
            }
        } catch (SQLException e) {
            System.err.println("SkillDAO.getRoleSkillsForStudent SQL Exception: " + e.getMessage());
        }
        return list;
    }

    /**
     * Calculates the student's overall progress percentage for a target career role.
     * Completed skills count as 1.0, Learning skills count as 0.5, Missing skills count as 0.0.
     */
    public double calculateSkillProgress(int studentId, int roleId) {
        String sql = "SELECT ss.skill_status " +
                     "FROM role_skills rs " +
                     "LEFT JOIN student_skills ss ON (ss.skill_id = rs.skill_id AND ss.student_id = ?) " +
                     "WHERE rs.role_id = ?";

        int totalRoleSkills = 0;
        double completedUnits = 0.0;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, roleId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    totalRoleSkills++;
                    String status = rs.getString("skill_status");
                    if ("Completed".equalsIgnoreCase(status)) {
                        completedUnits += 1.0;
                    } else if ("Learning".equalsIgnoreCase(status)) {
                        completedUnits += 0.5;
                    }
                }
            }
        } catch (SQLException e) {
            System.err.println("SkillDAO.calculateSkillProgress SQL Exception: " + e.getMessage());
        }

        if (totalRoleSkills == 0) return 0.0;
        return completedUnits / totalRoleSkills;
    }

    /**
     * Identifies skill gaps by comparing role requirements against student's acquired skills.
     * Returns skills required by the role that are 'Learning' or 'Missing'.
     */
    public List<Skill> getSkillGaps(int studentId, int roleId) {
        List<Skill> gaps = new ArrayList<>();
        String sql = "SELECT s.skill_id, s.skill_name, s.category, rs.importance, ss.skill_status " +
                     "FROM role_skills rs " +
                     "JOIN skills s ON rs.skill_id = s.skill_id " +
                     "LEFT JOIN student_skills ss ON (ss.skill_id = s.skill_id AND ss.student_id = ?) " +
                     "WHERE rs.role_id = ? AND (ss.skill_status IS NULL OR ss.skill_status != 'Completed') " +
                     "ORDER BY rs.importance DESC, s.skill_name ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, roleId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Skill s = new Skill();
                    s.setSkillId(rs.getInt("skill_id"));
                    s.setSkillName(rs.getString("skill_name"));
                    s.setCategory(rs.getString("category"));
                    
                    String status = rs.getString("skill_status");
                    if (status == null || status.trim().isEmpty()) {
                        status = "Missing";
                    }
                    s.setStatus(status);

                    String imp = rs.getString("importance");
                    s.setImportance(imp != null ? imp : "High");
                    s.setDetail(getSkillDetail(s.getSkillName(), s.getCategory()));
                    gaps.add(s);
                }
            }
        } catch (SQLException e) {
            System.err.println("SkillDAO.getSkillGaps SQL Exception: " + e.getMessage());
        }
        return gaps;
    }

    /**
     * Retrieves all available skills in system from 'skills' table.
     */
    public List<Skill> getAllSkills() {
        List<Skill> list = new ArrayList<>();
        String sql = "SELECT skill_id, skill_name, category FROM skills ORDER BY skill_name ASC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Skill s = new Skill();
                s.setSkillId(rs.getInt("skill_id"));
                s.setSkillName(rs.getString("skill_name"));
                s.setCategory(rs.getString("category"));
                s.setStatus("Missing");
                s.setImportance("Medium");
                s.setDetail(getSkillDetail(s.getSkillName(), s.getCategory()));
                list.add(s);
            }
        } catch (SQLException e) {
            System.err.println("SkillDAO.getAllSkills SQL Exception: " + e.getMessage());
        }
        return list;
    }

    /**
     * Returns comma-separated string of skills required by a career role.
     */
    public String getRoleSkillNames(int roleId) {
        StringBuilder sb = new StringBuilder();
        String sql = "SELECT s.skill_name " +
                     "FROM role_skills rs " +
                     "JOIN skills s ON rs.skill_id = s.skill_id " +
                     "WHERE rs.role_id = ? " +
                     "ORDER BY s.skill_id ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, roleId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    if (sb.length() > 0) sb.append(", ");
                    sb.append(rs.getString("skill_name"));
                }
            }
        } catch (SQLException e) {
            System.err.println("SkillDAO.getRoleSkillNames SQL Exception: " + e.getMessage());
        }
        return sb.length() > 0 ? sb.toString() : "General CS Skills";
    }

    private String getSkillDetail(String name, String category) {
        if ("Java".equalsIgnoreCase(name)) return "Core Java, OOP, Collections Framework";
        if ("SQL".equalsIgnoreCase(name)) return "MySQL Relational Schema, Joins & Queries";
        if ("Git".equalsIgnoreCase(name)) return "Version Control, Branching & Pull Requests";
        if ("DSA".equalsIgnoreCase(name)) return "Arrays, Trees, Graphs & Algorithms";
        if ("REST API".equalsIgnoreCase(name)) return "HTTP Methods, JSON, API Endpoint Design";
        if ("Spring Boot".equalsIgnoreCase(name)) return "MVC, Dependency Injection & Spring Data JPA";
        if ("Docker".equalsIgnoreCase(name)) return "Containerization, Images, Docker Compose";
        return category + " core fundamentals and practical applications.";
    }
}
