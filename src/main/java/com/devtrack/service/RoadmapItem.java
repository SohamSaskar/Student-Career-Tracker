package com.devtrack.service;

/**
 * Model representing a single skill item on the Learning Roadmap.
 */
public class RoadmapItem {

    private final int skillId;
    private final String skillName;
    private final String category;
    private final String importance; // 'High', 'Medium', 'Low'
    private final String status;     // 'Completed', 'Learning', 'Not Started'
    private final String section;    // 'Completed', 'Learning Now', 'Next Up', 'Later'
    private final int stepNumber;

    public RoadmapItem(int skillId, String skillName, String category, String importance,
                       String status, String section, int stepNumber) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category != null ? category : "General";
        this.importance = importance != null ? importance : "Medium";
        this.status = status != null ? status : "Not Started";
        this.section = section;
        this.stepNumber = stepNumber;
    }

    public int getSkillId() { return skillId; }
    public String getSkillName() { return skillName; }
    public String getCategory() { return category; }
    public String getImportance() { return importance; }
    public String getStatus() { return status; }
    public String getSection() { return section; }
    public int getStepNumber() { return stepNumber; }
}
