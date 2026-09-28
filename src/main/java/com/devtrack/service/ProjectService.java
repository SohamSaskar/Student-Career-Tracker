package com.devtrack.service;

import com.devtrack.dao.ProjectDAO;
import com.devtrack.dao.SkillDAO;
import com.devtrack.model.Project;
import com.devtrack.model.ProjectDetails;
import com.devtrack.model.Skill;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 * Service managing Project Vault operations, validation, and database transactions.
 */
public class ProjectService {

    private final ProjectDAO projectDAO;
    private final SkillDAO skillDAO;

    public ProjectService() {
        this.projectDAO = new ProjectDAO();
        this.skillDAO = new SkillDAO();
    }

    public static class ProjectResult {
        private final boolean success;
        private final String message;
        private final ProjectDetails projectDetails;

        public ProjectResult(boolean success, String message, ProjectDetails projectDetails) {
            this.success = success;
            this.message = message;
            this.projectDetails = projectDetails;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public ProjectDetails getProjectDetails() { return projectDetails; }
    }

    public List<ProjectDetails> getAllProjectsForStudent(int studentId) {
        return projectDAO.getAllProjectsForStudent(studentId);
    }

    public ProjectDetails getProjectById(int projectId, int studentId) {
        return projectDAO.getProjectById(projectId, studentId);
    }

    public List<Skill> getAllAvailableSkills() {
        return skillDAO.getAllSkills();
    }

    public ProjectResult createProject(int studentId, String name, String description,
                                         String githubUrl, String liveUrl, String status,
                                         String startDateStr, String endDateStr, List<Integer> skillIds) {

        ValidationResult val = validateProjectInput(name, githubUrl, liveUrl, startDateStr, endDateStr);
        if (!val.isSuccess()) {
            return new ProjectResult(false, val.getMessage(), null);
        }

        Project p = new Project();
        p.setStudentId(studentId);
        p.setProjectName(name.trim());
        p.setDescription(description != null ? description.trim() : "");
        p.setGithubUrl(githubUrl != null && !githubUrl.trim().isEmpty() ? githubUrl.trim() : null);
        p.setLiveUrl(liveUrl != null && !liveUrl.trim().isEmpty() ? liveUrl.trim() : null);
        p.setStatus(status != null && !status.trim().isEmpty() ? status.trim() : "Planned");
        p.setStartDate(val.getStartDate());
        p.setEndDate(val.getEndDate());

        int generatedId = projectDAO.createProject(p, skillIds);
        if (generatedId > 0) {
            ProjectDetails details = projectDAO.getProjectById(generatedId, studentId);
            return new ProjectResult(true, "Project created successfully.", details);
        } else {
            return new ProjectResult(false, "Unable to save project.", null);
        }
    }

    public ProjectResult updateProject(int studentId, int projectId, String name, String description,
                                         String githubUrl, String liveUrl, String status,
                                         String startDateStr, String endDateStr, List<Integer> skillIds) {

        if (projectId <= 0) {
            return new ProjectResult(false, "Invalid project ID.", null);
        }

        ValidationResult val = validateProjectInput(name, githubUrl, liveUrl, startDateStr, endDateStr);
        if (!val.isSuccess()) {
            return new ProjectResult(false, val.getMessage(), null);
        }

        Project p = new Project();
        p.setProjectId(projectId);
        p.setStudentId(studentId);
        p.setProjectName(name.trim());
        p.setDescription(description != null ? description.trim() : "");
        p.setGithubUrl(githubUrl != null && !githubUrl.trim().isEmpty() ? githubUrl.trim() : null);
        p.setLiveUrl(liveUrl != null && !liveUrl.trim().isEmpty() ? liveUrl.trim() : null);
        p.setStatus(status != null && !status.trim().isEmpty() ? status.trim() : "Planned");
        p.setStartDate(val.getStartDate());
        p.setEndDate(val.getEndDate());

        boolean updated = projectDAO.updateProject(p, skillIds);
        if (updated) {
            ProjectDetails details = projectDAO.getProjectById(projectId, studentId);
            return new ProjectResult(true, "Project updated successfully.", details);
        } else {
            return new ProjectResult(false, "Unable to update project.", null);
        }
    }

    public boolean deleteProject(int studentId, int projectId) {
        if (studentId <= 0 || projectId <= 0) return false;
        return projectDAO.deleteProject(projectId, studentId);
    }

    public boolean deleteProjectById(int projectId, int studentId) {
        return deleteProject(studentId, projectId);
    }

    public List<ProjectDetails> getProjectsForCurrentStudent() {
        int studentId = com.devtrack.util.SessionManager.getInstance().getCurrentStudentId();
        return getAllProjectsForStudent(studentId);
    }

    public boolean createProject(Project project, List<Integer> skillIds, int studentId) {
        String startStr = project.getStartDate() != null ? project.getStartDate().toString() : null;
        String endStr = project.getEndDate() != null ? project.getEndDate().toString() : null;
        ProjectResult res = createProject(studentId, project.getProjectName(), project.getDescription(),
                project.getGithubUrl(), project.getLiveUrl(), project.getStatus(),
                startStr, endStr, skillIds);
        if (!res.isSuccess()) {
            throw new IllegalArgumentException(res.getMessage());
        }
        if (res.getProjectDetails() != null && res.getProjectDetails().getProject() != null) {
            project.setProjectId(res.getProjectDetails().getProject().getProjectId());
        }
        return true;
    }

    public boolean updateProject(Project project, List<Integer> skillIds, int studentId) {
        String startStr = project.getStartDate() != null ? project.getStartDate().toString() : null;
        String endStr = project.getEndDate() != null ? project.getEndDate().toString() : null;
        ProjectResult res = updateProject(studentId, project.getProjectId(), project.getProjectName(), project.getDescription(),
                project.getGithubUrl(), project.getLiveUrl(), project.getStatus(),
                startStr, endStr, skillIds);
        if (!res.isSuccess()) {
            throw new IllegalArgumentException(res.getMessage());
        }
        return true;
    }

    private static class ValidationResult {
        private final boolean success;
        private final String message;
        private final Date startDate;
        private final Date endDate;

        public ValidationResult(boolean success, String message, Date startDate, Date endDate) {
            this.success = success;
            this.message = message;
            this.startDate = startDate;
            this.endDate = endDate;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public Date getStartDate() { return startDate; }
        public Date getEndDate() { return endDate; }
    }

    public static ValidationResult validateProjectInput(String name, String githubUrl, String liveUrl,
                                                         String startDateStr, String endDateStr) {
        if (name == null || name.trim().isEmpty()) {
            return new ValidationResult(false, "Project name is required.", null, null);
        }

        if (name.trim().length() > 150) {
            return new ValidationResult(false, "Project name cannot exceed 150 characters.", null, null);
        }

        if (githubUrl != null && !githubUrl.trim().isEmpty()) {
            String gh = githubUrl.trim().toLowerCase();
            if (!gh.startsWith("http://") && !gh.startsWith("https://")) {
                return new ValidationResult(false, "GitHub URL must start with http:// or https://", null, null);
            }
        }

        if (liveUrl != null && !liveUrl.trim().isEmpty()) {
            String lu = liveUrl.trim().toLowerCase();
            if (!lu.startsWith("http://") && !lu.startsWith("https://")) {
                return new ValidationResult(false, "Live Demo URL must start with http:// or https://", null, null);
            }
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setLenient(false);

        Date startDate = null;
        Date endDate = null;

        if (startDateStr != null && !startDateStr.trim().isEmpty()) {
            try {
                java.util.Date parsed = sdf.parse(startDateStr.trim());
                startDate = new Date(parsed.getTime());
            } catch (ParseException e) {
                return new ValidationResult(false, "Start Date must be in YYYY-MM-DD format.", null, null);
            }
        }

        if (endDateStr != null && !endDateStr.trim().isEmpty()) {
            try {
                java.util.Date parsed = sdf.parse(endDateStr.trim());
                endDate = new Date(parsed.getTime());
            } catch (ParseException e) {
                return new ValidationResult(false, "End Date must be in YYYY-MM-DD format.", null, null);
            }
        }

        if (startDate != null && endDate != null && startDate.after(endDate)) {
            return new ValidationResult(false, "Start Date cannot be after End Date.", null, null);
        }

        return new ValidationResult(true, "Valid input", startDate, endDate);
    }
}
