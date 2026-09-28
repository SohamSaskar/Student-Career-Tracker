package com.devtrack.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Model encapsulating a Project and its associated Skill entities for Project Vault.
 */
public class ProjectDetails {

    private final Project project;
    private final List<Skill> associatedSkills;

    public ProjectDetails(Project project, List<Skill> associatedSkills) {
        this.project = project;
        this.associatedSkills = associatedSkills != null ? associatedSkills : new ArrayList<>();
    }

    public Project getProject() { return project; }
    public List<Skill> getAssociatedSkills() { return associatedSkills; }
    public List<Skill> getSkills() { return associatedSkills; }
}
