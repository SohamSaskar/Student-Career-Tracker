package com.devtrack.service;

import com.devtrack.dao.*;
import com.devtrack.model.CareerRole;
import com.devtrack.model.Skill;
import com.devtrack.model.Student;
import com.devtrack.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

/**
 * Service managing onboarding steps, user detection, skill saves, and database-driven DevTrack Analysis.
 */
public class OnboardingService {

    private final StudentDAO studentDAO;
    private final StudentCareerGoalDAO goalDAO;
    private final CareerRoleDAO roleDAO;
    private final SkillDAO skillDAO;
    private final StudentSkillDAO studentSkillDAO;

    public OnboardingService() {
        this.studentDAO = new StudentDAO();
        this.goalDAO = new StudentCareerGoalDAO();
        this.roleDAO = new CareerRoleDAO();
        this.skillDAO = new SkillDAO();
        this.studentSkillDAO = new StudentSkillDAO();
    }

    public static class AnalysisResult {
        private final String roleName;
        private final String roleDescription;
        private final int readinessPercentage;
        private final int completedCount;
        private final int learningCount;
        private final int missingCount;
        private final int totalRequired;
        private final List<Skill> priorityGaps;

        public AnalysisResult(String roleName, String roleDescription, int readinessPercentage,
                              int completedCount, int learningCount, int missingCount,
                              int totalRequired, List<Skill> priorityGaps) {
            this.roleName = roleName;
            this.roleDescription = roleDescription;
            this.readinessPercentage = readinessPercentage;
            this.completedCount = completedCount;
            this.learningCount = learningCount;
            this.missingCount = missingCount;
            this.totalRequired = totalRequired;
            this.priorityGaps = priorityGaps;
        }

        public String getRoleName() { return roleName; }
        public String getRoleDescription() { return roleDescription; }
        public int getReadinessPercentage() { return readinessPercentage; }
        public int getCompletedCount() { return completedCount; }
        public int getLearningCount() { return learningCount; }
        public int getMissingCount() { return missingCount; }
        public int getTotalRequired() { return totalRequired; }
        public List<Skill> getPriorityGaps() { return priorityGaps; }
    }

    /**
     * Returns true if student has completed onboarding (explicit career goal set in DB).
     */
    public boolean isOnboarded(int studentId) {
        return goalDAO.hasCareerGoal(studentId);
    }

    /**
     * Updates student profile details during onboarding.
     */
    public boolean updateStudentProfile(Student student) {
        String sql = "UPDATE students SET name = ?, college = ?, branch = ?, year = ? WHERE student_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, student.getName());
            ps.setString(2, student.getCollege());
            ps.setString(3, student.getBranch());
            ps.setInt(4, student.getYear());
            ps.setInt(5, student.getStudentId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("OnboardingService.updateStudentProfile SQL Exception: " + e.getMessage());
            return false;
        }
    }

    /**
     * Saves or updates target career goal for student.
     */
    public boolean saveCareerGoal(int studentId, int roleId) {
        return goalDAO.saveStudentCareerGoal(studentId, roleId);
    }

    /**
     * Saves student skill inventory selections (Completed/Learning) using JDBC transactions.
     */
    public boolean saveStudentSkills(int studentId, Map<Integer, String> skillStatusMap) {
        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false); // Begin transaction

            // First delete existing skill entries for student
            String deleteSql = "DELETE FROM student_skills WHERE student_id = ?";
            try (PreparedStatement psDelete = conn.prepareStatement(deleteSql)) {
                psDelete.setInt(1, studentId);
                psDelete.executeUpdate();
            }

            // Insert non-None skill selections
            String insertSql = "INSERT INTO student_skills (student_id, skill_id, skill_status) VALUES (?, ?, ?)";
            try (PreparedStatement psInsert = conn.prepareStatement(insertSql)) {
                for (Map.Entry<Integer, String> entry : skillStatusMap.entrySet()) {
                    int skillId = entry.getKey();
                    String status = entry.getValue();
                    if (status != null && !status.equalsIgnoreCase("None") && !status.equalsIgnoreCase("Missing")) {
                        psInsert.setInt(1, studentId);
                        psInsert.setInt(2, skillId);
                        psInsert.setString(3, status);
                        psInsert.addBatch();
                    }
                }
                psInsert.executeBatch();
            }

            conn.commit(); // Commit transaction
            return true;
        } catch (SQLException e) {
            System.err.println("OnboardingService.saveStudentSkills Transaction Exception: " + e.getMessage());
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) {}
            }
            return false;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException e) {}
            }
        }
    }

    /**
     * Calculates database-driven DevTrack analysis for current student.
     */
    public AnalysisResult calculateAnalysis(int studentId) {
        int roleId = goalDAO.getSelectedRoleId(studentId);
        CareerRole role = roleDAO.getCareerRoleById(roleId);
        String roleName = role != null ? role.getRoleName() : "Software Developer";
        String roleDesc = role != null ? role.getDescription() : "Builds software solutions.";

        List<Skill> roleSkills = skillDAO.getRoleSkillsForStudent(roleId, studentId);

        int completed = 0;
        int learning = 0;
        int missing = 0;
        List<Skill> gaps = new ArrayList<>();

        for (Skill s : roleSkills) {
            String status = s.getStatus();
            if ("Completed".equalsIgnoreCase(status)) {
                completed++;
            } else if ("Learning".equalsIgnoreCase(status)) {
                learning++;
                gaps.add(s);
            } else {
                missing++;
                gaps.add(s);
            }
        }

        int totalRequired = roleSkills.size();
        int readinessPercentage = 0;
        if (totalRequired > 0) {
            readinessPercentage = (int) Math.round((completed / (double) totalRequired) * 100);
        }

        // Sort gaps by importance (High first, then Medium, then Low)
        gaps.sort((s1, s2) -> {
            int p1 = getImportancePriority(s1.getImportance());
            int p2 = getImportancePriority(s2.getImportance());
            return Integer.compare(p1, p2);
        });

        return new AnalysisResult(roleName, roleDesc, readinessPercentage, completed, learning, missing, totalRequired, gaps);
    }

    private int getImportancePriority(String importance) {
        if ("High".equalsIgnoreCase(importance)) return 1;
        if ("Medium".equalsIgnoreCase(importance)) return 2;
        return 3;
    }
}
