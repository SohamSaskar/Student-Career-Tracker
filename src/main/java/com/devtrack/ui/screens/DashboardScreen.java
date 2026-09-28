package com.devtrack.ui.screens;

import com.devtrack.model.CareerRole;
import com.devtrack.model.Certification;
import com.devtrack.model.Project;
import com.devtrack.model.Skill;
import com.devtrack.model.Student;
import com.devtrack.service.DashboardData;
import com.devtrack.service.DashboardService;
import com.devtrack.ui.components.*;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.List;

/**
 * DevTrack Main Dashboard Screen (Phase 5).
 * Central student workspace presenting career readiness metrics, skill counts, required skills progress,
 * recent projects, certifications, and activity timeline.
 */
public class DashboardScreen extends JPanel {

    public interface NavigationRequestListener {
        void onRequestNavigate(String screenName);
    }

    private final JPanel contentContainer;
    private final DashboardService dashboardService;
    private final NavigationRequestListener navListener;
    private Timer greetingTimer;

    public DashboardScreen(NavigationRequestListener navListener) {
        this.navListener = navListener;
        this.dashboardService = new DashboardService();

        setLayout(new BorderLayout());
        setBackground(DevTrackColors.BG_APP);

        contentContainer = new JPanel();
        contentContainer.setLayout(new BoxLayout(contentContainer, BoxLayout.Y_AXIS));
        contentContainer.setOpaque(false);
        contentContainer.setBorder(new EmptyBorder(24, 32, 24, 32));

        JScrollPane scrollPane = new JScrollPane(contentContainer);
        scrollPane.setBorder(null);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.getVerticalScrollBar().setUnitIncrement(24);

        add(scrollPane, BorderLayout.CENTER);

        refreshData();
    }

    public void triggerEntranceAnimation() {
        refreshData();
    }

    /**
     * Refreshes dashboard data dynamically using the current logged-in student session.
     */
    public void refreshData() {
        if (greetingTimer != null && greetingTimer.isRunning()) {
            greetingTimer.stop();
        }

        contentContainer.removeAll();

        int studentId = SessionManager.getInstance().getCurrentStudentId();
        DashboardData data = dashboardService.loadDashboardData(studentId);

        if (data.getStudent() == null) {
            contentContainer.add(createErrorPanel("Unable to load student data. Please log in again."));
        } else {
            // 1. Header Section with Dynamic Animated Greeting
            contentContainer.add(createHeaderSection(data.getStudent(), data.getCareerRole()));
            contentContainer.add(Box.createVerticalStrut(20));

            // 2. Career Summary Section (Readiness + Career Goal)
            contentContainer.add(createCareerSummarySection(data));
            contentContainer.add(Box.createVerticalStrut(20));

            // 3. Skill Overview Metrics Section
            contentContainer.add(createSkillOverviewSection(data));
            contentContainer.add(Box.createVerticalStrut(20));

            // 4. Required Skills Progress Section
            contentContainer.add(createRequiredSkillsSection(data.getRequiredSkills()));
            contentContainer.add(Box.createVerticalStrut(20));

            // 5. Recent Work & Certifications Grid Section
            contentContainer.add(createRecentWorkAndCertificationsSection(data.getRecentProjects(), data.getRecentCertifications()));
            contentContainer.add(Box.createVerticalStrut(20));

            // 6. Recent Activity Section
            contentContainer.add(createRecentActivitySection(data.getRecentActivities()));
        }

        contentContainer.revalidate();
        contentContainer.repaint();
    }

    // --- SECTION 1: HEADER WITH DYNAMIC ANIMATED GREETING ---
    private JPanel createHeaderSection(Student student, CareerRole role) {
        JPanel header = new JPanel(new BorderLayout(0, 4));
        header.setOpaque(false);

        String rawName = student != null ? student.getName() : "Student";
        String firstName = (rawName != null && !rawName.trim().isEmpty()) ? rawName.trim().split("\\s+")[0] : "Student";

        JLabel welcomeLabel = new JLabel("Hello, " + firstName.charAt(0));
        welcomeLabel.setFont(DevTrackFonts.PAGE_TITLE);
        welcomeLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        final String targetName = firstName;
        final int nameLength = targetName.length();

        if (nameLength > 0) {
            greetingTimer = new Timer(110, new java.awt.event.ActionListener() {
                private int index = 1;
                private boolean forward = true;
                private int pauseCount = 0;

                @Override
                public void actionPerformed(java.awt.event.ActionEvent e) {
                    if (pauseCount > 0) {
                        pauseCount--;
                        return;
                    }

                    if (forward) {
                        index++;
                        if (index >= nameLength) {
                            index = nameLength;
                            forward = false;
                            pauseCount = 20; // Pause ~2.2s when full name is typed
                        }
                    } else {
                        index--;
                        if (index <= 1) {
                            index = 1;
                            forward = true;
                            pauseCount = 5; // Pause ~0.55s before re-typing
                        }
                    }

                    String currentSub = targetName.substring(0, index);
                    welcomeLabel.setText("Hello, " + currentSub);
                }
            });
            greetingTimer.start();
        }

        String roleName = role != null ? role.getRoleName() : "your target career";
        JLabel subtitleLabel = new JLabel("Here's your current progress toward " + roleName + ".");
        subtitleLabel.setFont(DevTrackFonts.SECONDARY);
        subtitleLabel.setForeground(DevTrackColors.TEXT_SECONDARY);

        header.add(welcomeLabel, BorderLayout.NORTH);
        header.add(subtitleLabel, BorderLayout.CENTER);

        return header;
    }

    // --- SECTION 2: CAREER SUMMARY ---
    private JPanel createCareerSummarySection(DashboardData data) {
        JPanel summaryGrid = new JPanel(new GridLayout(1, 2, 16, 0));
        summaryGrid.setOpaque(false);

        // A. Career Readiness Card
        DTCard readinessCard = new DTCard();
        readinessCard.setLayout(new BorderLayout(0, 12));

        JLabel readinessTitle = new JLabel("Career Readiness");
        readinessTitle.setFont(DevTrackFonts.CARD_TITLE);
        readinessTitle.setForeground(DevTrackColors.TEXT_SECONDARY);

        JPanel percentBox = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        percentBox.setOpaque(false);

        JLabel percentLabel = new JLabel(data.getReadinessPercentage() + "%");
        percentLabel.setFont(DevTrackFonts.METRIC);
        percentLabel.setForeground(DevTrackColors.ACCENT_PRIMARY);

        JLabel percentSub = new JLabel("  (" + data.getCompletedSkillCount() + " of " + (data.getCompletedSkillCount() + data.getSkillGapCount()) + " required skills)");
        percentSub.setFont(DevTrackFonts.CAPTION);
        percentSub.setForeground(DevTrackColors.TEXT_MUTED);

        percentBox.add(percentLabel);
        percentBox.add(percentSub);

        DTProgressBar progressBar = new DTProgressBar(data.getReadinessPercentage() / 100.0);
        progressBar.setProgress(data.getReadinessPercentage() / 100.0);

        readinessCard.add(readinessTitle, BorderLayout.NORTH);
        readinessCard.add(percentBox, BorderLayout.CENTER);
        readinessCard.add(progressBar, BorderLayout.SOUTH);

        // B. Current Career Goal Card
        DTCard goalCard = new DTCard();
        goalCard.setLayout(new BorderLayout(0, 8));

        JPanel goalHeader = new JPanel(new BorderLayout());
        goalHeader.setOpaque(false);

        JLabel goalTitleLabel = new JLabel("Current Career Goal");
        goalTitleLabel.setFont(DevTrackFonts.CARD_TITLE);
        goalTitleLabel.setForeground(DevTrackColors.TEXT_SECONDARY);

        DTBadge goalBadge = new DTBadge("Planned");
        goalBadge.setText("PRIMARY GOAL");

        goalHeader.add(goalTitleLabel, BorderLayout.WEST);
        goalHeader.add(goalBadge, BorderLayout.EAST);

        String roleName = data.getCareerRole() != null ? data.getCareerRole().getRoleName() : "No career goal selected";
        JLabel roleLabel = new JLabel(roleName);
        roleLabel.setFont(DevTrackFonts.PAGE_TITLE);
        roleLabel.setForeground(data.getCareerRole() != null ? DevTrackColors.TEXT_PRIMARY : DevTrackColors.TEXT_MUTED);

        String roleDesc = data.getCareerRole() != null && data.getCareerRole().getDescription() != null ?
                data.getCareerRole().getDescription() : "Complete onboarding to select a target career path.";
        JLabel descLabel = new JLabel("<html>" + roleDesc + "</html>");
        descLabel.setFont(DevTrackFonts.CAPTION);
        descLabel.setForeground(DevTrackColors.TEXT_MUTED);

        goalCard.add(goalHeader, BorderLayout.NORTH);
        goalCard.add(roleLabel, BorderLayout.CENTER);
        goalCard.add(descLabel, BorderLayout.SOUTH);

        summaryGrid.add(readinessCard);
        summaryGrid.add(goalCard);

        return summaryGrid;
    }

    // --- SECTION 3: SKILL OVERVIEW METRICS ---
    private JPanel createSkillOverviewSection(DashboardData data) {
        JPanel grid = new JPanel(new GridLayout(1, 3, 16, 0));
        grid.setOpaque(false);

        DTCard completedCard = createMetricCard("Completed", String.valueOf(data.getCompletedSkillCount()), "Required Skills Mastered", DevTrackColors.SUCCESS_MAIN);
        DTCard learningCard = createMetricCard("Learning", String.valueOf(data.getLearningSkillCount()), "Skills Currently In-Progress", DevTrackColors.ACCENT_PRIMARY);
        DTCard skillGapCard = createMetricCard("Skill Gap", String.valueOf(data.getSkillGapCount()), "Required Skills Missing", DevTrackColors.MISSING_MAIN);

        skillGapCard.setCursor(new Cursor(Cursor.HAND_CURSOR));
        skillGapCard.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent e) {
                if (navListener != null) {
                    navListener.onRequestNavigate("Skill Gap");
                }
            }
        });

        grid.add(completedCard);
        grid.add(learningCard);
        grid.add(skillGapCard);

        return grid;
    }

    private DTCard createMetricCard(String title, String val, String subtitle, Color accentColor) {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 6));

        JPanel topRow = new JPanel(new BorderLayout());
        topRow.setOpaque(false);

        JLabel titleLbl = new JLabel(title);
        titleLbl.setFont(DevTrackFonts.CARD_TITLE);
        titleLbl.setForeground(DevTrackColors.TEXT_SECONDARY);

        JPanel dot = new JPanel();
        dot.setPreferredSize(new Dimension(8, 8));
        dot.setBackground(accentColor);

        topRow.add(titleLbl, BorderLayout.WEST);
        topRow.add(dot, BorderLayout.EAST);

        JLabel valLbl = new JLabel(val);
        valLbl.setFont(DevTrackFonts.METRIC);
        valLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel subLbl = new JLabel(subtitle);
        subLbl.setFont(DevTrackFonts.CAPTION);
        subLbl.setForeground(DevTrackColors.TEXT_MUTED);

        card.add(topRow, BorderLayout.NORTH);
        card.add(valLbl, BorderLayout.CENTER);
        card.add(subLbl, BorderLayout.SOUTH);

        return card;
    }

    // --- SECTION 4: REQUIRED SKILLS PROGRESS ---
    private JPanel createRequiredSkillsSection(List<Skill> skills) {
        DTCard container = new DTCard();
        container.setLayout(new BorderLayout(0, 12));

        JLabel sectionTitle = new JLabel("Required Skills");
        sectionTitle.setFont(DevTrackFonts.CARD_TITLE);
        sectionTitle.setForeground(DevTrackColors.TEXT_PRIMARY);

        container.add(sectionTitle, BorderLayout.NORTH);

        if (skills == null || skills.isEmpty()) {
            JLabel emptyLbl = new JLabel("No required skills found for this career goal.");
            emptyLbl.setFont(DevTrackFonts.BODY);
            emptyLbl.setForeground(DevTrackColors.TEXT_MUTED);
            emptyLbl.setBorder(new EmptyBorder(12, 0, 12, 0));
            container.add(emptyLbl, BorderLayout.CENTER);
        } else {
            JPanel listPanel = new JPanel();
            listPanel.setLayout(new BoxLayout(listPanel, BoxLayout.Y_AXIS));
            listPanel.setOpaque(false);

            for (Skill s : skills) {
                listPanel.add(createSkillRow(s));
                listPanel.add(Box.createVerticalStrut(8));
            }
            container.add(listPanel, BorderLayout.CENTER);
        }

        return container;
    }

    private JPanel createSkillRow(Skill s) {
        JPanel row = new JPanel(new BorderLayout(12, 0));
        row.setOpaque(false);
        row.setBorder(new EmptyBorder(6, 8, 6, 8));

        JLabel nameLbl = new JLabel(s.getSkillName());
        nameLbl.setFont(DevTrackFonts.FORM_LABEL);
        nameLbl.setForeground(DevTrackColors.TEXT_PRIMARY);
        nameLbl.setPreferredSize(new Dimension(180, 24));

        JLabel categoryLbl = new JLabel(s.getCategory() != null ? s.getCategory() : "General");
        categoryLbl.setFont(DevTrackFonts.CAPTION);
        categoryLbl.setForeground(DevTrackColors.TEXT_MUTED);
        categoryLbl.setPreferredSize(new Dimension(120, 24));

        row.add(nameLbl, BorderLayout.WEST);
        row.add(categoryLbl, BorderLayout.CENTER);
        row.add(new DTBadge(s.getStatus()), BorderLayout.EAST);

        return row;
    }

    // --- SECTION 5: RECENT WORK & CERTIFICATIONS GRID ---
    private JPanel createRecentWorkAndCertificationsSection(List<Project> projects, List<Certification> certs) {
        JPanel grid = new JPanel(new GridLayout(1, 2, 16, 0));
        grid.setOpaque(false);

        grid.add(createRecentProjectsCard(projects));
        grid.add(createRecentCertificationsCard(certs));

        return grid;
    }

    private DTCard createRecentProjectsCard(List<Project> projects) {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);

        JLabel titleLbl = new JLabel("Recent Projects");
        titleLbl.setFont(DevTrackFonts.CARD_TITLE);
        titleLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

        DTButton viewAllBtn = new DTButton("View All", DTButton.ButtonType.SECONDARY);
        viewAllBtn.setPreferredSize(new Dimension(75, 26));
        viewAllBtn.addActionListener(e -> {
            if (navListener != null) navListener.onRequestNavigate("Project Vault");
        });

        header.add(titleLbl, BorderLayout.WEST);
        header.add(viewAllBtn, BorderLayout.EAST);

        card.add(header, BorderLayout.NORTH);

        if (projects == null || projects.isEmpty()) {
            JLabel emptyLbl = new JLabel("No projects added yet.");
            emptyLbl.setFont(DevTrackFonts.BODY);
            emptyLbl.setForeground(DevTrackColors.TEXT_MUTED);
            emptyLbl.setBorder(new EmptyBorder(8, 0, 8, 0));
            card.add(emptyLbl, BorderLayout.CENTER);
        } else {
            JPanel list = new JPanel();
            list.setLayout(new BoxLayout(list, BoxLayout.Y_AXIS));
            list.setOpaque(false);

            for (Project p : projects) {
                JPanel item = new JPanel(new BorderLayout());
                item.setOpaque(false);
                JLabel pTitle = new JLabel(p.getProjectName());
                pTitle.setFont(DevTrackFonts.BODY_BOLD);
                pTitle.setForeground(DevTrackColors.TEXT_PRIMARY);

                JLabel pStatus = new JLabel(p.getStatus());
                pStatus.setFont(DevTrackFonts.CAPTION);
                pStatus.setForeground(DevTrackColors.TEXT_SECONDARY);

                item.add(pTitle, BorderLayout.WEST);
                item.add(pStatus, BorderLayout.EAST);

                list.add(item);
                list.add(Box.createVerticalStrut(8));
            }
            card.add(list, BorderLayout.CENTER);
        }

        return card;
    }

    private DTCard createRecentCertificationsCard(List<Certification> certs) {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);

        JLabel titleLbl = new JLabel("Recent Certifications");
        titleLbl.setFont(DevTrackFonts.CARD_TITLE);
        titleLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

        DTButton viewAllBtn = new DTButton("View All", DTButton.ButtonType.SECONDARY);
        viewAllBtn.setPreferredSize(new Dimension(75, 26));
        viewAllBtn.addActionListener(e -> {
            if (navListener != null) navListener.onRequestNavigate("Certification Vault");
        });

        header.add(titleLbl, BorderLayout.WEST);
        header.add(viewAllBtn, BorderLayout.EAST);

        card.add(header, BorderLayout.NORTH);

        if (certs == null || certs.isEmpty()) {
            JLabel emptyLbl = new JLabel("No certifications added yet.");
            emptyLbl.setFont(DevTrackFonts.BODY);
            emptyLbl.setForeground(DevTrackColors.TEXT_MUTED);
            emptyLbl.setBorder(new EmptyBorder(8, 0, 8, 0));
            card.add(emptyLbl, BorderLayout.CENTER);
        } else {
            JPanel list = new JPanel();
            list.setLayout(new BoxLayout(list, BoxLayout.Y_AXIS));
            list.setOpaque(false);

            for (Certification c : certs) {
                JPanel item = new JPanel(new BorderLayout());
                item.setOpaque(false);
                JLabel cTitle = new JLabel(c.getCertificateName());
                cTitle.setFont(DevTrackFonts.BODY_BOLD);
                cTitle.setForeground(DevTrackColors.TEXT_PRIMARY);

                JLabel cIssuer = new JLabel(c.getIssuer() != null ? c.getIssuer() : "");
                cIssuer.setFont(DevTrackFonts.CAPTION);
                cIssuer.setForeground(DevTrackColors.TEXT_SECONDARY);

                item.add(cTitle, BorderLayout.WEST);
                item.add(cIssuer, BorderLayout.EAST);

                list.add(item);
                list.add(Box.createVerticalStrut(8));
            }
            card.add(list, BorderLayout.CENTER);
        }

        return card;
    }

    // --- SECTION 6: RECENT ACTIVITY ---
    private JPanel createRecentActivitySection(List<String> activities) {
        DTCard container = new DTCard();
        container.setLayout(new BorderLayout(0, 12));

        JLabel sectionTitle = new JLabel("Recent Activity");
        sectionTitle.setFont(DevTrackFonts.CARD_TITLE);
        sectionTitle.setForeground(DevTrackColors.TEXT_PRIMARY);

        container.add(sectionTitle, BorderLayout.NORTH);

        if (activities == null || activities.isEmpty()) {
            JLabel emptyLbl = new JLabel("No recent activity recorded.");
            emptyLbl.setFont(DevTrackFonts.BODY);
            emptyLbl.setForeground(DevTrackColors.TEXT_MUTED);
            emptyLbl.setBorder(new EmptyBorder(8, 0, 8, 0));
            container.add(emptyLbl, BorderLayout.CENTER);
        } else {
            JPanel listPanel = new JPanel();
            listPanel.setLayout(new BoxLayout(listPanel, BoxLayout.Y_AXIS));
            listPanel.setOpaque(false);

            for (String act : activities) {
                JLabel actLbl = new JLabel("•  " + act);
                actLbl.setFont(DevTrackFonts.BODY);
                actLbl.setForeground(DevTrackColors.TEXT_SECONDARY);

                listPanel.add(actLbl);
                listPanel.add(Box.createVerticalStrut(6));
            }
            container.add(listPanel, BorderLayout.CENTER);
        }

        return container;
    }

    private JPanel createErrorPanel(String msg) {
        JPanel p = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 20));
        p.setOpaque(false);

        JLabel errLbl = new JLabel(msg);
        errLbl.setFont(DevTrackFonts.BODY);
        errLbl.setForeground(DevTrackColors.ERROR_TEXT);

        p.add(errLbl);
        return p;
    }
}
