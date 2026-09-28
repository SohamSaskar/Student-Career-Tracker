package com.devtrack.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Model encapsulating a Certification and its associated Skill entities for Certification Vault.
 */
public class CertificationDetails {

    private final Certification certification;
    private final List<Skill> associatedSkills;

    public CertificationDetails(Certification certification, List<Skill> associatedSkills) {
        this.certification = certification;
        this.associatedSkills = associatedSkills != null ? associatedSkills : new ArrayList<>();
    }

    public Certification getCertification() { return certification; }
    public List<Skill> getAssociatedSkills() { return associatedSkills; }
    public List<Skill> getSkills() { return associatedSkills; }
}
