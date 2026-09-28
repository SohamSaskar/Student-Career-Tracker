package com.devtrack.ui.screens;

import com.devtrack.service.SkillGapData;
import com.devtrack.service.SkillGapItem;
import com.devtrack.service.SkillGapService;
import com.devtrack.ui.components.*;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableModel;

import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.util.List;

/**
 * DevTrack Skill Gap Analysis Screen (Phase 6).
 * Provides a database-driven breakdown of required skills vs student skill status.
 */
public class SkillGapScreen extends JPanel {

    public interface NavigationRequestListener {
        void onRequestNavigate(String screenName);
    }

    private final JPanel contentContainer;
    private final SkillGapService skillGapService;
    private final NavigationRequestListener navListener;

    private String activeFilter = "ALL";
    private String searchQuery = "";
    private SkillGapData currentData;

    public SkillGapScreen(NavigationRequestListener navListener) {
        this.navListener = navListener;
        this.skillGapService = new SkillGapService();

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

    public SkillGapScreen() {
        this(null);
    }

    /**
     * Refreshes skill gap analysis data dynamically using active student session.
     */
    public void refreshData() {
        contentContainer.removeAll();

        int studentId = SessionManager.getInstance().getCurrentStudentId();
        currentData = skillGapService.loadSkillGapData(studentId);

        if (currentData.getCareerRole() == null) {
            contentContainer.add(createNoGoalEmptyState());
        } else {
            // 1. Header
            contentContainer.add(createHeaderSection(currentData));
            contentContainer.add(Box.createVerticalStrut(20));

            // 2. Career Readiness Summary Card
            contentContainer.add(createReadinessCard(currentData));
            contentContainer.add(Box.createVerticalStrut(20));

            // 3. Summary Metric Cards
            contentContainer.add(createSummaryMetricsSection(currentData));
            contentContainer.add(Box.createVerticalStrut(20));

            // 4. Required Skills Section (Filter, Table)
            contentContainer.add(createRequiredSkillsSection());
            contentContainer.add(Box.createVerticalStrut(20));

            // 5. Focus Areas Section
            contentContainer.add(createFocusAreasSection(currentData.getFocusAreas()));
        }

        contentContainer.revalidate();
        contentContainer.repaint();
    }

    // --- SECTION 1: HEADER ---
    private JPanel createHeaderSection(SkillGapData data) {
        JPanel header = new JPanel(new BorderLayout(0, 4));
        header.setOpaque(false);

        JLabel titleLabel = new JLabel("Skill Gap Analysis");
        titleLabel.setFont(DevTrackFonts.PAGE_TITLE);
        titleLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel subtitleLabel = new JLabel("Understand what you need to learn for your career goal.");
        subtitleLabel.setFont(DevTrackFonts.SECONDARY);
        subtitleLabel.setForeground(DevTrackColors.TEXT_SECONDARY);

        String roleName = data.getCareerRole() != null ? data.getCareerRole().getRoleName() : "None";
        JLabel goalLabel = new JLabel("Career Goal: " + roleName);
        goalLabel.setFont(DevTrackFonts.FORM_LABEL);
        goalLabel.setForeground(DevTrackColors.ACCENT_PRIMARY);

        JPanel textPanel = new JPanel();
        textPanel.setLayout(new BoxLayout(textPanel, BoxLayout.Y_AXIS));
        textPanel.setOpaque(false);
        textPanel.add(titleLabel);
        textPanel.add(Box.createVerticalStrut(4));
        textPanel.add(subtitleLabel);

        JPanel rightBox = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 0));
        rightBox.setOpaque(false);
        rightBox.add(goalLabel);

        DTButton recBtn = new DTButton("View Recommended Skills", DTButton.ButtonType.PRIMARY);
        recBtn.setPreferredSize(new Dimension(190, 30));
        recBtn.addActionListener(e -> {
            if (navListener != null) navListener.onRequestNavigate("Recommended Skills");
        });
        rightBox.add(recBtn);

        header.add(textPanel, BorderLayout.WEST);
        header.add(rightBox, BorderLayout.EAST);

        return header;
    }

    // --- SECTION 2: READINESS SUMMARY CARD ---
    private JPanel createReadinessCard(SkillGapData data) {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));

        JLabel title = new JLabel("Career Readiness");
        title.setFont(DevTrackFonts.CARD_TITLE);
        title.setForeground(DevTrackColors.TEXT_SECONDARY);

        JPanel valBox = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        valBox.setOpaque(false);

        JLabel percentLabel = new JLabel(data.getReadinessPercentage() + "%");
        percentLabel.setFont(DevTrackFonts.METRIC);
        percentLabel.setForeground(DevTrackColors.ACCENT_PRIMARY);

        JLabel subLabel = new JLabel("  (" + data.getCompletedCount() + " of " + data.getTotalRequiredSkills() + " required skills completed)");
        subLabel.setFont(DevTrackFonts.CAPTION);
        subLabel.setForeground(DevTrackColors.TEXT_MUTED);

        valBox.add(percentLabel);
        valBox.add(subLabel);

        DTProgressBar pb = new DTProgressBar(data.getReadinessPercentage() / 100.0);
        pb.setProgress(data.getReadinessPercentage() / 100.0);

        card.add(title, BorderLayout.NORTH);
        card.add(valBox, BorderLayout.CENTER);
        card.add(pb, BorderLayout.SOUTH);

        return card;
    }

    // --- SECTION 3: SUMMARY METRICS ---
    private JPanel createSummaryMetricsSection(SkillGapData data) {
        JPanel grid = new JPanel(new GridLayout(1, 3, 16, 0));
        grid.setOpaque(false);

        grid.add(createStatCard("Completed", String.valueOf(data.getCompletedCount()), "Required Skills Mastered", DevTrackColors.SUCCESS_MAIN));
        grid.add(createStatCard("Learning", String.valueOf(data.getLearningCount()), "Skills Currently In-Progress", DevTrackColors.WARNING_MAIN));
        grid.add(createStatCard("Missing", String.valueOf(data.getMissingCount()), "Required Skills Not Started", DevTrackColors.ERROR_MAIN));

        return grid;
    }

    private DTCard createStatCard(String title, String val, String subtitle, Color accentColor) {
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

    // --- SECTION 4: REQUIRED SKILLS LIST & FILTER ---
    private JPanel createRequiredSkillsSection() {
        DTCard container = new DTCard();
        container.setLayout(new BorderLayout(0, 16));

        // Header Strip: Title + Filters + Search
        JPanel topStrip = new JPanel(new BorderLayout(16, 0));
        topStrip.setOpaque(false);

        JLabel title = new JLabel("Required Skills");
        title.setFont(DevTrackFonts.CARD_TITLE);
        title.setForeground(DevTrackColors.TEXT_PRIMARY);

        JPanel controls = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        controls.setOpaque(false);

        // Filter Buttons
        controls.add(createFilterButton("ALL"));
        controls.add(createFilterButton("COMPLETED"));
        controls.add(createFilterButton("LEARNING"));
        controls.add(createFilterButton("MISSING"));

        // Search Field
        DTSearchField searchField = new DTSearchField("Search required skills...");
        searchField.setPreferredSize(new Dimension(200, 32));
        searchField.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                searchQuery = searchField.getText().trim().toLowerCase();
                refreshSkillsList(container);
            }
        });
        controls.add(searchField);

        topStrip.add(title, BorderLayout.WEST);
        topStrip.add(controls, BorderLayout.EAST);

        container.add(topStrip, BorderLayout.NORTH);

        // Content Area
        JPanel listHolder = new JPanel(new BorderLayout());
        listHolder.setName("listHolder");
        listHolder.setOpaque(false);
        container.add(listHolder, BorderLayout.CENTER);

        refreshSkillsList(container);

        return container;
    }

    private DTButton createFilterButton(String filterKey) {
        boolean isActive = activeFilter.equalsIgnoreCase(filterKey);
        DTButton btn = new DTButton(filterKey, isActive ? DTButton.ButtonType.PRIMARY : DTButton.ButtonType.SECONDARY);
        btn.setPreferredSize(new Dimension(95, 30));
        btn.addActionListener(e -> {
            activeFilter = filterKey;
            refreshData();
        });
        return btn;
    }

    private void refreshSkillsList(DTCard container) {
        JPanel listHolder = null;
        for (Component c : container.getComponents()) {
            if ("listHolder".equals(c.getName()) && c instanceof JPanel) {
                listHolder = (JPanel) c;
                break;
            }
        }
        if (listHolder == null) return;

        listHolder.removeAll();

        List<SkillGapItem> filtered = getFilteredSkills();

        if (filtered.isEmpty()) {
            JLabel emptyLbl = new JLabel("No skills match the selected filter or search criteria.");
            emptyLbl.setFont(DevTrackFonts.BODY);
            emptyLbl.setForeground(DevTrackColors.TEXT_MUTED);
            emptyLbl.setBorder(new EmptyBorder(16, 0, 16, 0));
            listHolder.add(emptyLbl, BorderLayout.CENTER);
        } else {
            String[] columns = {"Skill Name", "Category", "Importance", "Status"};
            DefaultTableModel tableModel = new DefaultTableModel(columns, 0) {
                @Override
                public boolean isCellEditable(int row, int column) {
                    return false;
                }
            };

            for (SkillGapItem item : filtered) {
                tableModel.addRow(new Object[]{
                        item.getSkillName(),
                        item.getCategory(),
                        item.getImportance(),
                        item.getStatus()
                });
            }

            DTTable table = new DTTable(tableModel);
            table.setRowHeight(36);

            JScrollPane scrollPane = new JScrollPane(table);
            scrollPane.setBorder(BorderFactory.createLineBorder(DevTrackColors.BORDER_DEFAULT, 1));
            scrollPane.setOpaque(false);
            scrollPane.getViewport().setOpaque(false);
            scrollPane.setPreferredSize(new Dimension(1100, Math.min(300, Math.max(120, filtered.size() * 38 + 36))));

            listHolder.add(scrollPane, BorderLayout.CENTER);
        }

        listHolder.revalidate();
        listHolder.repaint();
    }

    private List<SkillGapItem> getFilteredSkills() {
        List<SkillGapItem> result = new ArrayList<>();
        if (currentData == null || currentData.getRequiredSkills() == null) return result;

        for (SkillGapItem item : currentData.getRequiredSkills()) {
            // Status filter
            if (!"ALL".equalsIgnoreCase(activeFilter) && !item.getStatus().equalsIgnoreCase(activeFilter)) {
                continue;
            }
            // Search filter
            if (!searchQuery.isEmpty()) {
                String name = item.getSkillName().toLowerCase();
                String cat = item.getCategory().toLowerCase();
                if (!name.contains(searchQuery) && !cat.contains(searchQuery)) {
                    continue;
                }
            }
            result.add(item);
        }
        return result;
    }

    // --- SECTION 5: FOCUS AREAS ---
    private JPanel createFocusAreasSection(List<SkillGapItem> focusItems) {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));

        JLabel title = new JLabel("Focus Areas");
        title.setFont(DevTrackFonts.CARD_TITLE);
        title.setForeground(DevTrackColors.TEXT_PRIMARY);

        card.add(title, BorderLayout.NORTH);

        if (focusItems == null || focusItems.isEmpty()) {
            JLabel positive = new JLabel("You're currently meeting all required skills for this career goal.");
            positive.setFont(DevTrackFonts.BODY);
            positive.setForeground(DevTrackColors.SUCCESS_TEXT);
            positive.setBorder(new EmptyBorder(12, 0, 12, 0));
            card.add(positive, BorderLayout.CENTER);
        } else {
            JPanel list = new JPanel();
            list.setLayout(new BoxLayout(list, BoxLayout.Y_AXIS));
            list.setOpaque(false);

            int idx = 1;
            for (SkillGapItem item : focusItems) {
                JPanel row = new JPanel(new BorderLayout(12, 0));
                row.setOpaque(false);
                row.setBorder(new EmptyBorder(6, 4, 6, 4));

                JLabel nameLbl = new JLabel(idx + ". " + item.getSkillName());
                nameLbl.setFont(DevTrackFonts.FORM_LABEL);
                nameLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

                DTBadge priorityBadge = new DTBadge(item.getStatus());
                priorityBadge.setText(item.getImportance().toUpperCase() + " PRIORITY (" + item.getStatus().toUpperCase() + ")");

                row.add(nameLbl, BorderLayout.WEST);
                row.add(priorityBadge, BorderLayout.EAST);

                list.add(row);
                idx++;
            }
            card.add(list, BorderLayout.CENTER);
        }

        return card;
    }

    private JPanel createNoGoalEmptyState() {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));
        card.setBorder(new EmptyBorder(40, 24, 40, 24));

        JLabel title = new JLabel("No career goal selected", SwingConstants.CENTER);
        title.setFont(DevTrackFonts.PAGE_TITLE);
        title.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel sub = new JLabel("Select a career goal during onboarding to analyze your skill gap.", SwingConstants.CENTER);
        sub.setFont(DevTrackFonts.BODY);
        sub.setForeground(DevTrackColors.TEXT_MUTED);

        card.add(title, BorderLayout.NORTH);
        card.add(sub, BorderLayout.CENTER);

        return card;
    }
}
