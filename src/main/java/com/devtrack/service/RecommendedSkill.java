package com.devtrack.service;

/**
 * Model representing a skill recommendation item for Recommended Skills workspace.
 */
public class RecommendedSkill {

    private final int skillId;
    private final String skillName;
    private final String category;
    private final String importance; // 'High', 'Medium', 'Low'
    private final String priority;   // 'HIGH PRIORITY', 'MEDIUM PRIORITY', 'LOW PRIORITY'
    private final String status;     // 'Missing', 'Learning'
    private final String reason;

    public RecommendedSkill(int skillId, String skillName, String category, String importance,
                            String priority, String status, String reason) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category != null ? category : "General";
        this.importance = importance != null ? importance : "Medium";
        this.priority = priority != null ? priority : "MEDIUM PRIORITY";
        this.status = status != null ? status : "Missing";
        this.reason = reason != null ? reason : "Required for your target career";
    }

    public int getSkillId() { return skillId; }
    public String getSkillName() { return skillName; }
    public String getCategory() { return category; }
    public String getImportance() { return importance; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
    public String getReason() { return reason; }
}
