package com.devtrack.ui.screens;

import com.devtrack.service.LearningRoadmapService;
import com.devtrack.service.RoadmapData;
import com.devtrack.service.RoadmapItem;
import com.devtrack.ui.components.*;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.List;

/**
 * DevTrack Learning Roadmap Screen (Phase 8).
 * Provides a structured, interactive learning path (Completed, Learning Now, Next Up, Later)
 * allowing students to transition skill statuses directly to MySQL with non-blocking DTToast feedback.
 */
public class LearningRoadmapScreen extends JPanel {

    public interface StatusChangeListener {
        void onStatusChanged();
    }

    private final JPanel contentContainer;
    private final LearningRoadmapService roadmapService;
    private final StatusChangeListener statusChangeListener;

    public LearningRoadmapScreen(StatusChangeListener statusChangeListener) {
        this.statusChangeListener = statusChangeListener;
        this.roadmapService = new LearningRoadmapService();

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

    public LearningRoadmapScreen() {
        this(null);
    }

    /**
     * Refreshes learning roadmap data dynamically using current student session.
     */
    public void refreshData() {
        contentContainer.removeAll();

        int studentId = SessionManager.getInstance().getCurrentStudentId();
        RoadmapData data = roadmapService.loadRoadmapData(studentId);

        if (data.getCareerRole() == null) {
            contentContainer.add(createNoGoalEmptyState());
        } else if (data.getTotalRequiredSkills() == 0) {
            contentContainer.add(createNoRequiredSkillsEmptyState());
        } else {
            // 1. Header
            contentContainer.add(createHeaderSection(data));
            contentContainer.add(Box.createVerticalStrut(20));

            // 2. Roadmap Progress Card
            contentContainer.add(createProgressCard(data));
            contentContainer.add(Box.createVerticalStrut(20));

            // Check if 100% complete
            if (data.getProgressPercentage() == 100) {
                contentContainer.add(createRoadmapCompleteCard());
                contentContainer.add(Box.createVerticalStrut(20));
            }

            // 3. Learning Now Section
            contentContainer.add(createRoadmapSectionCard("Learning Now", data.getLearningItems(), true));
            contentContainer.add(Box.createVerticalStrut(20));

            // 4. Next Up Section
            contentContainer.add(createRoadmapSectionCard("Next Up", data.getNextUpItems(), false));
            contentContainer.add(Box.createVerticalStrut(20));

            // 5. Later Section
            contentContainer.add(createRoadmapSectionCard("Later", data.getLaterItems(), false));
            contentContainer.add(Box.createVerticalStrut(20));

            // 6. Completed Milestones Section
            contentContainer.add(createRoadmapSectionCard("Completed Milestones", data.getCompletedItems(), false));
        }

        contentContainer.revalidate();
        contentContainer.repaint();
    }

    private JPanel createHeaderSection(RoadmapData data) {
        JPanel header = new JPanel(new BorderLayout(0, 4));
        header.setOpaque(false);

        JLabel titleLbl = new JLabel("Learning Roadmap");
        titleLbl.setFont(DevTrackFonts.PAGE_TITLE);
        titleLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

        String roleName = data.getCareerRole() != null ? data.getCareerRole().getRoleName() : "Target Role";
        JLabel subLbl = new JLabel("Sequential learning path to achieve 100% skill readiness for " + roleName + ".");
        subLbl.setFont(DevTrackFonts.SECONDARY);
        subLbl.setForeground(DevTrackColors.TEXT_SECONDARY);

        header.add(titleLbl, BorderLayout.NORTH);
        header.add(subLbl, BorderLayout.CENTER);

        return header;
    }

    private JPanel createProgressCard(RoadmapData data) {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));

        JPanel top = new JPanel(new BorderLayout());
        top.setOpaque(false);

        JLabel titleLbl = new JLabel("Overall Readiness");
        titleLbl.setFont(DevTrackFonts.CARD_TITLE);
        titleLbl.setForeground(DevTrackColors.TEXT_SECONDARY);

        JLabel pctLbl = new JLabel(data.getProgressPercentage() + "%");
        pctLbl.setFont(DevTrackFonts.CARD_TITLE);
        pctLbl.setForeground(DevTrackColors.ACCENT_PRIMARY);

        top.add(titleLbl, BorderLayout.WEST);
        top.add(pctLbl, BorderLayout.EAST);

        DTProgressBar bar = new DTProgressBar(data.getProgressPercentage() / 100.0);
        bar.setProgress(data.getProgressPercentage() / 100.0);

        JLabel detailLbl = new JLabel(data.getCompletedCount() + " of " + data.getTotalRequiredSkills() + " required skills completed");
        detailLbl.setFont(DevTrackFonts.CAPTION);
        detailLbl.setForeground(DevTrackColors.TEXT_MUTED);

        card.add(top, BorderLayout.NORTH);
        card.add(bar, BorderLayout.CENTER);
        card.add(detailLbl, BorderLayout.SOUTH);

        return card;
    }

    private JPanel createRoadmapSectionCard(String title, List<RoadmapItem> items, boolean isHighlight) {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);

        JLabel sectionLbl = new JLabel(title);
        sectionLbl.setFont(DevTrackFonts.CARD_TITLE);
        sectionLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel countLbl = new JLabel(items != null ? items.size() + " skills" : "0 skills");
        countLbl.setFont(DevTrackFonts.CAPTION);
        countLbl.setForeground(DevTrackColors.TEXT_MUTED);

        header.add(sectionLbl, BorderLayout.WEST);
        header.add(countLbl, BorderLayout.EAST);

        card.add(header, BorderLayout.NORTH);

        if (items == null || items.isEmpty()) {
            JLabel emptyLbl = new JLabel("No skills in this section.");
            emptyLbl.setFont(DevTrackFonts.BODY);
            emptyLbl.setForeground(DevTrackColors.TEXT_MUTED);
            emptyLbl.setBorder(new EmptyBorder(8, 0, 8, 0));
            card.add(emptyLbl, BorderLayout.CENTER);
        } else {
            JPanel list = new JPanel();
            list.setLayout(new BoxLayout(list, BoxLayout.Y_AXIS));
            list.setOpaque(false);

            for (int i = 0; i < items.size(); i++) {
                list.add(createRoadmapItemRow(items.get(i)));
                if (i < items.size() - 1) {
                    list.add(Box.createVerticalStrut(6));
                }
            }
            card.add(list, BorderLayout.CENTER);
        }

        return card;
    }

    private JPanel createRoadmapItemRow(RoadmapItem item) {
        JPanel row = new JPanel(new BorderLayout(12, 0));
        row.setOpaque(false);
        row.setBorder(new EmptyBorder(8, 8, 8, 8));

        JPanel leftBox = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 0));
        leftBox.setOpaque(false);

        if (item.getStepNumber() > 0) {
            JLabel stepLbl = new JLabel(String.format("%02d", item.getStepNumber()));
            stepLbl.setFont(DevTrackFonts.CARD_TITLE);
            stepLbl.setForeground(DevTrackColors.ACCENT_PRIMARY);
            leftBox.add(stepLbl);
        } else if ("Completed".equalsIgnoreCase(item.getStatus())) {
            JLabel checkLbl = new JLabel("✓");
            checkLbl.setFont(DevTrackFonts.CARD_TITLE);
            checkLbl.setForeground(DevTrackColors.SUCCESS_TEXT);
            leftBox.add(checkLbl);
        }

        JLabel nameLbl = new JLabel(item.getSkillName());
        nameLbl.setFont(DevTrackFonts.FORM_LABEL);
        nameLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel catLbl = new JLabel(item.getCategory());
        catLbl.setFont(DevTrackFonts.CAPTION);
        catLbl.setForeground(DevTrackColors.TEXT_MUTED);

        leftBox.add(nameLbl);
        leftBox.add(catLbl);

        JPanel rightBox = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 0));
        rightBox.setOpaque(false);

        DTBadge impBadge = new DTBadge(item.getStatus());
        impBadge.setText(item.getImportance().toUpperCase() + " PRIORITY");
        rightBox.add(impBadge);

        // Action Button Handler with Non-Blocking DTToast Feedback
        int studentId = SessionManager.getInstance().getCurrentStudentId();

        if ("Not Started".equalsIgnoreCase(item.getStatus())) {
            DTButton startBtn = new DTButton("Start Learning", DTButton.ButtonType.PRIMARY);
            startBtn.setPreferredSize(new Dimension(130, 28));
            startBtn.addActionListener(e -> {
                boolean updated = roadmapService.updateStudentSkillStatus(studentId, item.getSkillId(), "Learning");
                if (updated) {
                    DTToast.showSuccess(this, "Started learning " + item.getSkillName());
                    refreshData();
                    if (statusChangeListener != null) statusChangeListener.onStatusChanged();
                } else {
                    DTToast.showError(this, "Unable to update skill status.");
                }
            });
            rightBox.add(startBtn);
        } else if ("Learning".equalsIgnoreCase(item.getStatus())) {
            DTButton completeBtn = new DTButton("Mark Completed", DTButton.ButtonType.PRIMARY);
            completeBtn.setPreferredSize(new Dimension(140, 28));
            completeBtn.addActionListener(e -> {
                boolean updated = roadmapService.updateStudentSkillStatus(studentId, item.getSkillId(), "Completed");
                if (updated) {
                    DTToast.showSuccess(this, "Mastered " + item.getSkillName() + "!");
                    refreshData();
                    if (statusChangeListener != null) statusChangeListener.onStatusChanged();
                } else {
                    DTToast.showError(this, "Unable to update skill status.");
                }
            });

            DTButton undoBtn = new DTButton("Undo", DTButton.ButtonType.SECONDARY);
            undoBtn.setPreferredSize(new Dimension(75, 28));
            undoBtn.setToolTipText("Reset skill status to Not Started");
            undoBtn.addActionListener(e -> {
                boolean updated = roadmapService.updateStudentSkillStatus(studentId, item.getSkillId(), "Not Started");
                if (updated) {
                    DTToast.showInfo(this, "Reset " + item.getSkillName() + " to Not Started");
                    refreshData();
                    if (statusChangeListener != null) statusChangeListener.onStatusChanged();
                } else {
                    DTToast.showError(this, "Unable to reset skill status.");
                }
            });

            rightBox.add(completeBtn);
            rightBox.add(undoBtn);
        } else {
            DTBadge doneBadge = new DTBadge("Completed");
            doneBadge.setText("COMPLETED ✓");
            rightBox.add(doneBadge);

            DTButton undoBtn = new DTButton("Undo", DTButton.ButtonType.SECONDARY);
            undoBtn.setPreferredSize(new Dimension(75, 28));
            undoBtn.setToolTipText("Revert skill status back to Learning");
            undoBtn.addActionListener(e -> {
                boolean updated = roadmapService.updateStudentSkillStatus(studentId, item.getSkillId(), "Learning");
                if (updated) {
                    DTToast.showInfo(this, "Reverted " + item.getSkillName() + " to Learning");
                    refreshData();
                    if (statusChangeListener != null) statusChangeListener.onStatusChanged();
                } else {
                    DTToast.showError(this, "Unable to revert skill status.");
                }
            });
            rightBox.add(undoBtn);
        }

        row.add(leftBox, BorderLayout.WEST);
        row.add(rightBox, BorderLayout.EAST);

        return row;
    }

    private JPanel createRoadmapCompleteCard() {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 8));
        card.setBorder(new EmptyBorder(20, 20, 20, 20));

        JLabel titleLbl = new JLabel("🎉 100% Skill Readiness Achieved!");
        titleLbl.setFont(DevTrackFonts.PAGE_TITLE);
        titleLbl.setForeground(DevTrackColors.SUCCESS_TEXT);

        JLabel subLbl = new JLabel("Congratulations! You have mastered all required technical skills for your target career role.");
        subLbl.setFont(DevTrackFonts.BODY);
        subLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

        card.add(titleLbl, BorderLayout.NORTH);
        card.add(subLbl, BorderLayout.CENTER);

        return card;
    }

    private JPanel createNoGoalEmptyState() {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));

        JLabel titleLbl = new JLabel("No Target Career Selected");
        titleLbl.setFont(DevTrackFonts.PAGE_TITLE);
        titleLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel subLbl = new JLabel("Select a target career role to generate your personalized learning roadmap.");
        subLbl.setFont(DevTrackFonts.BODY);
        subLbl.setForeground(DevTrackColors.TEXT_SECONDARY);

        card.add(titleLbl, BorderLayout.NORTH);
        card.add(subLbl, BorderLayout.CENTER);

        return card;
    }

    private JPanel createNoRequiredSkillsEmptyState() {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout(0, 12));

        JLabel titleLbl = new JLabel("No Required Skills Configured");
        titleLbl.setFont(DevTrackFonts.PAGE_TITLE);
        titleLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel subLbl = new JLabel("There are currently no skills assigned to your selected target role.");
        subLbl.setFont(DevTrackFonts.BODY);
        subLbl.setForeground(DevTrackColors.TEXT_SECONDARY);

        card.add(titleLbl, BorderLayout.NORTH);
        card.add(subLbl, BorderLayout.CENTER);

        return card;
    }
}
