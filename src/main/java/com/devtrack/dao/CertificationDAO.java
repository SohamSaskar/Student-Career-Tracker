package com.devtrack.dao;

import com.devtrack.model.Certification;
import com.devtrack.model.CertificationDetails;
import com.devtrack.model.Skill;
import com.devtrack.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object managing 'certifications' and 'certification_skills' tables with strict student isolation.
 */
public class CertificationDAO {

    /**
     * Retrieves all certifications with linked skills for a specific student.
     */
    public List<CertificationDetails> getAllCertificationsForStudent(int studentId) {
        List<CertificationDetails> list = new ArrayList<>();
        String sql = "SELECT certification_id, student_id, certificate_name, issuer, issue_date, expiry_date, credential_id, credential_url, certificate_file, created_at " +
                     "FROM certifications WHERE student_id = ? ORDER BY created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Certification c = mapResultSetToCertification(rs);
                    List<Skill> skills = getSkillsForCertification(c.getCertificationId());
                    list.add(new CertificationDetails(c, skills));
                }
            }
        } catch (SQLException e) {
            System.err.println("CertificationDAO.getAllCertificationsForStudent SQL Exception: " + e.getMessage());
        }
        return list;
    }

    /**
     * Retrieves recent certifications for a specific student.
     */
    public List<Certification> getRecentCertificationsForStudent(int studentId, int limit) {
        List<Certification> certifications = new ArrayList<>();
        String sql = "SELECT certification_id, student_id, certificate_name, issuer, issue_date, expiry_date, credential_id, credential_url, certificate_file, created_at " +
                     "FROM certifications WHERE student_id = ? ORDER BY created_at DESC LIMIT ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            ps.setInt(2, limit > 0 ? limit : 5);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    certifications.add(mapResultSetToCertification(rs));
                }
            }
        } catch (SQLException e) {
            System.err.println("CertificationDAO.getRecentCertificationsForStudent SQL Exception: " + e.getMessage());
        }
        return certifications;
    }

    /**
     * Retrieves a single certification by ID ensuring student isolation.
     */
    public CertificationDetails getCertificationById(int certificationId, int studentId) {
        String sql = "SELECT certification_id, student_id, certificate_name, issuer, issue_date, expiry_date, credential_id, credential_url, certificate_file, created_at " +
                     "FROM certifications WHERE certification_id = ? AND student_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, certificationId);
            ps.setInt(2, studentId);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Certification c = mapResultSetToCertification(rs);
                    List<Skill> skills = getSkillsForCertification(certificationId);
                    return new CertificationDetails(c, skills);
                }
            }
        } catch (SQLException e) {
            System.err.println("CertificationDAO.getCertificationById SQL Exception: " + e.getMessage());
        }
        return null;
    }

    /**
     * Creates a new certification record and links skills in a single transaction.
     */
    public int createCertification(Certification cert, List<Integer> skillIds) {
        String sqlCert = "INSERT INTO certifications (student_id, certificate_name, issuer, issue_date, expiry_date, credential_id, credential_url, certificate_file) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        String sqlSkill = "INSERT INTO certification_skills (certification_id, skill_id) VALUES (?, ?)";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            int generatedId = -1;
            try (PreparedStatement ps = conn.prepareStatement(sqlCert, Statement.RETURN_GENERATED_KEYS)) {
                ps.setInt(1, cert.getStudentId());
                ps.setString(2, cert.getCertificateName());
                ps.setString(3, cert.getIssuer());
                ps.setDate(4, cert.getIssueDate());
                ps.setDate(5, cert.getExpiryDate());
                ps.setString(6, cert.getCredentialId());
                ps.setString(7, cert.getCredentialUrl());
                ps.setString(8, cert.getCertificateFile());

                int affected = ps.executeUpdate();
                if (affected > 0) {
                    try (ResultSet rs = ps.getGeneratedKeys()) {
                        if (rs.next()) {
                            generatedId = rs.getInt(1);
                        }
                    }
                }
            }

            if (generatedId <= 0) {
                conn.rollback();
                return -1;
            }

            if (skillIds != null && !skillIds.isEmpty()) {
                try (PreparedStatement psSkill = conn.prepareStatement(sqlSkill)) {
                    for (int skillId : skillIds) {
                        psSkill.setInt(1, generatedId);
                        psSkill.setInt(2, skillId);
                        psSkill.addBatch();
                    }
                    psSkill.executeBatch();
                }
            }

            conn.commit();
            cert.setCertificationId(generatedId);
            return generatedId;

        } catch (SQLException e) {
            System.err.println("CertificationDAO.createCertification SQL Exception: " + e.getMessage());
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) {}
            }
            return -1;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ex) {}
            }
        }
    }

    /**
     * Updates an existing certification record and re-links skills in a transaction.
     */
    public boolean updateCertification(Certification cert, List<Integer> skillIds) {
        String sqlCert = "UPDATE certifications SET certificate_name = ?, issuer = ?, issue_date = ?, expiry_date = ?, " +
                         "credential_id = ?, credential_url = ?, certificate_file = ? WHERE certification_id = ? AND student_id = ?";
        String sqlClearSkills = "DELETE FROM certification_skills WHERE certification_id = ?";
        String sqlInsertSkill = "INSERT INTO certification_skills (certification_id, skill_id) VALUES (?, ?)";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement ps = conn.prepareStatement(sqlCert)) {
                ps.setString(1, cert.getCertificateName());
                ps.setString(2, cert.getIssuer());
                ps.setDate(3, cert.getIssueDate());
                ps.setDate(4, cert.getExpiryDate());
                ps.setString(5, cert.getCredentialId());
                ps.setString(6, cert.getCredentialUrl());
                ps.setString(7, cert.getCertificateFile());
                ps.setInt(8, cert.getCertificationId());
                ps.setInt(9, cert.getStudentId());

                int rows = ps.executeUpdate();
                if (rows == 0) {
                    conn.rollback();
                    return false;
                }
            }

            try (PreparedStatement psClear = conn.prepareStatement(sqlClearSkills)) {
                psClear.setInt(1, cert.getCertificationId());
                psClear.executeUpdate();
            }

            if (skillIds != null && !skillIds.isEmpty()) {
                try (PreparedStatement psSkill = conn.prepareStatement(sqlInsertSkill)) {
                    for (int skillId : skillIds) {
                        psSkill.setInt(1, cert.getCertificationId());
                        psSkill.setInt(2, skillId);
                        psSkill.addBatch();
                    }
                    psSkill.executeBatch();
                }
            }

            conn.commit();
            return true;

        } catch (SQLException e) {
            System.err.println("CertificationDAO.updateCertification SQL Exception: " + e.getMessage());
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ex) {}
            }
            return false;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ex) {}
            }
        }
    }

    /**
     * Deletes a certification record for a student.
     */
    public boolean deleteCertification(int certificationId, int studentId) {
        String sql = "DELETE FROM certifications WHERE certification_id = ? AND student_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, certificationId);
            ps.setInt(2, studentId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.err.println("CertificationDAO.deleteCertification SQL Exception: " + e.getMessage());
            return false;
        }
    }

    /**
     * Retrieves all skills linked to a specific certification.
     */
    public List<Skill> getSkillsForCertification(int certificationId) {
        List<Skill> skills = new ArrayList<>();
        String sql = "SELECT s.skill_id, s.skill_name, s.category FROM skills s " +
                     "JOIN certification_skills cs ON s.skill_id = cs.skill_id " +
                     "WHERE cs.certification_id = ? ORDER BY s.skill_name ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, certificationId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Skill sk = new Skill();
                    sk.setSkillId(rs.getInt("skill_id"));
                    sk.setSkillName(rs.getString("skill_name"));
                    sk.setCategory(rs.getString("category"));
                    skills.add(sk);
                }
            }
        } catch (SQLException e) {
            System.err.println("CertificationDAO.getSkillsForCertification SQL Exception: " + e.getMessage());
        }
        return skills;
    }

    private Certification mapResultSetToCertification(ResultSet rs) throws SQLException {
        return new Certification(
                rs.getInt("certification_id"),
                rs.getInt("student_id"),
                rs.getString("certificate_name"),
                rs.getString("issuer"),
                rs.getDate("issue_date"),
                rs.getDate("expiry_date"),
                rs.getString("credential_id"),
                rs.getString("credential_url"),
                rs.getString("certificate_file"),
                rs.getTimestamp("created_at")
        );
    }
}
