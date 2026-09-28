package com.devtrack.service;

import com.devtrack.model.CareerRole;
import com.devtrack.model.Student;

import java.util.List;

/**
 * Aggregated data transfer object for Skill Gap Analysis.
 */
public class SkillGapData {

    private final Student student;
    private final CareerRole careerRole;
    private final int readinessPercentage;
    private final int totalRequiredSkills;
    private final int completedCount;
    private final int learningCount;
    private final int missingCount;
    private final List<SkillGapItem> requiredSkills;
    private final List<SkillGapItem> focusAreas;

    public SkillGapData(Student student, CareerRole careerRole, int readinessPercentage,
                        int totalRequiredSkills, int completedCount, int learningCount,
                        int missingCount, List<SkillGapItem> requiredSkills, List<SkillGapItem> focusAreas) {
        this.student = student;
        this.careerRole = careerRole;
        this.readinessPercentage = readinessPercentage;
        this.totalRequiredSkills = totalRequiredSkills;
        this.completedCount = completedCount;
        this.learningCount = learningCount;
        this.missingCount = missingCount;
        this.requiredSkills = requiredSkills;
        this.focusAreas = focusAreas;
    }

    public Student getStudent() { return student; }
    public CareerRole getCareerRole() { return careerRole; }
    public int getReadinessPercentage() { return readinessPercentage; }
    public int getTotalRequiredSkills() { return totalRequiredSkills; }
    public int getCompletedCount() { return completedCount; }
    public int getLearningCount() { return learningCount; }
    public int getMissingCount() { return missingCount; }
    public List<SkillGapItem> getRequiredSkills() { return requiredSkills; }
    public List<SkillGapItem> getFocusAreas() { return focusAreas; }
}
