package com.devtrack.ui.screens;

import com.devtrack.dao.SkillDAO;
import com.devtrack.dao.StudentCareerGoalDAO;
import com.devtrack.dao.StudentSkillDAO;
import com.devtrack.model.Skill;
import com.devtrack.ui.components.DTBadge;
import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.components.DTCard;
import com.devtrack.ui.components.DTToast;
import com.devtrack.ui.dialogs.DTAlert;
import com.devtrack.ui.dialogs.DTConfirmDialog;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.List;

/**
 * DevTrack Skills Screen (Phase 3 & 4).
 * Allows student to view acquired skills and missing skill gaps, toggle statuses, and add/undo skills.
 * Uses modern non-blocking DTToast notifications for seamless UX interaction.
 */
public class SkillsScreen extends JPanel {

    public interface OnSkillDataChangeListener {
        void onDataChanged();
    }

    private final StudentSkillDAO studentSkillDAO;
    private final SkillDAO skillDAO;
    private final StudentCareerGoalDAO careerGoalDAO;
    private final OnSkillDataChangeListener changeListener;

    private final JPanel acquiredContainer;
    private final JPanel gapsContainer;
    private int currentStudentId;

    public SkillsScreen(OnSkillDataChangeListener changeListener) {
        this.changeListener = changeListener;
        this.studentSkillDAO = new StudentSkillDAO();
        this.skillDAO = new SkillDAO();
        this.careerGoalDAO = new StudentCareerGoalDAO();

        setLayout(new BorderLayout());
        setBackground(DevTrackColors.BG_APP);

        JPanel content = new JPanel();
        content.setLayout(new BoxLayout(content, BoxLayout.Y_AXIS));
        content.setOpaque(false);
        content.setBorder(new EmptyBorder(24, 32, 24, 32));

        // Header Section
        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);

        JLabel titleLabel = new JLabel("My Skill Inventory");
        titleLabel.setFont(DevTrackFonts.PAGE_TITLE);
        titleLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel subLabel = new JLabel("Manage acquired technical skills and track required skill gaps for your career goal.");
        subLabel.setFont(DevTrackFonts.BODY);
        subLabel.setForeground(DevTrackColors.TEXT_SECONDARY);

        JPanel textPanel = new JPanel();
        textPanel.setLayout(new BoxLayout(textPanel, BoxLayout.Y_AXIS));
        textPanel.setOpaque(false);
        textPanel.add(titleLabel);
        textPanel.add(Box.createVerticalStrut(4));
        textPanel.add(subLabel);

        DTButton addSkillBtn = new DTButton("+ Add Skill", DTButton.ButtonType.PRIMARY);
        addSkillBtn.addActionListener(e -> showAddSkillDialog());

        header.add(textPanel, BorderLayout.WEST);
        header.add(addSkillBtn, BorderLayout.EAST);

        content.add(header);
        content.add(Box.createVerticalStrut(20));

        // Acquired Skills Card
        acquiredContainer = new JPanel();
        content.add(createAcquiredSkillsCard());
        content.add(Box.createVerticalStrut(20));

        // Missing Skill Gaps Card
        gapsContainer = new JPanel();
        content.add(createGapsCard());

        JScrollPane scrollPane = new JScrollPane(content);
        scrollPane.setBorder(null);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.getVerticalScrollBar().setUnitIncrement(20);

        add(scrollPane, BorderLayout.CENTER);

        refreshData();
    }

    public SkillsScreen() {
        this(null);
    }

    public void refreshData() {
        currentStudentId = SessionManager.getInstance().getCurrentStudentId();

        acquiredContainer.removeAll();
        gapsContainer.removeAll();

        List<Skill> acquired = skillDAO.getStudentSkills(currentStudentId);
        int targetRoleId = careerGoalDAO.getSelectedRoleId(currentStudentId);
        List<Skill> gaps = skillDAO.getSkillGaps(currentStudentId, targetRoleId);

        if (acquired.isEmpty()) {
            JLabel emptyLbl = new JLabel("No acquired skills added yet. Click '+ Add Skill' above to add your first skill.");
            emptyLbl.setFont(DevTrackFonts.BODY);
            emptyLbl.setForeground(DevTrackColors.TEXT_MUTED);
            emptyLbl.setBorder(new EmptyBorder(12, 0, 12, 0));
            acquiredContainer.add(emptyLbl);
        } else {
            for (int i = 0; i < acquired.size(); i++) {
                acquiredContainer.add(createAcquiredRow(acquired.get(i), i < acquired.size() - 1));
            }
        }

        if (gaps.isEmpty()) {
            JLabel emptyLbl = new JLabel("No missing skill gaps detected! You meet all skill requirements for your career goal.");
            emptyLbl.setFont(DevTrackFonts.BODY);
            emptyLbl.setForeground(DevTrackColors.SUCCESS_TEXT);
            emptyLbl.setBorder(new EmptyBorder(12, 0, 12, 0));
            gapsContainer.add(emptyLbl);
        } else {
            for (int i = 0; i < gaps.size(); i++) {
                gapsContainer.add(createGapRow(gaps.get(i), i < gaps.size() - 1));
            }
        }

        revalidate();
        repaint();
    }

    private JPanel createAcquiredSkillsCard() {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout());

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);

        JLabel cardTitle = new JLabel("Acquired & Learning Skills");
        cardTitle.setFont(DevTrackFonts.CARD_TITLE);
        cardTitle.setForeground(DevTrackColors.TEXT_PRIMARY);
        header.add(cardTitle, BorderLayout.WEST);

        card.add(header, BorderLayout.NORTH);

        acquiredContainer.setLayout(new BoxLayout(acquiredContainer, BoxLayout.Y_AXIS));
        acquiredContainer.setOpaque(false);
        acquiredContainer.setBorder(new EmptyBorder(14, 0, 0, 0));

        card.add(acquiredContainer, BorderLayout.CENTER);
        return card;
    }

    private JPanel createGapsCard() {
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout());

        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);

        JLabel cardTitle = new JLabel("Required Skill Gaps (Target Career)");
        cardTitle.setFont(DevTrackFonts.CARD_TITLE);
        cardTitle.setForeground(DevTrackColors.TEXT_PRIMARY);
        header.add(cardTitle, BorderLayout.WEST);

        card.add(header, BorderLayout.NORTH);

        gapsContainer.setLayout(new BoxLayout(gapsContainer, BoxLayout.Y_AXIS));
        gapsContainer.setOpaque(false);
        gapsContainer.setBorder(new EmptyBorder(14, 0, 0, 0));

        card.add(gapsContainer, BorderLayout.CENTER);
        return card;
    }

    private JPanel createAcquiredRow(Skill item, boolean drawBorder) {
        JPanel row = new JPanel(new BorderLayout(12, 0));
        row.setOpaque(false);
        row.setBorder(BorderFactory.createCompoundBorder(
                drawBorder ? BorderFactory.createMatteBorder(0, 0, 1, 0, DevTrackColors.BORDER_DEFAULT) : BorderFactory.createEmptyBorder(),
                new EmptyBorder(10, 6, 10, 6)
        ));

        JPanel left = new JPanel();
        left.setLayout(new BoxLayout(left, BoxLayout.Y_AXIS));
        left.setOpaque(false);

        JLabel nameLabel = new JLabel(item.getSkillName());
        nameLabel.setFont(DevTrackFonts.FORM_LABEL);
        nameLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        String detailText = item.getDetail() != null ? item.getDetail() : "";
        JLabel catLabel = new JLabel(item.getCategory() + (detailText.isEmpty() ? "" : "  •  " + detailText));
        catLabel.setFont(DevTrackFonts.BODY);
        catLabel.setForeground(DevTrackColors.TEXT_SECONDARY);

        left.add(nameLabel);
        left.add(Box.createVerticalStrut(2));
        left.add(catLabel);

        row.add(left, BorderLayout.CENTER);

        JPanel right = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0));
        right.setOpaque(false);

        DTBadge badge = new DTBadge(item.getStatus());
        badge.setCursor(new Cursor(Cursor.HAND_CURSOR));
        badge.setToolTipText("Click to toggle status (Completed / Learning)");
        badge.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mouseClicked(java.awt.event.MouseEvent e) {
                String nextStatus = "Completed".equalsIgnoreCase(item.getStatus()) ? "Learning" : "Completed";
                studentSkillDAO.updateSkillStatus(currentStudentId, item.getSkillId(), nextStatus);
                DTToast.showSuccess(SkillsScreen.this, "Status for '" + item.getSkillName() + "' set to " + nextStatus);
                if (changeListener != null) changeListener.onDataChanged();
                refreshData();
            }
        });

        DTButton undoBtn = new DTButton("Undo / Revert", DTButton.ButtonType.SECONDARY);
        undoBtn.setPreferredSize(new Dimension(125, 36));
        undoBtn.setToolTipText("Revert skill status back to Learning or Not Started");
        undoBtn.addActionListener(e -> {
            String nextStatus = "Completed".equalsIgnoreCase(item.getStatus()) ? "Learning" : "Not Started";
            if ("Not Started".equals(nextStatus)) {
                studentSkillDAO.removeSkill(currentStudentId, item.getSkillId());
            } else {
                studentSkillDAO.updateSkillStatus(currentStudentId, item.getSkillId(), nextStatus);
            }
            DTToast.showInfo(this, "Reverted '" + item.getSkillName() + "' to " + nextStatus);
            if (changeListener != null) changeListener.onDataChanged();
            refreshData();
        });

        DTButton removeBtn = new DTButton("Remove", DTButton.ButtonType.DESTRUCTIVE);
        removeBtn.setPreferredSize(new Dimension(90, 36));
        removeBtn.addActionListener(e -> {
            boolean confirm = DTConfirmDialog.show(this, "Confirm Skill Removal", "Remove skill '" + item.getSkillName() + "' from your inventory?");
            if (confirm) {
                studentSkillDAO.removeSkill(currentStudentId, item.getSkillId());
                DTToast.showInfo(this, "Removed " + item.getSkillName() + " from inventory");
                if (changeListener != null) changeListener.onDataChanged();
                refreshData();
            }
        });

        right.add(badge);
        right.add(undoBtn);
        right.add(removeBtn);

        row.add(right, BorderLayout.EAST);
        return row;
    }

    private JPanel createGapRow(Skill item, boolean drawBorder) {
        JPanel row = new JPanel(new BorderLayout(12, 0));
        row.setOpaque(false);
        row.setBorder(BorderFactory.createCompoundBorder(
                drawBorder ? BorderFactory.createMatteBorder(0, 0, 1, 0, DevTrackColors.BORDER_DEFAULT) : BorderFactory.createEmptyBorder(),
                new EmptyBorder(10, 6, 10, 6)
        ));

        JPanel left = new JPanel();
        left.setLayout(new BoxLayout(left, BoxLayout.Y_AXIS));
        left.setOpaque(false);

        JLabel nameLabel = new JLabel(item.getSkillName());
        nameLabel.setFont(DevTrackFonts.FORM_LABEL);
        nameLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel catLabel = new JLabel(item.getCategory() + "  •  Importance: " + item.getImportance());
        catLabel.setFont(DevTrackFonts.BODY);
        catLabel.setForeground(DevTrackColors.TEXT_SECONDARY);

        left.add(nameLabel);
        left.add(Box.createVerticalStrut(2));
        left.add(catLabel);

        row.add(left, BorderLayout.CENTER);

        JPanel right = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0));
        right.setOpaque(false);

        right.add(new DTBadge(item.getStatus()));

        DTButton addGapBtn = new DTButton("Start Learning", DTButton.ButtonType.PRIMARY);
        addGapBtn.addActionListener(e -> {
            studentSkillDAO.addOrUpdateSkill(currentStudentId, item.getSkillId(), "Learning");
            DTToast.showSuccess(this, "Started learning " + item.getSkillName());
            if (changeListener != null) changeListener.onDataChanged();
            refreshData();
        });

        right.add(addGapBtn);
        row.add(right, BorderLayout.EAST);

        return row;
    }

    private void showAddSkillDialog() {
        List<Skill> allSkills = skillDAO.getAllSkills();
        if (allSkills.isEmpty()) {
            DTToast.showWarning(this, "No skills available in system database.");
            return;
        }

        String[] skillNames = allSkills.stream().map(Skill::getSkillName).toArray(String[]::new);
        JComboBox<String> skillCombo = new JComboBox<>(skillNames);
        JComboBox<String> statusCombo = new JComboBox<>(new String[]{"Completed", "Learning"});

        JPanel panel = new JPanel(new GridLayout(2, 2, 10, 10));
        panel.setBackground(DevTrackColors.BG_SURFACE);
        JLabel l1 = new JLabel("Select Skill:");
        l1.setFont(DevTrackFonts.FORM_LABEL);
        l1.setForeground(DevTrackColors.TEXT_PRIMARY);
        JLabel l2 = new JLabel("Initial Status:");
        l2.setFont(DevTrackFonts.FORM_LABEL);
        l2.setForeground(DevTrackColors.TEXT_PRIMARY);

        panel.add(l1);
        panel.add(skillCombo);
        panel.add(l2);
        panel.add(statusCombo);

        boolean confirm = DTConfirmDialog.show(this, "Add Skill to Profile", "Select a skill and status to add to your inventory.");
        if (confirm) {
            int selectedIdx = skillCombo.getSelectedIndex();
            if (selectedIdx >= 0 && selectedIdx < allSkills.size()) {
                Skill targetSkill = allSkills.get(selectedIdx);
                String selectedStatus = (String) statusCombo.getSelectedItem();
                boolean success = studentSkillDAO.addOrUpdateSkill(currentStudentId, targetSkill.getSkillId(), selectedStatus);
                if (success) {
                    DTToast.showSuccess(this, "Added '" + targetSkill.getSkillName() + "' (" + selectedStatus + ")");
                    if (changeListener != null) changeListener.onDataChanged();
                    refreshData();
                } else {
                    DTToast.showError(this, "Failed to add skill.");
                }
            }
        }
    }
}
