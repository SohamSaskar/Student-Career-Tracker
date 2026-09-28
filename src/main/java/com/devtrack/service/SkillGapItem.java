package com.devtrack.service;

/**
 * Model representing a required skill item evaluated for Skill Gap Analysis.
 */
public class SkillGapItem {

    private final int skillId;
    private final String skillName;
    private final String category;
    private final String importance; // 'High', 'Medium', 'Low'
    private final String status;     // 'Completed', 'Learning', 'Missing'

    public SkillGapItem(int skillId, String skillName, String category, String importance, String status) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category != null ? category : "General";
        this.importance = importance != null ? importance : "Medium";
        this.status = status != null ? status : "Missing";
    }

    public int getSkillId() { return skillId; }
    public String getSkillName() { return skillName; }
    public String getCategory() { return category; }
    public String getImportance() { return importance; }
    public String getStatus() { return status; }
}
