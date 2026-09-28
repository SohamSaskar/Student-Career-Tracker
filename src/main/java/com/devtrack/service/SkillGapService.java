package com.devtrack.service;

import com.devtrack.dao.CareerRoleDAO;
import com.devtrack.dao.SkillDAO;
import com.devtrack.dao.StudentCareerGoalDAO;
import com.devtrack.dao.StudentDAO;
import com.devtrack.model.CareerRole;
import com.devtrack.model.Skill;
import com.devtrack.model.Student;

import java.util.ArrayList;
import java.util.List;

/**
 * Service managing deterministic Skill Gap Analysis for student career goals.
 */
public class SkillGapService {

    private final StudentDAO studentDAO;
    private final StudentCareerGoalDAO goalDAO;
    private final CareerRoleDAO roleDAO;
    private final SkillDAO skillDAO;

    public SkillGapService() {
        this.studentDAO = new StudentDAO();
        this.goalDAO = new StudentCareerGoalDAO();
        this.roleDAO = new CareerRoleDAO();
        this.skillDAO = new SkillDAO();
    }

    /**
     * Loads student-isolated SkillGapData for a given student ID.
     */
    public SkillGapData loadSkillGapData(int studentId) {
        Student student = studentDAO.getStudentById(studentId);

        boolean hasGoal = goalDAO.hasCareerGoal(studentId);
        int roleId = hasGoal ? goalDAO.getSelectedRoleId(studentId) : -1;
        CareerRole role = roleId > 0 ? roleDAO.getCareerRoleById(roleId) : null;

        if (role == null) {
            return new SkillGapData(student, null, 0, 0, 0, 0, 0, new ArrayList<>(), new ArrayList<>());
        }

        List<Skill> rawRoleSkills = skillDAO.getRoleSkillsForStudent(roleId, studentId);

        int completedCount = 0;
        int learningCount = 0;
        int missingCount = 0;

        List<SkillGapItem> items = new ArrayList<>();

        for (Skill s : rawRoleSkills) {
            String status = s.getStatus();
            if ("Completed".equalsIgnoreCase(status)) {
                completedCount++;
                status = "Completed";
            } else if ("Learning".equalsIgnoreCase(status)) {
                learningCount++;
                status = "Learning";
            } else {
                missingCount++;
                status = "Missing";
            }

            items.add(new SkillGapItem(s.getSkillId(), s.getSkillName(), s.getCategory(), s.getImportance(), status));
        }

        int totalRequired = items.size();
        int readinessPercentage = 0;
        if (totalRequired > 0) {
            readinessPercentage = (int) Math.round((completedCount / (double) totalRequired) * 100);
        }

        // Sort items by Importance (High -> Medium -> Low), then secondary alphabetical skill name
        items.sort((i1, i2) -> {
            int p1 = getImportancePriority(i1.getImportance());
            int p2 = getImportancePriority(i2.getImportance());
            if (p1 != p2) return Integer.compare(p1, p2);
            return i1.getSkillName().compareToIgnoreCase(i2.getSkillName());
        });

        // Generate Focus Areas (Missing or Learning skills sorted by importance)
        List<SkillGapItem> focusAreas = new ArrayList<>();
        for (SkillGapItem item : items) {
            if (!"Completed".equalsIgnoreCase(item.getStatus())) {
                focusAreas.add(item);
            }
        }
        if (focusAreas.size() > 5) {
            focusAreas = focusAreas.subList(0, 5);
        }

        return new SkillGapData(student, role, readinessPercentage, totalRequired, completedCount,
                learningCount, missingCount, items, focusAreas);
    }

    private int getImportancePriority(String importance) {
        if ("High".equalsIgnoreCase(importance)) return 1;
        if ("Medium".equalsIgnoreCase(importance)) return 2;
        return 3;
    }
}
