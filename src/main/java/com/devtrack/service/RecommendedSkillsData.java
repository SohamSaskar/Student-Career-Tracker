package com.devtrack.service;

import com.devtrack.model.CareerRole;
import com.devtrack.model.Student;

import java.util.List;

/**
 * Aggregated data transfer object for Recommended Skills workspace.
 */
public class RecommendedSkillsData {

    private final Student student;
    private final CareerRole careerRole;
    private final RecommendedSkill nextFocus;
    private final List<RecommendedSkill> recommendedSkills;
    private final List<RecommendedSkill> learningSkills;
    private final int completedRequiredCount;
    private final int totalRequiredCount;

    public RecommendedSkillsData(Student student, CareerRole careerRole, RecommendedSkill nextFocus,
                                 List<RecommendedSkill> recommendedSkills, List<RecommendedSkill> learningSkills,
                                 int completedRequiredCount, int totalRequiredCount) {
        this.student = student;
        this.careerRole = careerRole;
        this.nextFocus = nextFocus;
        this.recommendedSkills = recommendedSkills;
        this.learningSkills = learningSkills;
        this.completedRequiredCount = completedRequiredCount;
        this.totalRequiredCount = totalRequiredCount;
    }

    public Student getStudent() { return student; }
    public CareerRole getCareerRole() { return careerRole; }
    public RecommendedSkill getNextFocus() { return nextFocus; }
    public List<RecommendedSkill> getRecommendedSkills() { return recommendedSkills; }
    public List<RecommendedSkill> getLearningSkills() { return learningSkills; }
    public int getCompletedRequiredCount() { return completedRequiredCount; }
    public int getTotalRequiredCount() { return totalRequiredCount; }
}
