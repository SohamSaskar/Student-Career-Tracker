package com.devtrack.model;

import java.sql.Date;
import java.sql.Timestamp;

/**
 * Model representing a student certification from the 'certifications' database table.
 */
public class Certification {

    private int certificationId;
    private int studentId;
    private String certificateName;
    private String issuer;
    private Date issueDate;
    private Date expiryDate;
    private String credentialId;
    private String credentialUrl;
    private String certificateFile;
    private Timestamp createdAt;

    public Certification() {}

    public Certification(int certificationId, int studentId, String certificateName, String issuer,
                         Date issueDate, Date expiryDate, String credentialId, String credentialUrl,
                         String certificateFile, Timestamp createdAt) {
        this.certificationId = certificationId;
        this.studentId = studentId;
        this.certificateName = certificateName;
        this.issuer = issuer;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.credentialId = credentialId;
        this.credentialUrl = credentialUrl;
        this.certificateFile = certificateFile;
        this.createdAt = createdAt;
    }

    public int getCertificationId() { return certificationId; }
    public void setCertificationId(int certificationId) { this.certificationId = certificationId; }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getCertificateName() { return certificateName; }
    public void setCertificateName(String certificateName) { this.certificateName = certificateName; }

    public String getTitle() { return certificateName; }
    public void setTitle(String title) { this.certificateName = title; }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }

    public String getIssuerName() { return issuer; }
    public void setIssuerName(String issuerName) { this.issuer = issuerName; }

    public Date getIssueDate() { return issueDate; }
    public void setIssueDate(Date issueDate) { this.issueDate = issueDate; }
    public void setIssueDate(String dateStr) {
        if (dateStr != null && !dateStr.isBlank()) {
            try {
                this.issueDate = java.sql.Date.valueOf(dateStr.trim());
            } catch (Exception ignored) {
                this.issueDate = null;
            }
        } else {
            this.issueDate = null;
        }
    }

    public Date getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Date expiryDate) { this.expiryDate = expiryDate; }
    public void setExpiryDate(String dateStr) {
        if (dateStr != null && !dateStr.isBlank()) {
            try {
                this.expiryDate = java.sql.Date.valueOf(dateStr.trim());
            } catch (Exception ignored) {
                this.expiryDate = null;
            }
        } else {
            this.expiryDate = null;
        }
    }

    public String getCredentialId() { return credentialId; }
    public void setCredentialId(String credentialId) { this.credentialId = credentialId; }

    public String getCredentialUrl() { return credentialUrl; }
    public void setCredentialUrl(String credentialUrl) { this.credentialUrl = credentialUrl; }

    public String getCertificateFile() { return certificateFile; }
    public void setCertificateFile(String certificateFile) { this.certificateFile = certificateFile; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
