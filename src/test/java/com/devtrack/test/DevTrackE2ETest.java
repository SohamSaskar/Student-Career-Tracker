package com.devtrack.test;

import com.devtrack.dao.*;
import com.devtrack.model.*;
import com.devtrack.service.*;
import com.devtrack.util.FileStorageUtil;
import com.devtrack.util.SessionManager;
import com.devtrack.ui.theme.DevTrackUI;

import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;

/**
 * Master End-to-End Automated Test Suite for DevTrack Application.
 * Executes the complete student journey across all 12 core application modules.
 */
public class DevTrackE2ETest {

    private static int passCount = 0;
    private static int failCount = 0;

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println(" DEVTRACK MASTER E2E AUTOMATED VERIFICATION SUITE ");
        System.out.println("==================================================");

        DevTrackUI.install();

        runModule("Authentication", DevTrackE2ETest::testAuthentication);
        runModule("Onboarding", DevTrackE2ETest::testOnboarding);
        runModule("Dashboard", DevTrackE2ETest::testDashboard);
        runModule("Skills", DevTrackE2ETest::testSkills);
        runModule("Skill Gap", DevTrackE2ETest::testSkillGap);
        runModule("Recommendations", DevTrackE2ETest::testRecommendations);
        runModule("Roadmap", DevTrackE2ETest::testRoadmap);
        runModule("Project Vault", DevTrackE2ETest::testProjectVault);
        runModule("Certification Vault", DevTrackE2ETest::testCertificationVault);
        runModule("User Isolation", DevTrackE2ETest::testUserIsolation);
        runModule("Persistence", DevTrackE2ETest::testPersistence);
        runModule("Error Handling", DevTrackE2ETest::testErrorHandling);

        System.out.println("\n=================================");
        System.out.println("DEVTRACK E2E TEST REPORT");
        System.out.println("=================================");
        System.out.println("TOTAL: " + passCount + "/" + (passCount + failCount) + " PASS");
        System.out.println("=================================");

        if (failCount > 0) {
            System.exit(1);
        }
    }

    private static void runModule(String name, Runnable test) {
        try {
            test.run();
            passCount++;
            System.out.printf("%-20s PASS\n", name);
        } catch (Throwable t) {
            failCount++;
            System.out.printf("%-20s FAIL (%s)\n", name, t.getMessage());
            t.printStackTrace();
        }
    }

    // 1. AUTHENTICATION MODULE
    private static void testAuthentication() {
        AuthService auth = new AuthService();
        long ts = System.currentTimeMillis();
        String testUser = "e2e_user_" + ts;
        String testEmail = "e2e_auth_" + ts + "@devtrack.edu";

        // Invalid Username check
        AuthService.AuthResult invalidUser = auth.signup("Test Auth", "invalid user!", testEmail, "pass1234", "pass1234", "Sanjivani", "AI", "3");
        if (invalidUser.isSuccess()) throw new RuntimeException("Invalid username with special chars should be rejected");

        // Duplicate/Validation check
        AuthService.AuthResult dupCheck = auth.signup("Test Auth", testUser, testEmail, "pass1234", "pass1234", "Sanjivani", "AI", "3");
        if (!dupCheck.isSuccess()) throw new RuntimeException("Signup failed: " + dupCheck.getMessage());

        // Duplicate Username check
        AuthService.AuthResult dupUserFail = auth.signup("Test Auth 2", testUser, "other_" + ts + "@devtrack.edu", "pass1234", "pass1234", "Sanjivani", "AI", "3");
        if (dupUserFail.isSuccess()) throw new RuntimeException("Duplicate username should have been rejected");

        // Duplicate Email check
        AuthService.AuthResult dupEmailFail = auth.signup("Test Auth 3", "other_user_" + ts, testEmail, "pass1234", "pass1234", "Sanjivani", "AI", "3");
        if (dupEmailFail.isSuccess()) throw new RuntimeException("Duplicate email should have been rejected");

        // Login with Username + Password check
        SessionManager.getInstance().logout();
        AuthService.AuthResult loginRes = auth.login(testUser, "pass1234");
        if (!loginRes.isSuccess() || SessionManager.getInstance().getCurrentStudent() == null) {
            throw new RuntimeException("Login failed for registered user with username");
        }

        SessionManager.getInstance().logout();
    }

    // 2. ONBOARDING MODULE
    private static void testOnboarding() {
        AuthService auth = new AuthService();
        long ts = System.currentTimeMillis();
        String username = "onboard_user_" + ts;
        String email = "e2e_onboard_" + ts + "@devtrack.edu";
        AuthService.AuthResult signupRes = auth.signup("Onboarding Student", username, email, "password123", "password123", "Sanjivani", "AI & Data Science", "3");
        if (!signupRes.isSuccess()) throw new RuntimeException("Onboarding signup failed: " + signupRes.getMessage());

        int studentId = SessionManager.getInstance().getCurrentStudentId();
        OnboardingService onboardingService = new OnboardingService();

        Student student = new Student(studentId, "Onboarding Student", username, email, null, "Sanjivani University", "Computer Engineering", 4, null);
        boolean updated = onboardingService.updateStudentProfile(student);
        if (!updated) throw new RuntimeException("Profile update failed");

        boolean goalSet = onboardingService.saveCareerGoal(studentId, 1);
        if (!goalSet) throw new RuntimeException("Career goal selection failed");
    }

    // 3. DASHBOARD MODULE
    private static void testDashboard() {
        int studentId = SessionManager.getInstance().getCurrentStudentId();
        DashboardService dashboardService = new DashboardService();
        DashboardData data = dashboardService.loadDashboardData(studentId);

        if (data.getStudent() == null) throw new RuntimeException("Dashboard student data null");
        if (data.getCareerRole() == null) throw new RuntimeException("Dashboard career role null");
    }

    // 4. SKILLS MODULE
    private static void testSkills() {
        int studentId = SessionManager.getInstance().getCurrentStudentId();
        StudentSkillDAO studentSkillDAO = new StudentSkillDAO();

        boolean s1 = studentSkillDAO.updateSkillStatus(studentId, 1, "Completed");
        boolean s2 = studentSkillDAO.updateSkillStatus(studentId, 4, "Learning");
        if (!s1 || !s2) throw new RuntimeException("Skill inventory updates failed");
    }

    // 5. SKILL GAP MODULE
    private static void testSkillGap() {
        int studentId = SessionManager.getInstance().getCurrentStudentId();
        SkillGapService gapService = new SkillGapService();
        SkillGapData gapData = gapService.loadSkillGapData(studentId);

        if (gapData.getCareerRole() == null) throw new RuntimeException("Skill gap target role missing");
        if (gapData.getReadinessPercentage() < 0) throw new RuntimeException("Invalid readiness percentage");
    }

    // 6. RECOMMENDATIONS MODULE
    private static void testRecommendations() {
        int studentId = SessionManager.getInstance().getCurrentStudentId();
        RecommendedSkillsService recService = new RecommendedSkillsService();
        RecommendedSkillsData recData = recService.loadRecommendedSkillsData(studentId);

        if (recData.getRecommendedSkills() == null) throw new RuntimeException("Skill recommendations null");
    }

    // 7. ROADMAP MODULE
    private static void testRoadmap() {
        int studentId = SessionManager.getInstance().getCurrentStudentId();
        LearningRoadmapService roadmapService = new LearningRoadmapService();
        RoadmapData data = roadmapService.loadRoadmapData(studentId);

        if (data.getNextUpItems() == null) throw new RuntimeException("Roadmap missing skills null");
    }

    // 8. PROJECT VAULT MODULE
    private static void testProjectVault() {
        int studentId = SessionManager.getInstance().getCurrentStudentId();
        ProjectService projService = new ProjectService();

        List<Integer> skillIds = new ArrayList<>();
        skillIds.add(1);
        skillIds.add(4);

        ProjectService.ProjectResult res = projService.createProject(
                studentId, "E2E Portfolio App", "Test Description",
                "https://github.com/test/repo", "https://demo.com",
                "In Progress", "2026-01-01", "2026-05-01", skillIds
        );
        if (!res.isSuccess()) throw new RuntimeException("Project creation failed: " + res.getMessage());

        List<ProjectDetails> projects = projService.getProjectsForCurrentStudent();
        if (projects.isEmpty()) throw new RuntimeException("No projects retrieved for current student");
    }

    // 9. CERTIFICATION VAULT MODULE
    private static void testCertificationVault() {
        int studentId = SessionManager.getInstance().getCurrentStudentId();
        CertificationService certService = new CertificationService();

        try {
            File tempPdf = File.createTempFile("e2e_sample_cert", ".pdf");
            tempPdf.deleteOnExit();
            try (FileWriter fw = new FileWriter(tempPdf)) {
                fw.write("%PDF-1.4 E2E Sample Certificate PDF Content");
            }

            FileStorageUtil.FileUploadResult uploadRes = FileStorageUtil.saveCertificateFile(tempPdf);
            if (!uploadRes.isSuccess()) throw new RuntimeException("Certificate upload failed");

            List<Integer> skillIds = new ArrayList<>();
            skillIds.add(1);

            CertificationService.CertificationResult res = certService.createCertification(
                    studentId, "E2E Java Certificate", "Oracle",
                    "2026-01-01", "2028-01-01", "ORACLE-12345",
                    "https://oracle.com/verify", uploadRes.getRelativePath(), skillIds
            );
            if (!res.isSuccess()) throw new RuntimeException("Certification creation failed: " + res.getMessage());

            List<CertificationDetails> certs = certService.getCertificationsForCurrentStudent();
            if (certs.isEmpty()) throw new RuntimeException("No certifications retrieved");

        } catch (Exception ex) {
            throw new RuntimeException("Certification Vault test error: " + ex.getMessage(), ex);
        }
    }

    // 10. USER ISOLATION MODULE
    private static void testUserIsolation() {
        AuthService auth = new AuthService();
        String e1 = "student_a_" + System.currentTimeMillis() + "@devtrack.edu";
        String e2 = "student_b_" + System.currentTimeMillis() + "@devtrack.edu";

        auth.signup("Student A", e1, "passA1234", "passA1234", "Sanjivani", "AI", "3");
        int idA = SessionManager.getInstance().getCurrentStudentId();

        ProjectService projService = new ProjectService();
        projService.createProject(idA, "Private Project A", "Secret A", "", "", "Planned", "", "", new ArrayList<>());

        auth.signup("Student B", e2, "passB1234", "passB1234", "Sanjivani", "AI", "3");
        int idB = SessionManager.getInstance().getCurrentStudentId();

        List<ProjectDetails> bProjects = projService.getProjectsForCurrentStudent();
        for (ProjectDetails pd : bProjects) {
            if (pd.getProject().getTitle().equals("Private Project A")) {
                throw new RuntimeException("ISOLATION BREACH: Student B can see Student A project!");
            }
        }
    }

    // 11. PERSISTENCE MODULE
    private static void testPersistence() {
        int studentId = SessionManager.getInstance().getCurrentStudentId();
        StudentDAO studentDAO = new StudentDAO();

        Student s = studentDAO.getStudentById(studentId);
        if (s == null) throw new RuntimeException("Persistence retrieval failed");
    }

    // 12. ERROR HANDLING MODULE
    private static void testErrorHandling() {
        ProjectService projService = new ProjectService();
        ProjectService.ProjectResult res = projService.createProject(
                SessionManager.getInstance().getCurrentStudentId(),
                "", "", "invalid-url", "", "In Progress", "2026-05-01", "2026-01-01", new ArrayList<>()
        );

        if (res.isSuccess()) {
            throw new RuntimeException("Validation error should have blocked invalid project input");
        }
    }
}

