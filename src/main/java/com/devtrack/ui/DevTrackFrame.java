package com.devtrack.ui;

import com.devtrack.ui.components.NavPanel;
import com.devtrack.ui.screens.*;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import java.awt.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

/**
 * DevTrack Main Application Window Frame (Nordic Technical Dark).
 * Manages top horizontal navigation bar and CardLayout multi-screen router across all sections.
 */
public class DevTrackFrame extends JFrame {

    public interface OnLogoutListener {
        void onLogout();
    }

    private final CardLayout cardLayout;
    private final JPanel contentPanel;
    private final NavPanel navBar;
    private final DashboardScreen dashboardScreen;
    private final SkillGapScreen skillGapScreen;
    private final RecommendedSkillsScreen recommendedSkillsScreen;
    private final LearningRoadmapScreen learningRoadmapScreen;
    private final ProjectVaultScreen projectVaultScreen;
    private final CertificationVaultScreen certificationVaultScreen;
    private final CareerGoalScreen careerGoalScreen;
    private final SkillsScreen skillsScreen;
    private final ProfileScreen profileScreen;

    private OnLogoutListener logoutListener;

    public DevTrackFrame(OnLogoutListener logoutListener) {
        super("DevTrack — Developer Career Readiness Platform");
        this.logoutListener = logoutListener;

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1240, 860);
        setMinimumSize(new Dimension(1040, 700));
        setLocationRelativeTo(null); // Center on screen
        getContentPane().setBackground(DevTrackColors.BG_APP);

        JPanel mainContainer = new JPanel(new BorderLayout());
        mainContainer.setBackground(DevTrackColors.BG_APP);

        // CardLayout Multi-Screen Router
        cardLayout = new CardLayout();
        contentPanel = new JPanel(cardLayout);
        contentPanel.setOpaque(false);

        // Global Data Change Listener
        Runnable refreshAll = () -> refreshAllScreens();

        // Instantiate All Screens with Data Change Listeners
        dashboardScreen = new DashboardScreen(targetScreen -> showScreen(targetScreen));
        skillGapScreen = new SkillGapScreen(targetScreen -> showScreen(targetScreen));
        recommendedSkillsScreen = new RecommendedSkillsScreen(targetScreen -> showScreen(targetScreen));
        learningRoadmapScreen = new LearningRoadmapScreen(() -> refreshAll.run());
        projectVaultScreen = new ProjectVaultScreen();
        certificationVaultScreen = new CertificationVaultScreen();
        careerGoalScreen = new CareerGoalScreen(() -> refreshAll.run());
        skillsScreen = new SkillsScreen(() -> refreshAll.run());
        profileScreen = new ProfileScreen(() -> refreshAll.run());

        // Register Screens in CardLayout Router
        contentPanel.add(dashboardScreen, "Dashboard");
        contentPanel.add(skillGapScreen, "Skill Gap");
        contentPanel.add(recommendedSkillsScreen, "Recommended Skills");
        contentPanel.add(learningRoadmapScreen, "Learning Roadmap");
        contentPanel.add(projectVaultScreen, "Project Vault");
        contentPanel.add(certificationVaultScreen, "Certification Vault");
        contentPanel.add(careerGoalScreen, "Career");
        contentPanel.add(skillsScreen, "Skills");
        contentPanel.add(profileScreen, "Profile");

        // Top Horizontal Navigation Bar
        navBar = new NavPanel(
            tabName -> showScreen(tabName),
            () -> performLogout()
        );

        mainContainer.add(navBar, BorderLayout.NORTH);
        mainContainer.add(contentPanel, BorderLayout.CENTER);

        add(mainContainer);

        addWindowListener(new WindowAdapter() {
            @Override
            public void windowOpened(WindowEvent e) {
                dashboardScreen.triggerEntranceAnimation();
            }
        });
    }

    public DevTrackFrame() {
        this(null);
    }

    public void performLogout() {
        SessionManager.getInstance().logout();
        dispose();
        if (logoutListener != null) {
            logoutListener.onLogout();
        } else {
            SwingUtilities.invokeLater(() -> {
                AuthFrame authFrame = new AuthFrame(() -> {
                    int currentStudentId = SessionManager.getInstance().getCurrentStudentId();
                    boolean onboarded = new com.devtrack.service.OnboardingService().isOnboarded(currentStudentId);
                    if (onboarded) {
                        DevTrackFrame newFrame = new DevTrackFrame();
                        newFrame.refreshAllScreens();
                        newFrame.setVisible(true);
                    } else {
                        OnboardingFrame onboardingFrame = new OnboardingFrame(() -> {
                            DevTrackFrame newFrame = new DevTrackFrame();
                            newFrame.refreshAllScreens();
                            newFrame.setVisible(true);
                        });
                        onboardingFrame.setVisible(true);
                    }
                });
                authFrame.setVisible(true);
            });
        }
    }

    public void refreshAllScreens() {
        dashboardScreen.refreshData();
        skillGapScreen.refreshData();
        recommendedSkillsScreen.refreshData();
        learningRoadmapScreen.refreshData();
        projectVaultScreen.loadProjects();
        certificationVaultScreen.loadCertifications();
        careerGoalScreen.refreshData();
        skillsScreen.refreshData();
        profileScreen.refreshData();
    }

    public void showScreen(String screenName) {
        cardLayout.show(contentPanel, screenName);
        navBar.setActiveTab(screenName);
        if (screenName.equals("Dashboard")) {
            dashboardScreen.triggerEntranceAnimation();
        } else if (screenName.equals("Skill Gap")) {
            skillGapScreen.refreshData();
        } else if (screenName.equals("Recommended Skills")) {
            recommendedSkillsScreen.refreshData();
        } else if (screenName.equals("Learning Roadmap")) {
            learningRoadmapScreen.refreshData();
        } else if (screenName.equals("Project Vault")) {
            projectVaultScreen.loadProjects();
        } else if (screenName.equals("Certification Vault")) {
            certificationVaultScreen.loadCertifications();
        }
    }
}
