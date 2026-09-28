package com.devtrack.service;

import com.devtrack.dao.CareerRoleDAO;
import com.devtrack.dao.SkillDAO;
import com.devtrack.dao.StudentCareerGoalDAO;
import com.devtrack.dao.StudentDAO;
import com.devtrack.dao.StudentSkillDAO;
import com.devtrack.model.CareerRole;
import com.devtrack.model.Skill;
import com.devtrack.model.Student;

import java.util.ArrayList;
import java.util.List;

/**
 * Service managing database-driven Learning Roadmap generation and skill progress updates.
 */
public class LearningRoadmapService {

    private final StudentDAO studentDAO;
    private final StudentCareerGoalDAO goalDAO;
    private final CareerRoleDAO roleDAO;
    private final SkillDAO skillDAO;
    private final StudentSkillDAO studentSkillDAO;

    public LearningRoadmapService() {
        this.studentDAO = new StudentDAO();
        this.goalDAO = new StudentCareerGoalDAO();
        this.roleDAO = new CareerRoleDAO();
        this.skillDAO = new SkillDAO();
        this.studentSkillDAO = new StudentSkillDAO();
    }

    /**
     * Loads student-isolated RoadmapData for the specified student ID.
     */
    public RoadmapData loadRoadmapData(int studentId) {
        Student student = studentDAO.getStudentById(studentId);

        boolean hasGoal = goalDAO.hasCareerGoal(studentId);
        int roleId = hasGoal ? goalDAO.getSelectedRoleId(studentId) : -1;
        CareerRole role = roleId > 0 ? roleDAO.getCareerRoleById(roleId) : null;

        if (role == null) {
            return new RoadmapData(student, null, 0, 0, 0, 0, 0,
                    new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        }

        List<Skill> roleSkills = skillDAO.getRoleSkillsForStudent(roleId, studentId);

        int completedCount = 0;
        int learningCount = 0;
        int notStartedCount = 0;

        List<RoadmapItem> completedList = new ArrayList<>();
        List<RoadmapItem> learningList = new ArrayList<>();
        List<RoadmapItem> missingList = new ArrayList<>();

        for (Skill s : roleSkills) {
            String status = s.getStatus();
            if ("Completed".equalsIgnoreCase(status)) {
                completedCount++;
                completedList.add(new RoadmapItem(s.getSkillId(), s.getSkillName(), s.getCategory(), s.getImportance(), "Completed", "Completed", 0));
            } else if ("Learning".equalsIgnoreCase(status)) {
                learningCount++;
                learningList.add(new RoadmapItem(s.getSkillId(), s.getSkillName(), s.getCategory(), s.getImportance(), "Learning", "Learning Now", 0));
            } else {
                notStartedCount++;
                missingList.add(new RoadmapItem(s.getSkillId(), s.getSkillName(), s.getCategory(), s.getImportance(), "Not Started", "Pending", 0));
            }
        }

        int totalRequired = roleSkills.size();
        int progressPercentage = 0;
        if (totalRequired > 0) {
            progressPercentage = (int) Math.round((completedCount / (double) totalRequired) * 100);
        }

        // Sort missing items by Importance (High -> Medium -> Low), then secondary alphabetical name
        missingList.sort((i1, i2) -> {
            int p1 = getImportancePriority(i1.getImportance());
            int p2 = getImportancePriority(i2.getImportance());
            if (p1 != p2) return Integer.compare(p1, p2);
            return i1.getSkillName().compareToIgnoreCase(i2.getSkillName());
        });

        // Separate Next Up (first missing) and Later (remaining missing)
        List<RoadmapItem> nextUpList = new ArrayList<>();
        List<RoadmapItem> laterList = new ArrayList<>();

        int step = 1;
        for (int i = 0; i < missingList.size(); i++) {
            RoadmapItem raw = missingList.get(i);
            if (i == 0) {
                nextUpList.add(new RoadmapItem(raw.getSkillId(), raw.getSkillName(), raw.getCategory(), raw.getImportance(), "Not Started", "Next Up", step++));
            } else {
                laterList.add(new RoadmapItem(raw.getSkillId(), raw.getSkillName(), raw.getCategory(), raw.getImportance(), "Not Started", "Later", step++));
            }
        }

        return new RoadmapData(student, role, progressPercentage, totalRequired, completedCount, learningCount, notStartedCount,
                completedList, learningList, nextUpList, laterList);
    }

    /**
     * Updates student's skill status in 'student_skills' table.
     */
    public boolean updateStudentSkillStatus(int studentId, int skillId, String newStatus) {
        if (studentId <= 0 || skillId <= 0 || newStatus == null) return false;
        return studentSkillDAO.addOrUpdateSkill(studentId, skillId, newStatus);
    }

    private int getImportancePriority(String importance) {
        if ("High".equalsIgnoreCase(importance)) return 1;
        if ("Medium".equalsIgnoreCase(importance)) return 2;
        return 3;
    }
}
