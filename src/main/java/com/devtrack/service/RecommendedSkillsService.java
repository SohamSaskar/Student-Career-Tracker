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
 * Service managing deterministic, fact-based skill recommendations.
 */
public class RecommendedSkillsService {

    private final StudentDAO studentDAO;
    private final StudentCareerGoalDAO goalDAO;
    private final CareerRoleDAO roleDAO;
    private final SkillDAO skillDAO;

    public RecommendedSkillsService() {
        this.studentDAO = new StudentDAO();
        this.goalDAO = new StudentCareerGoalDAO();
        this.roleDAO = new CareerRoleDAO();
        this.skillDAO = new SkillDAO();
    }

    /**
     * Loads student-isolated RecommendedSkillsData for the specified student ID.
     */
    public RecommendedSkillsData loadRecommendedSkillsData(int studentId) {
        Student student = studentDAO.getStudentById(studentId);

        boolean hasGoal = goalDAO.hasCareerGoal(studentId);
        int roleId = hasGoal ? goalDAO.getSelectedRoleId(studentId) : -1;
        CareerRole role = roleId > 0 ? roleDAO.getCareerRoleById(roleId) : null;

        if (role == null) {
            return new RecommendedSkillsData(student, null, null, new ArrayList<>(), new ArrayList<>(), 0, 0);
        }

        List<Skill> roleSkills = skillDAO.getRoleSkillsForStudent(roleId, studentId);

        int completedCount = 0;
        List<RecommendedSkill> missingList = new ArrayList<>();
        List<RecommendedSkill> learningList = new ArrayList<>();

        for (Skill s : roleSkills) {
            String status = s.getStatus();
            if ("Completed".equalsIgnoreCase(status)) {
                completedCount++;
            } else if ("Learning".equalsIgnoreCase(status)) {
                learningList.add(new RecommendedSkill(s.getSkillId(), s.getSkillName(), s.getCategory(),
                        s.getImportance(), getPriorityTag(s.getImportance()), "Learning",
                        "Currently in your learning inventory for target career"));
            } else {
                String priorityTag = getPriorityTag(s.getImportance());
                String reason = getFactReason(s.getImportance(), role.getRoleName());
                missingList.add(new RecommendedSkill(s.getSkillId(), s.getSkillName(), s.getCategory(),
                        s.getImportance(), priorityTag, "Missing", reason));
            }
        }

        // Sort missing recommendations by Importance (High -> Medium -> Low), then secondary alphabetical name
        missingList.sort((r1, r2) -> {
            int p1 = getImportancePriority(r1.getImportance());
            int p2 = getImportancePriority(r2.getImportance());
            if (p1 != p2) return Integer.compare(p1, p2);
            return r1.getSkillName().compareToIgnoreCase(r2.getSkillName());
        });

        // Top recommendation is selected as Next Focus
        RecommendedSkill nextFocus = missingList.isEmpty() ? null : missingList.get(0);

        return new RecommendedSkillsData(student, role, nextFocus, missingList, learningList, completedCount, roleSkills.size());
    }

    private String getPriorityTag(String importance) {
        if ("High".equalsIgnoreCase(importance)) return "HIGH PRIORITY";
        if ("Medium".equalsIgnoreCase(importance)) return "MEDIUM PRIORITY";
        return "LOW PRIORITY";
    }

    private String getFactReason(String importance, String roleName) {
        if ("High".equalsIgnoreCase(importance)) return "High-priority required skill for " + roleName;
        if ("Medium".equalsIgnoreCase(importance)) return "Required skill for " + roleName;
        return "Optional / low-priority skill for " + roleName;
    }

    private int getImportancePriority(String importance) {
        if ("High".equalsIgnoreCase(importance)) return 1;
        if ("Medium".equalsIgnoreCase(importance)) return 2;
        return 3;
    }
}
