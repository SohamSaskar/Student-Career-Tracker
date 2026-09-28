package com.devtrack.model;

/**
 * Model representing a Skill entity combining data from 'skills', 'role_skills', and 'student_skills'.
 */
public class Skill {
    private int skillId;
    private String skillName;
    private String category;
    private String status;     // "Completed", "Learning", "Missing"
    private String importance; // "High", "Medium", "Low" or numerical rating
    private String detail;     // Description/topics summary

    public Skill() {}

    public Skill(int skillId, String skillName, String category, String status, String importance, String detail) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category;
        this.status = status;
        this.importance = importance;
        this.detail = detail;
    }

    public int getSkillId() { return skillId; }
    public void setSkillId(int skillId) { this.skillId = skillId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImportance() { return importance; }
    public void setImportance(String importance) { this.importance = importance; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
}
