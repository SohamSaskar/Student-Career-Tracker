package com.devtrack.service;

import com.devtrack.dao.CertificationDAO;
import com.devtrack.dao.SkillDAO;
import com.devtrack.model.Certification;
import com.devtrack.model.CertificationDetails;
import com.devtrack.model.Skill;
import com.devtrack.util.SessionManager;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

/**
 * Service managing Certification Vault business logic, input validation, and student isolation.
 */
public class CertificationService {

    private final CertificationDAO certificationDAO;
    private final SkillDAO skillDAO;

    public CertificationService() {
        this.certificationDAO = new CertificationDAO();
        this.skillDAO = new SkillDAO();
    }

    public static class CertificationResult {
        private final boolean success;
        private final String message;
        private final CertificationDetails certificationDetails;

        public CertificationResult(boolean success, String message, CertificationDetails certificationDetails) {
            this.success = success;
            this.message = message;
            this.certificationDetails = certificationDetails;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public CertificationDetails getCertificationDetails() { return certificationDetails; }
    }

    public List<CertificationDetails> getAllCertificationsForStudent(int studentId) {
        return certificationDAO.getAllCertificationsForStudent(studentId);
    }

    public List<CertificationDetails> getCertificationsForCurrentStudent() {
        int studentId = SessionManager.getInstance().getCurrentStudentId();
        return getAllCertificationsForStudent(studentId);
    }

    public CertificationDetails getCertificationById(int certId, int studentId) {
        return certificationDAO.getCertificationById(certId, studentId);
    }

    public List<Skill> getAllAvailableSkills() {
        return skillDAO.getAllSkills();
    }

    public CertificationResult createCertification(int studentId, String certName, String issuer,
                                                    String issueDateStr, String expiryDateStr,
                                                    String credentialId, String credentialUrl,
                                                    String certificateFile,
                                                    List<Integer> skillIds) {

        ValidationResult val = validateCertificationInput(certName, issuer, credentialUrl, issueDateStr, expiryDateStr);
        if (!val.isSuccess()) {
            return new CertificationResult(false, val.getMessage(), null);
        }

        Certification cert = new Certification();
        cert.setStudentId(studentId);
        cert.setCertificateName(certName.trim());
        cert.setIssuer(issuer.trim());
        cert.setIssueDate(val.getIssueDate());
        cert.setExpiryDate(val.getExpiryDate());
        cert.setCredentialId(credentialId != null && !credentialId.trim().isEmpty() ? credentialId.trim() : null);
        cert.setCredentialUrl(credentialUrl != null && !credentialUrl.trim().isEmpty() ? credentialUrl.trim() : null);
        cert.setCertificateFile(certificateFile != null && !certificateFile.trim().isEmpty() ? certificateFile.trim() : null);

        int generatedId = certificationDAO.createCertification(cert, skillIds);
        if (generatedId > 0) {
            CertificationDetails details = certificationDAO.getCertificationById(generatedId, studentId);
            return new CertificationResult(true, "Certification saved successfully.", details);
        } else {
            return new CertificationResult(false, "Unable to save certification.", null);
        }
    }

    public CertificationResult createCertification(int studentId, String certName, String issuer,
                                                    String issueDateStr, String expiryDateStr,
                                                    String credentialId, String credentialUrl,
                                                    List<Integer> skillIds) {
        return createCertification(studentId, certName, issuer, issueDateStr, expiryDateStr, credentialId, credentialUrl, null, skillIds);
    }

    public boolean createCertification(Certification cert, List<Integer> skillIds, int studentId) {
        String issueStr = cert.getIssueDate() != null ? cert.getIssueDate().toString() : null;
        String expiryStr = cert.getExpiryDate() != null ? cert.getExpiryDate().toString() : null;

        CertificationResult res = createCertification(studentId, cert.getCertificateName(), cert.getIssuer(),
                issueStr, expiryStr, cert.getCredentialId(), cert.getCredentialUrl(), cert.getCertificateFile(), skillIds);

        if (!res.isSuccess()) {
            throw new IllegalArgumentException(res.getMessage());
        }
        if (res.getCertificationDetails() != null && res.getCertificationDetails().getCertification() != null) {
            cert.setCertificationId(res.getCertificationDetails().getCertification().getCertificationId());
        }
        return true;
    }

    public CertificationResult updateCertification(int studentId, int certId, String certName, String issuer,
                                                    String issueDateStr, String expiryDateStr,
                                                    String credentialId, String credentialUrl,
                                                    String certificateFile,
                                                    List<Integer> skillIds) {

        if (certId <= 0) {
            return new CertificationResult(false, "Invalid certification ID.", null);
        }

        ValidationResult val = validateCertificationInput(certName, issuer, credentialUrl, issueDateStr, expiryDateStr);
        if (!val.isSuccess()) {
            return new CertificationResult(false, val.getMessage(), null);
        }

        Certification cert = new Certification();
        cert.setCertificationId(certId);
        cert.setStudentId(studentId);
        cert.setCertificateName(certName.trim());
        cert.setIssuer(issuer.trim());
        cert.setIssueDate(val.getIssueDate());
        cert.setExpiryDate(val.getExpiryDate());
        cert.setCredentialId(credentialId != null && !credentialId.trim().isEmpty() ? credentialId.trim() : null);
        cert.setCredentialUrl(credentialUrl != null && !credentialUrl.trim().isEmpty() ? credentialUrl.trim() : null);
        cert.setCertificateFile(certificateFile != null && !certificateFile.trim().isEmpty() ? certificateFile.trim() : null);

        boolean updated = certificationDAO.updateCertification(cert, skillIds);
        if (updated) {
            CertificationDetails details = certificationDAO.getCertificationById(certId, studentId);
            return new CertificationResult(true, "Certification updated successfully.", details);
        } else {
            return new CertificationResult(false, "Unable to update certification.", null);
        }
    }

    public CertificationResult updateCertification(int studentId, int certId, String certName, String issuer,
                                                    String issueDateStr, String expiryDateStr,
                                                    String credentialId, String credentialUrl,
                                                    List<Integer> skillIds) {
        return updateCertification(studentId, certId, certName, issuer, issueDateStr, expiryDateStr, credentialId, credentialUrl, null, skillIds);
    }

    public boolean updateCertification(Certification cert, List<Integer> skillIds, int studentId) {
        String issueStr = cert.getIssueDate() != null ? cert.getIssueDate().toString() : null;
        String expiryStr = cert.getExpiryDate() != null ? cert.getExpiryDate().toString() : null;

        CertificationResult res = updateCertification(studentId, cert.getCertificationId(), cert.getCertificateName(), cert.getIssuer(),
                issueStr, expiryStr, cert.getCredentialId(), cert.getCredentialUrl(), cert.getCertificateFile(), skillIds);

        if (!res.isSuccess()) {
            throw new IllegalArgumentException(res.getMessage());
        }
        return true;
    }

    public boolean deleteCertification(int certId, int studentId) {
        if (certId <= 0 || studentId <= 0) return false;
        return certificationDAO.deleteCertification(certId, studentId);
    }

    private static class ValidationResult {
        private final boolean success;
        private final String message;
        private final Date issueDate;
        private final Date expiryDate;

        public ValidationResult(boolean success, String message, Date issueDate, Date expiryDate) {
            this.success = success;
            this.message = message;
            this.issueDate = issueDate;
            this.expiryDate = expiryDate;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public Date getIssueDate() { return issueDate; }
        public Date getExpiryDate() { return expiryDate; }
    }

    public static ValidationResult validateCertificationInput(String certName, String issuer, String credentialUrl,
                                                                String issueDateStr, String expiryDateStr) {
        if (certName == null || certName.trim().isEmpty()) {
            return new ValidationResult(false, "Certificate name is required.", null, null);
        }
        if (certName.trim().length() > 200) {
            return new ValidationResult(false, "Certificate name cannot exceed 200 characters.", null, null);
        }

        if (issuer == null || issuer.trim().isEmpty()) {
            return new ValidationResult(false, "Issuing organization is required.", null, null);
        }
        if (issuer.trim().length() > 150) {
            return new ValidationResult(false, "Issuing organization name cannot exceed 150 characters.", null, null);
        }

        if (credentialUrl != null && !credentialUrl.trim().isEmpty()) {
            String cu = credentialUrl.trim().toLowerCase();
            if (!cu.startsWith("http://") && !cu.startsWith("https://")) {
                return new ValidationResult(false, "Credential URL must start with http:// or https://", null, null);
            }
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setLenient(false);

        Date issueDate = null;
        Date expiryDate = null;

        if (issueDateStr != null && !issueDateStr.trim().isEmpty()) {
            try {
                java.util.Date parsed = sdf.parse(issueDateStr.trim());
                issueDate = new Date(parsed.getTime());
            } catch (ParseException e) {
                return new ValidationResult(false, "Issue Date must be in YYYY-MM-DD format.", null, null);
            }
        }

        if (expiryDateStr != null && !expiryDateStr.trim().isEmpty()) {
            try {
                java.util.Date parsed = sdf.parse(expiryDateStr.trim());
                expiryDate = new Date(parsed.getTime());
            } catch (ParseException e) {
                return new ValidationResult(false, "Expiry Date must be in YYYY-MM-DD format.", null, null);
            }
        }

        if (issueDate != null && expiryDate != null && issueDate.after(expiryDate)) {
            return new ValidationResult(false, "Issue Date cannot be after Expiry Date.", null, null);
        }

        return new ValidationResult(true, "Valid input", issueDate, expiryDate);
    }
}
