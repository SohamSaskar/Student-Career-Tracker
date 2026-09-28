package com.devtrack.service;

import com.devtrack.dao.*;
import com.devtrack.model.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Service loading student-isolated DashboardData for DevTrack Main Dashboard.
 */
public class DashboardService {

    private final StudentDAO studentDAO;
    private final StudentCareerGoalDAO goalDAO;
    private final CareerRoleDAO roleDAO;
    private final SkillDAO skillDAO;
    private final ProjectDAO projectDAO;
    private final CertificationDAO certificationDAO;

    public DashboardService() {
        this.studentDAO = new StudentDAO();
        this.goalDAO = new StudentCareerGoalDAO();
        this.roleDAO = new CareerRoleDAO();
        this.skillDAO = new SkillDAO();
        this.projectDAO = new ProjectDAO();
        this.certificationDAO = new CertificationDAO();
    }

    /**
     * Loads aggregated dashboard data for the specified student ID.
     */
    public DashboardData loadDashboardData(int studentId) {
        Student student = studentDAO.getStudentById(studentId);

        boolean hasGoal = goalDAO.hasCareerGoal(studentId);
        int selectedRoleId = hasGoal ? goalDAO.getSelectedRoleId(studentId) : -1;
        CareerRole role = selectedRoleId > 0 ? roleDAO.getCareerRoleById(selectedRoleId) : null;

        List<Skill> roleSkills = selectedRoleId > 0 ? skillDAO.getRoleSkillsForStudent(selectedRoleId, studentId) : new ArrayList<>();

        int completedCount = 0;
        int learningCount = 0;
        int missingCount = 0;

        for (Skill s : roleSkills) {
            String status = s.getStatus();
            if ("Completed".equalsIgnoreCase(status)) {
                completedCount++;
            } else if ("Learning".equalsIgnoreCase(status)) {
                learningCount++;
            } else {
                missingCount++;
            }
        }

        int totalRequired = roleSkills.size();
        int readinessPercentage = 0;
        if (totalRequired > 0) {
            readinessPercentage = (int) Math.round((completedCount / (double) totalRequired) * 100);
        }

        int skillGapCount = learningCount + missingCount;

        // Sort skills by importance (High first, then Medium, then Low)
        roleSkills.sort((s1, s2) -> {
            int p1 = getImportancePriority(s1.getImportance());
            int p2 = getImportancePriority(s2.getImportance());
            return Integer.compare(p1, p2);
        });

        // Limit required skills for dashboard preview
        List<Skill> topSkills = roleSkills.size() > 8 ? roleSkills.subList(0, 8) : roleSkills;

        List<Project> projects = projectDAO.getRecentProjectsForStudent(studentId, 3);
        List<Certification> certifications = certificationDAO.getRecentCertificationsForStudent(studentId, 3);

        // Derive truthful activity records
        List<String> activities = new ArrayList<>();
        for (Project p : projects) {
            if (p.getCreatedAt() != null) {
                activities.add("Project added: " + p.getProjectName() + " (" + p.getStatus() + ")");
            }
        }
        for (Certification c : certifications) {
            if (c.getCreatedAt() != null) {
                activities.add("Certification earned: " + c.getCertificateName() + " (" + c.getIssuer() + ")");
            }
        }

        return new DashboardData(student, role, readinessPercentage, completedCount, learningCount,
                skillGapCount, topSkills, projects, certifications, activities);
    }

    private int getImportancePriority(String importance) {
        if ("High".equalsIgnoreCase(importance)) return 1;
        if ("Medium".equalsIgnoreCase(importance)) return 2;
        return 3;
    }
}
