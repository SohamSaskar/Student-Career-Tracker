package com.devtrack.service;

import com.devtrack.model.CareerRole;
import com.devtrack.model.Student;

import java.util.List;

/**
 * Aggregated data transfer object for Learning Roadmap workspace.
 */
public class RoadmapData {

    private final Student student;
    private final CareerRole careerRole;
    private final int progressPercentage;
    private final int totalRequiredSkills;
    private final int completedCount;
    private final int learningCount;
    private final int notStartedCount;
    private final List<RoadmapItem> completedItems;
    private final List<RoadmapItem> learningItems;
    private final List<RoadmapItem> nextUpItems;
    private final List<RoadmapItem> laterItems;

    public RoadmapData(Student student, CareerRole careerRole, int progressPercentage,
                       int totalRequiredSkills, int completedCount, int learningCount, int notStartedCount,
                       List<RoadmapItem> completedItems, List<RoadmapItem> learningItems,
                       List<RoadmapItem> nextUpItems, List<RoadmapItem> laterItems) {
        this.student = student;
        this.careerRole = careerRole;
        this.progressPercentage = progressPercentage;
        this.totalRequiredSkills = totalRequiredSkills;
        this.completedCount = completedCount;
        this.learningCount = learningCount;
        this.notStartedCount = notStartedCount;
        this.completedItems = completedItems;
        this.learningItems = learningItems;
        this.nextUpItems = nextUpItems;
        this.laterItems = laterItems;
    }

    public Student getStudent() { return student; }
    public CareerRole getCareerRole() { return careerRole; }
    public int getProgressPercentage() { return progressPercentage; }
    public int getTotalRequiredSkills() { return totalRequiredSkills; }
    public int getCompletedCount() { return completedCount; }
    public int getLearningCount() { return learningCount; }
    public int getNotStartedCount() { return notStartedCount; }
    public List<RoadmapItem> getCompletedItems() { return completedItems; }
    public List<RoadmapItem> getLearningItems() { return learningItems; }
    public List<RoadmapItem> getNextUpItems() { return nextUpItems; }
    public List<RoadmapItem> getLaterItems() { return laterItems; }
}
