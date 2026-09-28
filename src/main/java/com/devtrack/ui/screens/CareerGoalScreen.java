package com.devtrack.ui.screens;

import com.devtrack.dao.CareerRoleDAO;
import com.devtrack.dao.SkillDAO;
import com.devtrack.dao.StudentCareerGoalDAO;
import com.devtrack.model.CareerRole;
import com.devtrack.ui.Theme;
import com.devtrack.ui.components.ModernButton;
import com.devtrack.ui.components.SectionHeader;
import com.devtrack.ui.components.StatusBadge;
import com.devtrack.util.SessionManager;
import com.devtrack.ui.components.DTToast;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.List;

/**
 * Career Goal Screen View.
 * Displays target software roles, skill requirements mapping, and selection controls connected to MySQL.
 */
public class CareerGoalScreen extends JPanel {

    public interface DataChangeListener {
        void onDataChanged();
    }

    private final JPanel rolesContainer;
    private final StudentCareerGoalDAO goalDAO = new StudentCareerGoalDAO();
    private final CareerRoleDAO roleDAO = new CareerRoleDAO();
    private final SkillDAO skillDAO = new SkillDAO();
    private DataChangeListener changeListener;

    public CareerGoalScreen(DataChangeListener changeListener) {
        this.changeListener = changeListener;

        setLayout(new BorderLayout());
        setBackground(Theme.BG_PRIMARY);
        setBorder(new EmptyBorder(24, 36, 24, 36));

        // Scroll Container
        JPanel content = new JPanel();
        content.setLayout(new BoxLayout(content, BoxLayout.Y_AXIS));
        content.setOpaque(false);

        // Header
        SectionHeader header = new SectionHeader("CAREER GOAL MANAGEMENT", "Select your target software development role to calculate personalized skill gaps.");
        content.add(header);
        content.add(Box.createVerticalStrut(20));

        // Roles List Panel
        rolesContainer = new JPanel();
        rolesContainer.setLayout(new BoxLayout(rolesContainer, BoxLayout.Y_AXIS));
        rolesContainer.setOpaque(false);
        rolesContainer.setBorder(new EmptyBorder(8, 12, 12, 12));

        content.add(rolesContainer);

        JScrollPane scrollPane = new JScrollPane(content);
        scrollPane.setBorder(null);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.getVerticalScrollBar().setUnitIncrement(24);

        add(scrollPane, BorderLayout.CENTER);

        refreshData();
    }

    public void refreshData() {
        rolesContainer.removeAll();

        int currentStudentId = SessionManager.getInstance().getCurrentStudentId();
        int selectedRoleId = goalDAO.getSelectedRoleId(currentStudentId);
        List<CareerRole> roles = roleDAO.getAllCareerRoles();

        for (CareerRole r : roles) {
            String reqSkills = skillDAO.getRoleSkillNames(r.getRoleId());
            double progress = skillDAO.calculateSkillProgress(currentStudentId, r.getRoleId());
            int matchPerc = (int) Math.round(progress * 100);
            boolean isSelected = (r.getRoleId() == selectedRoleId);

            rolesContainer.add(new RoleCardPanel(r, reqSkills, matchPerc, isSelected, currentStudentId));
            rolesContainer.add(Box.createVerticalStrut(14));
        }

        rolesContainer.revalidate();
        rolesContainer.repaint();
    }

    private class RoleCardPanel extends JPanel {
        private final CareerRole role;
        private final boolean isSelected;
        private boolean isHovered = false;

        public RoleCardPanel(CareerRole role, String reqSkills, int currentMatch, boolean isSelected, int studentId) {
            this.role = role;
            this.isSelected = isSelected;

            setLayout(new BorderLayout(16, 0));
            setOpaque(false);
            setCursor(new Cursor(Cursor.HAND_CURSOR));
            setBorder(new EmptyBorder(18, 22, 18, 22));

            // Left Content
            JPanel left = new JPanel();
            left.setLayout(new BoxLayout(left, BoxLayout.Y_AXIS));
            left.setOpaque(false);

            JPanel titleRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
            titleRow.setOpaque(false);

            JLabel titleLabel = new JLabel(role.getRoleName());
            titleLabel.setFont(Theme.FONT_PAGE_TITLE);
            titleLabel.setForeground(Theme.PRIMARY_DARK);
            titleRow.add(titleLabel);

            if (isSelected) {
                StatusBadge activeBadge = new StatusBadge("Active Goal");
                titleRow.add(activeBadge);
            }

            JLabel descLabel = new JLabel(role.getDescription());
            descLabel.setFont(Theme.FONT_BODY);
            descLabel.setForeground(Theme.TEXT_SECONDARY);

            JLabel reqLabel = new JLabel("Required Skills: " + reqSkills);
            reqLabel.setFont(Theme.FONT_SMALL);
            reqLabel.setForeground(Theme.TEXT_MUTED);

            left.add(titleRow);
            left.add(Box.createVerticalStrut(6));
            left.add(descLabel);
            left.add(Box.createVerticalStrut(6));
            left.add(reqLabel);

            add(left, BorderLayout.CENTER);

            // Right Match & Action
            JPanel right = new JPanel();
            right.setLayout(new BoxLayout(right, BoxLayout.Y_AXIS));
            right.setOpaque(false);

            JLabel matchLabel = new JLabel(currentMatch + "% Match");
            matchLabel.setFont(Theme.FONT_PAGE_TITLE);
            matchLabel.setForeground(isSelected ? Theme.ACCENT_PRIMARY : Theme.TEXT_MUTED);
            matchLabel.setAlignmentX(Component.RIGHT_ALIGNMENT);

            ModernButton selectBtn = new ModernButton(isSelected ? "SELECTED GOAL" : "SELECT AS GOAL", isSelected);
            selectBtn.setAlignmentX(Component.RIGHT_ALIGNMENT);
            selectBtn.addActionListener(e -> {
                if (!isSelected) {
                    boolean success = goalDAO.saveStudentCareerGoal(studentId, role.getRoleId());
                    if (success) {
                        DTToast.showSuccess(CareerGoalScreen.this, "Career Goal updated to " + role.getRoleName());
                        refreshData();
                        if (changeListener != null) {
                            changeListener.onDataChanged();
                        }
                    } else {
                        DTToast.showError(CareerGoalScreen.this, "Unable to update career goal in database.");
                    }
                }
            });

            right.add(matchLabel);
            right.add(Box.createVerticalStrut(10));
            right.add(selectBtn);

            add(right, BorderLayout.EAST);

            addMouseListener(new MouseAdapter() {
                @Override
                public void mouseEntered(MouseEvent e) {
                    isHovered = true;
                    repaint();
                }

                @Override
                public void mouseExited(MouseEvent e) {
                    isHovered = false;
                    repaint();
                }
            });
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            g2.setColor(isSelected ? Theme.ROLE_BOX_BG : Theme.LIGHT_SURFACE);
            g2.fillRoundRect(1, 1, getWidth() - 3, getHeight() - 3, 10, 10);

            g2.setColor(isSelected ? Theme.ACCENT_PRIMARY : (isHovered ? Theme.PRIMARY_DARK : Theme.BORDER_COLOR));
            g2.setStroke(new BasicStroke(isSelected ? 2.0f : 1.5f));
            g2.drawRoundRect(1, 1, getWidth() - 3, getHeight() - 3, 10, 10);

            g2.dispose();
            super.paintComponent(g2);
        }
    }
}
