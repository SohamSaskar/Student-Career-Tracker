package com.devtrack.dao;

import com.devtrack.model.Project;
import com.devtrack.model.ProjectDetails;
import com.devtrack.model.Skill;
import com.devtrack.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO handling CRUD operations and queries for 'projects' and 'project_skills' tables with strict student isolation.
 */
public class ProjectDAO {

    /**
     * Retrieves recent projects for a specific student ordered by created_at DESC with limit.
     */
    public List<Project> getRecentProjectsForStudent(int studentId, int limit) {
        List<Project> projects = new ArrayList<>();
        String sql = "SELECT project_id, student_id, project_name, description, github_url, live_url, status, start_date, end_date, created_at " +
                     "FROM projects WHERE student_id = ? ORDER BY created_at DESC LIMIT ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, limit > 0 ? limit : 5);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    projects.add(mapResultSetToProject(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("ProjectDAO.getRecentProjectsForStudent SQL Exception: " + e.getMessage());
        }
        return projects;
    }

    /**
     * Retrieves all projects and associated skills for a specific student.
     */
    public List<ProjectDetails> getAllProjectsForStudent(int studentId) {
        List<ProjectDetails> list = new ArrayList<>();
        String sql = "SELECT project_id, student_id, project_name, description, github_url, live_url, status, start_date, end_date, created_at " +
                     "FROM projects WHERE student_id = ? ORDER BY created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Project p = mapResultSetToProject(rs);
                    List<Skill> skills = getSkillsForProject(p.getProjectId());
                    list.add(new ProjectDetails(p, skills));
                }
            }
        } catch (SQLException e) {
            System.err.println("ProjectDAO.getAllProjectsForStudent SQL Exception: " + e.getMessage());
        }
        return list;
    }

    /**
     * Retrieves project details for a specific project ID and student ID.
     */
    public ProjectDetails getProjectById(int projectId, int studentId) {
        String sql = "SELECT project_id, student_id, project_name, description, github_url, live_url, status, start_date, end_date, created_at " +
                     "FROM projects WHERE project_id = ? AND student_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, projectId);
            ps.setInt(2, studentId);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Project p = mapResultSetToProject(rs);
                    List<Skill> skills = getSkillsForProject(p.getProjectId());
                    return new ProjectDetails(p, skills);
                }
            }
        } catch (SQLException e) {
            System.err.println("ProjectDAO.getProjectById SQL Exception: " + e.getMessage());
        }
        return null;
    }

    /**
     * Creates a new project and associates selected skills using JDBC transaction.
     */
    public int createProject(Project project, List<Integer> skillIds) {
        String insertProjectSql = "INSERT INTO projects (student_id, project_name, description, github_url, live_url, status, start_date, end_date) " +
                                  "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;

        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Begin Transaction

            int generatedId = -1;
            try (PreparedStatement ps = conn.prepareStatement(insertProjectSql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setInt(1, project.getStudentId());
                ps.setString(2, project.getProjectName());
                ps.setString(3, project.getDescription());
                ps.setString(4, project.getGithubUrl());
                ps.setString(5, project.getLiveUrl());
                ps.setString(6, project.getStatus());
                ps.setDate(7, project.getStartDate());
                ps.setDate(8, project.getEndDate());

                int affected = ps.executeUpdate();
                if (affected > 0) {
                    try (ResultSet keys = ps.getGeneratedKeys()) {
                        if (keys.next()) {
                            generatedId = keys.getInt(1);
                            project.setProjectId(generatedId);
                        }
                    }
                }
            }

            if (generatedId > 0 && skillIds != null && !skillIds.isEmpty()) {
                String insertSkillSql = "INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)";
                try (PreparedStatement psSkill = conn.prepareStatement(insertSkillSql)) {
                    for (int skillId : skillIds) {
                        psSkill.setInt(1, generatedId);
                        psSkill.setInt(2, skillId);
                        psSkill.addBatch();
                    }
                    psSkill.executeBatch();
                }
            }

            conn.commit(); // Commit Transaction
            return generatedId;

        } catch (SQLException e) {
            System.err.println("ProjectDAO.createProject SQL Exception: " + e.getMessage());
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ignored) {}
            }
            return -1;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ignored) {}
            }
        }
    }

    /**
     * Updates an existing project and synchronizes associated skills using JDBC transaction.
     */
    public boolean updateProject(Project project, List<Integer> skillIds) {
        String updateProjectSql = "UPDATE projects SET project_name = ?, description = ?, github_url = ?, live_url = ?, status = ?, start_date = ?, end_date = ? " +
                                  "WHERE project_id = ? AND student_id = ?";
        Connection conn = null;

        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Begin Transaction

            int rowsUpdated = 0;
            try (PreparedStatement ps = conn.prepareStatement(updateProjectSql)) {
                ps.setString(1, project.getProjectName());
                ps.setString(2, project.getDescription());
                ps.setString(3, project.getGithubUrl());
                ps.setString(4, project.getLiveUrl());
                ps.setString(5, project.getStatus());
                ps.setDate(6, project.getStartDate());
                ps.setDate(7, project.getEndDate());
                ps.setInt(8, project.getProjectId());
                ps.setInt(9, project.getStudentId());

                rowsUpdated = ps.executeUpdate();
            }

            if (rowsUpdated > 0) {
                // Delete old skill links
                String deleteSkillsSql = "DELETE FROM project_skills WHERE project_id = ?";
                try (PreparedStatement psDel = conn.prepareStatement(deleteSkillsSql)) {
                    psDel.setInt(1, project.getProjectId());
                    psDel.executeUpdate();
                }

                // Insert updated skill links
                if (skillIds != null && !skillIds.isEmpty()) {
                    String insertSkillSql = "INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)";
                    try (PreparedStatement psSkill = conn.prepareStatement(insertSkillSql)) {
                        for (int skillId : skillIds) {
                            psSkill.setInt(1, project.getProjectId());
                            psSkill.setInt(2, skillId);
                            psSkill.addBatch();
                        }
                        psSkill.executeBatch();
                    }
                }

                conn.commit(); // Commit Transaction
                return true;
            } else {
                conn.rollback();
                return false;
            }

        } catch (SQLException e) {
            System.err.println("ProjectDAO.updateProject SQL Exception: " + e.getMessage());
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ignored) {}
            }
            return false;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ignored) {}
            }
        }
    }

    /**
     * Deletes a project by ID for a specific student.
     */
    public boolean deleteProject(int projectId, int studentId) {
        String sql = "DELETE FROM projects WHERE project_id = ? AND student_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, projectId);
            ps.setInt(2, studentId);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("ProjectDAO.deleteProject SQL Exception: " + e.getMessage());
            return false;
        }
    }

    /**
     * Retrieves associated skill entities for a given project ID.
     */
    public List<Skill> getSkillsForProject(int projectId) {
        List<Skill> skills = new ArrayList<>();
        String sql = "SELECT s.skill_id, s.skill_name, s.category FROM project_skills ps " +
                     "JOIN skills s ON ps.skill_id = s.skill_id " +
                     "WHERE ps.project_id = ? ORDER BY s.skill_name ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, projectId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Skill s = new Skill();
                    s.setSkillId(rs.getInt("skill_id"));
                    s.setSkillName(rs.getString("skill_name"));
                    s.setCategory(rs.getString("category"));
                    skills.add(s);
                }
            }
        } catch (SQLException e) {
            System.err.println("ProjectDAO.getSkillsForProject SQL Exception: " + e.getMessage());
        }
        return skills;
    }

    /**
     * Maps ResultSet row to Project instance safely.
     */
    private Project mapResultSetToProject(ResultSet rs) throws SQLException {
        return new Project(
                rs.getInt("project_id"),
                rs.getInt("student_id"),
                rs.getString("project_name"),
                rs.getString("description"),
                rs.getString("github_url"),
                rs.getString("live_url"),
                rs.getString("status"),
                rs.getDate("start_date"),
                rs.getDate("end_date"),
                rs.getTimestamp("created_at")
        );
    }
}
