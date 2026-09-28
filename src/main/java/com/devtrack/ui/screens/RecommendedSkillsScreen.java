package com.devtrack.ui.screens;

import com.devtrack.service.RecommendedSkill;
import com.devtrack.service.RecommendedSkillsData;
import com.devtrack.service.RecommendedSkillsService;
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
 * DevTrack Recommended Skills Screen (Phase 7).
 * Displays database-driven, fact-based skill recommendations prioritized by importance (High -> Medium -> Low).
 */
public class RecommendedSkillsScreen extends JPanel {

    public interface NavigationRequestListener {
        void onRequestNavigate(String screenName);
    }

    private final JPanel contentContainer;
    private final RecommendedSkillsService service;
    private final NavigationRequestListener navListener;

    private String activeFilter = "ALL";
    private String searchQuery = "";
    private RecommendedSkillsData currentData;

    public RecommendedSkillsScreen(NavigationRequestListener navListener) {
        this.navListener = navListener;
        this.service = new RecommendedSkillsService();

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

    public RecommendedSkillsScreen() {
        this(null);
    }

    /**
     * Refreshes recommendation data dynamically using current student session.
     */
    public void refreshData() {
        contentContainer.removeAll();

        int studentId = SessionManager.getInstance().getCurrentStudentId();
        currentData = service.loadRecommendedSkillsData(studentId);

        if (currentData.getCareerRole() == null) {
            contentContainer.add(createNoGoalEmptyState());
        } else {
            // 1. Header
            contentContainer.add(createHeaderSection(currentData));
            contentContainer.add(Box.createVerticalStrut(20));

            // 2. Your Next Focus Card
            if (currentData.getNextFocus() != null) {
                contentContainer.add(createNextFocusCard(currentData.getNextFocus()));
                contentContainer.add(Box.createVerticalStrut(20));
            } else if (currentData.getRecommendedSkills().isEmpty()) {
                contentContainer.add(createOnTrackCard());
                contentContainer.add(Box.createVerticalStrut(20));
            }

            // 3. Recommended Skills List/Table
            contentContainer.add(createRecommendedSkillsSection());
            contentContainer.add(Box.createVerticalStrut(20));

            // 4. Continue Learning Section
            contentContainer.add(createContinueLearningSection(currentData.getLearningSkills()));
        }

        contentContainer.revalidate();
        contentContainer.repaint();
    }

    // --- SECTION 1: HEADER ---
    private JPanel createHeaderSection(RecommendedSkillsData data) {
        JPanel header = new JPanel(new BorderLayout(0, 4));
        header.setOpaque(false);

        JLabel titleLabel = new JLabel("Recommended Skills");
        titleLabel.setFont(DevTrackFonts.PAGE_TITLE);
        titleLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel subtitleLabel = new JLabel("Focus on the skills that will move you closer to your goal.");
        subtitleLabel.setFont(DevTrackFonts.SECONDARY);
        subtitleLabel.setForeground(DevTrackColors.TEXT_SECONDARY);

        String roleName = data.getCareerRole() != null ? data.getCareerRole().getRoleName() : "None";
        JLabel goalLabel = new JLabel("Target Career: " + roleName);
        goalLabel.setFont(DevTrackFonts.FORM_LABEL);
        goalLabel.setForeground(DevTrackColors.ACCENT_PRIMARY);

        JPanel textPanel = new JPanel();
        textPanel.setLayout(new BoxLayout(textPanel, BoxLayout.Y_AXIS));
        textPanel.setOpaque(false);
        textPanel.add(titleLabel);
        textPanel.add(Box.createVerticalStrut(4));
        textPanel.add(subtitleLabel);

        header.add(textPanel, BorderLayout.WEST);
        header.add(goalLabel, BorderLayout.EAST);

        return header;
    }

    // --- SECTION 2: YOUR NEXT FOCUS ---
    private JPanel createNextFocusCard(RecommendedSkill focus) {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));

        JPanel top = new JPanel(new BorderLayout());
        top.setOpaque(false);

        JLabel title = new JLabel("Your Next Focus");
        title.setFont(DevTrackFonts.CARD_TITLE);
        title.setForeground(DevTrackColors.TEXT_SECONDARY);

        DTBadge priorityBadge = new DTBadge("Missing");
        priorityBadge.setText(focus.getPriority());

        top.add(title, BorderLayout.WEST);
        top.add(priorityBadge, BorderLayout.EAST);

        JLabel nameLabel = new JLabel(focus.getSkillName());
        nameLabel.setFont(DevTrackFonts.PAGE_TITLE);
        nameLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel descLabel = new JLabel(focus.getCategory() + " • " + focus.getReason());
        descLabel.setFont(DevTrackFonts.BODY);
        descLabel.setForeground(DevTrackColors.TEXT_MUTED);

        // Action button to view roadmap
        JPanel bottomBar = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 0));
        bottomBar.setOpaque(false);

        DTButton viewRoadmapBtn = new DTButton("View Learning Roadmap", DTButton.ButtonType.PRIMARY);
        viewRoadmapBtn.setPreferredSize(new Dimension(190, 32));
        viewRoadmapBtn.addActionListener(e -> {
            if (navListener != null) {
                navListener.onRequestNavigate("Learning Roadmap");
            }
        });
        bottomBar.add(viewRoadmapBtn);

        card.add(top, BorderLayout.NORTH);

        JPanel centerPanel = new JPanel();
        centerPanel.setLayout(new BoxLayout(centerPanel, BoxLayout.Y_AXIS));
        centerPanel.setOpaque(false);
        centerPanel.add(nameLabel);
        centerPanel.add(Box.createVerticalStrut(4));
        centerPanel.add(descLabel);

        card.add(centerPanel, BorderLayout.CENTER);
        card.add(bottomBar, BorderLayout.SOUTH);

        return card;
    }

    // --- SECTION 3: RECOMMENDED SKILLS LIST & FILTERS ---
    private JPanel createRecommendedSkillsSection() {
        DTCard container = new DTCard();
        container.setLayout(new BorderLayout(0, 16));

        JPanel topStrip = new JPanel(new BorderLayout(16, 0));
        topStrip.setOpaque(false);

        JLabel title = new JLabel("Recommended Skills");
        title.setFont(DevTrackFonts.CARD_TITLE);
        title.setForeground(DevTrackColors.TEXT_PRIMARY);

        JPanel controls = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        controls.setOpaque(false);

        controls.add(createFilterButton("ALL"));
        controls.add(createFilterButton("HIGH PRIORITY"));
        controls.add(createFilterButton("MEDIUM PRIORITY"));
        controls.add(createFilterButton("LOW PRIORITY"));

        DTSearchField searchField = new DTSearchField("Search recommendations...");
        searchField.setPreferredSize(new Dimension(200, 32));
        searchField.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                searchQuery = searchField.getText().trim().toLowerCase();
                refreshRecommendationsTable(container);
            }
        });
        controls.add(searchField);

        topStrip.add(title, BorderLayout.WEST);
        topStrip.add(controls, BorderLayout.EAST);

        container.add(topStrip, BorderLayout.NORTH);

        JPanel listHolder = new JPanel(new BorderLayout());
        listHolder.setName("listHolder");
        listHolder.setOpaque(false);
        container.add(listHolder, BorderLayout.CENTER);

        refreshRecommendationsTable(container);

        return container;
    }

    private DTButton createFilterButton(String filterKey) {
        boolean isActive = activeFilter.equalsIgnoreCase(filterKey);
        DTButton btn = new DTButton(filterKey, isActive ? DTButton.ButtonType.PRIMARY : DTButton.ButtonType.SECONDARY);
        btn.setPreferredSize(new Dimension(130, 30));
        btn.addActionListener(e -> {
            activeFilter = filterKey;
            refreshData();
        });
        return btn;
    }

    private void refreshRecommendationsTable(DTCard container) {
        JPanel listHolder = null;
        for (Component c : container.getComponents()) {
            if ("listHolder".equals(c.getName()) && c instanceof JPanel) {
                listHolder = (JPanel) c;
                break;
            }
        }
        if (listHolder == null) return;

        listHolder.removeAll();

        List<RecommendedSkill> filtered = getFilteredRecommendations();

        if (filtered.isEmpty()) {
            JLabel emptyLbl = new JLabel("No recommendations match the selected filter or search criteria.");
            emptyLbl.setFont(DevTrackFonts.BODY);
            emptyLbl.setForeground(DevTrackColors.TEXT_MUTED);
            emptyLbl.setBorder(new EmptyBorder(16, 0, 16, 0));
            listHolder.add(emptyLbl, BorderLayout.CENTER);
        } else {
            String[] columns = {"Skill Name", "Category", "Priority", "Status", "Reason"};
            DefaultTableModel tableModel = new DefaultTableModel(columns, 0) {
                @Override
                public boolean isCellEditable(int row, int column) {
                    return false;
                }
            };

            for (RecommendedSkill item : filtered) {
                tableModel.addRow(new Object[]{
                        item.getSkillName(),
                        item.getCategory(),
                        item.getPriority(),
                        item.getStatus(),
                        item.getReason()
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

    private List<RecommendedSkill> getFilteredRecommendations() {
        List<RecommendedSkill> result = new ArrayList<>();
        if (currentData == null || currentData.getRecommendedSkills() == null) return result;

        for (RecommendedSkill item : currentData.getRecommendedSkills()) {
            if (!"ALL".equalsIgnoreCase(activeFilter) && !item.getPriority().equalsIgnoreCase(activeFilter)) {
                continue;
            }
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

    // --- SECTION 4: CONTINUE LEARNING ---
    private JPanel createContinueLearningSection(List<RecommendedSkill> learningItems) {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));

        JLabel title = new JLabel("Continue Learning");
        title.setFont(DevTrackFonts.CARD_TITLE);
        title.setForeground(DevTrackColors.TEXT_PRIMARY);

        card.add(title, BorderLayout.NORTH);

        if (learningItems == null || learningItems.isEmpty()) {
            JLabel empty = new JLabel("No skills currently marked as learning.");
            empty.setFont(DevTrackFonts.BODY);
            empty.setForeground(DevTrackColors.TEXT_MUTED);
            empty.setBorder(new EmptyBorder(12, 0, 12, 0));
            card.add(empty, BorderLayout.CENTER);
        } else {
            JPanel list = new JPanel();
            list.setLayout(new BoxLayout(list, BoxLayout.Y_AXIS));
            list.setOpaque(false);

            for (RecommendedSkill item : learningItems) {
                JPanel row = new JPanel(new BorderLayout(12, 0));
                row.setOpaque(false);
                row.setBorder(new EmptyBorder(6, 4, 6, 4));

                JLabel nameLbl = new JLabel(item.getSkillName() + " (" + item.getCategory() + ")");
                nameLbl.setFont(DevTrackFonts.FORM_LABEL);
                nameLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

                DTBadge badge = new DTBadge("Learning");
                badge.setText("LEARNING");

                row.add(nameLbl, BorderLayout.WEST);
                row.add(badge, BorderLayout.EAST);

                list.add(row);
            }
            card.add(list, BorderLayout.CENTER);
        }

        return card;
    }

    private JPanel createOnTrackCard() {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 8));
        card.setBorder(new EmptyBorder(24, 24, 24, 24));

        JLabel title = new JLabel("You're on track!", SwingConstants.CENTER);
        title.setFont(DevTrackFonts.PAGE_TITLE);
        title.setForeground(DevTrackColors.SUCCESS_TEXT);

        JLabel sub = new JLabel("You currently meet all required skills for your selected career goal.", SwingConstants.CENTER);
        sub.setFont(DevTrackFonts.BODY);
        sub.setForeground(DevTrackColors.TEXT_PRIMARY);

        card.add(title, BorderLayout.NORTH);
        card.add(sub, BorderLayout.CENTER);

        return card;
    }

    private JPanel createNoGoalEmptyState() {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));
        card.setBorder(new EmptyBorder(40, 24, 40, 24));

        JLabel title = new JLabel("No career goal selected", SwingConstants.CENTER);
        title.setFont(DevTrackFonts.PAGE_TITLE);
        title.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel sub = new JLabel("Select a career goal to receive skill recommendations.", SwingConstants.CENTER);
        sub.setFont(DevTrackFonts.BODY);
        sub.setForeground(DevTrackColors.TEXT_MUTED);

        card.add(title, BorderLayout.NORTH);
        card.add(sub, BorderLayout.CENTER);

        return card;
    }
}
