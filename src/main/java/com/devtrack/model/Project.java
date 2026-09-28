package com.devtrack.model;

import java.sql.Date;
import java.sql.Timestamp;

/**
 * Model representing a student project from the 'projects' database table.
 */
public class Project {

    private int projectId;
    private int studentId;
    private String projectName;
    private String description;
    private String githubUrl;
    private String liveUrl;
    private String status; // 'Planned', 'In Progress', 'Completed'
    private Date startDate;
    private Date endDate;
    private Timestamp createdAt;

    public Project() {}

    public Project(int projectId, int studentId, String projectName, String description,
                   String githubUrl, String liveUrl, String status, Date startDate, Date endDate, Timestamp createdAt) {
        this.projectId = projectId;
        this.studentId = studentId;
        this.projectName = projectName;
        this.description = description;
        this.githubUrl = githubUrl;
        this.liveUrl = liveUrl;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
    }

    public int getProjectId() { return projectId; }
    public void setProjectId(int projectId) { this.projectId = projectId; }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getTitle() { return projectName; }
    public void setTitle(String title) { this.projectName = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLiveUrl() { return liveUrl; }
    public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }

    public String getLiveDemoUrl() { return liveUrl; }
    public void setLiveDemoUrl(String liveDemoUrl) { this.liveUrl = liveDemoUrl; }

    public String getCategory() { return "Software"; }
    public void setCategory(String category) {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    public void setStartDate(String dateStr) {
        if (dateStr != null && !dateStr.isBlank()) {
            try {
                this.startDate = java.sql.Date.valueOf(dateStr.trim());
            } catch (Exception ignored) {
                this.startDate = null;
            }
        } else {
            this.startDate = null;
        }
    }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }
    public void setEndDate(String dateStr) {
        if (dateStr != null && !dateStr.isBlank()) {
            try {
                this.endDate = java.sql.Date.valueOf(dateStr.trim());
            } catch (Exception ignored) {
                this.endDate = null;
            }
        } else {
            this.endDate = null;
        }
    }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
