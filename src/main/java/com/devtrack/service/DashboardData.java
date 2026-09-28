package com.devtrack.service;

import com.devtrack.model.CareerRole;
import com.devtrack.model.Certification;
import com.devtrack.model.Project;
import com.devtrack.model.Skill;
import com.devtrack.model.Student;

import java.util.List;

/**
 * Aggregated Data Transfer Object for the DevTrack Main Dashboard.
 */
public class DashboardData {

    private final Student student;
    private final CareerRole careerRole;
    private final int readinessPercentage;
    private final int completedSkillCount;
    private final int learningSkillCount;
    private final int skillGapCount;
    private final List<Skill> requiredSkills;
    private final List<Project> recentProjects;
    private final List<Certification> recentCertifications;
    private final List<String> recentActivities;

    public DashboardData(Student student, CareerRole careerRole, int readinessPercentage,
                         int completedSkillCount, int learningSkillCount, int skillGapCount,
                         List<Skill> requiredSkills, List<Project> recentProjects,
                         List<Certification> recentCertifications, List<String> recentActivities) {
        this.student = student;
        this.careerRole = careerRole;
        this.readinessPercentage = readinessPercentage;
        this.completedSkillCount = completedSkillCount;
        this.learningSkillCount = learningSkillCount;
        this.skillGapCount = skillGapCount;
        this.requiredSkills = requiredSkills;
        this.recentProjects = recentProjects;
        this.recentCertifications = recentCertifications;
        this.recentActivities = recentActivities;
    }

    public Student getStudent() { return student; }
    public CareerRole getCareerRole() { return careerRole; }
    public int getReadinessPercentage() { return readinessPercentage; }
    public int getCompletedSkillCount() { return completedSkillCount; }
    public int getLearningSkillCount() { return learningSkillCount; }
    public int getSkillGapCount() { return skillGapCount; }
    public List<Skill> getRequiredSkills() { return requiredSkills; }
    public List<Project> getRecentProjects() { return recentProjects; }
    public List<Certification> getRecentCertifications() { return recentCertifications; }
    public List<String> getRecentActivities() { return recentActivities; }
}
