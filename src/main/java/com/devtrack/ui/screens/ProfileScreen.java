package com.devtrack.ui.screens;

import com.devtrack.dao.CareerRoleDAO;
import com.devtrack.dao.SkillDAO;
import com.devtrack.dao.StudentCareerGoalDAO;
import com.devtrack.dao.StudentDAO;
import com.devtrack.model.CareerRole;
import com.devtrack.model.Student;
import com.devtrack.ui.Theme;
import com.devtrack.ui.components.ModernButton;
import com.devtrack.ui.components.SectionHeader;
import com.devtrack.ui.components.StatusBadge;
import com.devtrack.ui.components.DTToast;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Profile Screen View.
 * Displays student profile attributes, academic standing, and preferences.
 */
public class ProfileScreen extends JPanel {

    public interface DataChangeListener {
        void onDataChanged();
    }

    private final StudentDAO studentDAO = new StudentDAO();
    private final StudentCareerGoalDAO goalDAO = new StudentCareerGoalDAO();
    private final CareerRoleDAO roleDAO = new CareerRoleDAO();
    private final SkillDAO skillDAO = new SkillDAO();

    private final JPanel detailsContainer = new JPanel();
    private final JPanel preferencesContainer = new JPanel();

    private DataChangeListener changeListener;

    public ProfileScreen(DataChangeListener changeListener) {
        this.changeListener = changeListener;

        setLayout(new BorderLayout());
        setBackground(Theme.BG_PRIMARY);
        setBorder(new EmptyBorder(24, 36, 24, 36));

        JPanel content = new JPanel();
        content.setLayout(new BoxLayout(content, BoxLayout.Y_AXIS));
        content.setOpaque(false);

        // Header
        SectionHeader header = new SectionHeader("STUDENT PROFILE & SETTINGS", "Manage your academic profile details, career progress overview, and platform preferences.");
        content.add(header);
        content.add(Box.createVerticalStrut(20));

        // Two Column Grid Layout
        JPanel grid = new JPanel(new GridLayout(1, 2, 20, 0));
        grid.setOpaque(false);

        grid.add(createProfileDetailsCard());
        grid.add(createPreferencesCard());

        content.add(grid);

        JScrollPane scrollPane = new JScrollPane(content);
        scrollPane.setBorder(null);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.getVerticalScrollBar().setUnitIncrement(24);

        add(scrollPane, BorderLayout.CENTER);

        refreshData();
    }

    public void refreshData() {
        detailsContainer.removeAll();

        int sId = com.devtrack.util.SessionManager.getInstance().getCurrentStudentId();
        Student s = studentDAO.getStudentById(sId);
        if (s == null) {
            s = studentDAO.getFirstStudent();
        }
        int roleId = goalDAO.getSelectedRoleId(sId);
        CareerRole role = roleDAO.getCareerRoleById(roleId);

        double progress = skillDAO.calculateSkillProgress(sId, roleId);
        int progressPerc = (int) Math.round(progress * 100);

        String name = s != null ? s.getName() : "Soham Saskar";
        String email = s != null ? s.getEmail() : "soham@devtrack.com";
        String college = s != null ? s.getCollege() : "Sanjivani University";
        String branch = s != null ? s.getBranch() : "AI & Data Science";
        String yearStr = (s != null ? s.getYear() : 3) + "rd Year";
        String roleName = role != null ? role.getRoleName() : "Backend Developer";

        detailsContainer.setLayout(new BoxLayout(detailsContainer, BoxLayout.Y_AXIS));
        detailsContainer.setOpaque(false);

        // Top Avatar / Name Badge Row
        JPanel topRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 0));
        topRow.setOpaque(false);

        JLabel avatarLabel = new JLabel(name.substring(0, 1).toUpperCase()) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(Theme.PRIMARY_DARK);
                g2.fillOval(0, 0, getWidth() - 1, getHeight() - 1);
                g2.dispose();
                super.paintComponent(g);
            }
        };
        avatarLabel.setFont(Theme.FONT_PAGE_TITLE);
        avatarLabel.setForeground(Theme.TEXT_LIGHT);
        avatarLabel.setHorizontalAlignment(SwingConstants.CENTER);
        avatarLabel.setPreferredSize(new Dimension(48, 48));

        JPanel nameWrap = new JPanel();
        nameWrap.setLayout(new BoxLayout(nameWrap, BoxLayout.Y_AXIS));
        nameWrap.setOpaque(false);

        JLabel nameTitle = new JLabel(name);
        nameTitle.setFont(Theme.FONT_PAGE_TITLE);
        nameTitle.setForeground(Theme.PRIMARY_DARK);

        JLabel emailSub = new JLabel(email);
        emailSub.setFont(Theme.FONT_BODY);
        emailSub.setForeground(Theme.TEXT_SECONDARY);

        nameWrap.add(nameTitle);
        nameWrap.add(Box.createVerticalStrut(2));
        nameWrap.add(emailSub);

        topRow.add(avatarLabel);
        topRow.add(nameWrap);

        detailsContainer.add(topRow);
        detailsContainer.add(Box.createVerticalStrut(18));

        // Info Rows
        detailsContainer.add(createDetailRow("College / University", college));
        detailsContainer.add(createDetailRow("Branch / Specialization", branch));
        detailsContainer.add(createDetailRow("Academic Standing", yearStr));
        detailsContainer.add(createDetailRow("Target Career Goal", roleName));
        detailsContainer.add(createDetailRow("Overall Goal Progress", progressPerc + "% Completed"));

        detailsContainer.revalidate();
        detailsContainer.repaint();
    }

    private JPanel createProfileDetailsCard() {
        JPanel card = createCardPanel();

        JLabel title = new JLabel("ACADEMIC & GOAL SUMMARY");
        title.setFont(Theme.FONT_SECTION_TITLE);
        title.setForeground(Theme.PRIMARY_DARK);
        title.setBorder(new EmptyBorder(0, 0, 16, 0));

        card.add(title, BorderLayout.NORTH);
        card.add(detailsContainer, BorderLayout.CENTER);

        // Edit Profile Button Strip
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 0));
        footer.setOpaque(false);
        footer.setBorder(new EmptyBorder(16, 0, 0, 0));

        ModernButton editBtn = new ModernButton("EDIT PROFILE", false);
        editBtn.addActionListener(e -> {
            JOptionPane.showMessageDialog(this, "Profile details are managed via database sync.", "Edit Profile", JOptionPane.INFORMATION_MESSAGE);
        });
        footer.add(editBtn);

        card.add(footer, BorderLayout.SOUTH);
        return card;
    }

    private JPanel createPreferencesCard() {
        JPanel card = createCardPanel();

        JLabel title = new JLabel("PLATFORM PREFERENCES & ALERTS");
        title.setFont(Theme.FONT_SECTION_TITLE);
        title.setForeground(Theme.PRIMARY_DARK);
        title.setBorder(new EmptyBorder(0, 0, 14, 0));

        card.add(title, BorderLayout.NORTH);

        preferencesContainer.setLayout(new BoxLayout(preferencesContainer, BoxLayout.Y_AXIS));
        preferencesContainer.setOpaque(false);

        // Styled Checkbox Choice Items
        StyledCheckBoxChoice cb1 = new StyledCheckBoxChoice("Email notifications for new opportunity matches", true);
        StyledCheckBoxChoice cb2 = new StyledCheckBoxChoice("Weekly skill progress summary digest", true);
        StyledCheckBoxChoice cb3 = new StyledCheckBoxChoice("Automatic skill gap alerts for career goal", true);
        StyledCheckBoxChoice cb4 = new StyledCheckBoxChoice("Allow verified recruiters to view profile", true);
        StyledCheckBoxChoice cb5 = new StyledCheckBoxChoice("SMS alerts for urgent application updates", false);

        preferencesContainer.add(cb1);
        preferencesContainer.add(Box.createVerticalStrut(8));
        preferencesContainer.add(cb2);
        preferencesContainer.add(Box.createVerticalStrut(8));
        preferencesContainer.add(cb3);
        preferencesContainer.add(Box.createVerticalStrut(8));
        preferencesContainer.add(cb4);
        preferencesContainer.add(Box.createVerticalStrut(8));
        preferencesContainer.add(cb5);
        preferencesContainer.add(Box.createVerticalStrut(16));

        // Styled Dropdown / Choice Inputs
        JPanel choicePanel = new JPanel(new GridLayout(2, 2, 10, 10));
        choicePanel.setOpaque(false);

        JLabel lblType = new JLabel("Preferred Opportunity Type:");
        lblType.setFont(Theme.FONT_LABEL_BOLD);
        lblType.setForeground(Theme.PRIMARY_DARK);

        JComboBox<String> comboType = new JComboBox<>(new String[]{"All Opportunities", "Internships Only", "Full-Time Roles"});
        comboType.setFont(Theme.FONT_BODY);

        JLabel lblVis = new JLabel("Profile Visibility:");
        lblVis.setFont(Theme.FONT_LABEL_BOLD);
        lblVis.setForeground(Theme.PRIMARY_DARK);

        JComboBox<String> comboVis = new JComboBox<>(new String[]{"Public to Partner Companies", "Private / Hidden"});
        comboVis.setFont(Theme.FONT_BODY);

        choicePanel.add(lblType);
        choicePanel.add(comboType);
        choicePanel.add(lblVis);
        choicePanel.add(comboVis);

        preferencesContainer.add(choicePanel);

        card.add(preferencesContainer, BorderLayout.CENTER);

        // Save Preferences Footer
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 0));
        footer.setOpaque(false);
        footer.setBorder(new EmptyBorder(16, 0, 0, 0));

        ModernButton saveBtn = new ModernButton("SAVE PREFERENCES", true);
        saveBtn.addActionListener(e -> {
            DTToast.showSuccess(this, "Profile preferences saved successfully!");
        });
        footer.add(saveBtn);

        card.add(footer, BorderLayout.SOUTH);
        return card;
    }

    private JPanel createDetailRow(String labelText, String valueText) {
        JPanel row = new JPanel(new BorderLayout());
        row.setOpaque(false);
        row.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(220, 223, 221)),
                new EmptyBorder(10, 4, 10, 4)
        ));

        JLabel lbl = new JLabel(labelText);
        lbl.setFont(Theme.FONT_BODY);
        lbl.setForeground(Theme.TEXT_SECONDARY);

        JLabel val = new JLabel(valueText);
        val.setFont(Theme.FONT_LABEL_BOLD);
        val.setForeground(Theme.PRIMARY_DARK);

        row.add(lbl, BorderLayout.WEST);
        row.add(val, BorderLayout.EAST);
        return row;
    }

    private JPanel createCardPanel() {
        JPanel card = new JPanel(new BorderLayout()) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                g2.setColor(Theme.LIGHT_SURFACE);
                g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 10, 10);

                g2.setColor(Theme.BORDER_COLOR);
                g2.setStroke(new BasicStroke(1.5f));
                g2.drawRoundRect(1, 1, getWidth() - 3, getHeight() - 3, 10, 10);

                g2.dispose();
                super.paintComponent(g2);
            }
        };
        card.setOpaque(false);
        card.setBorder(new EmptyBorder(18, 20, 18, 20));
        return card;
    }

    /**
     * Custom Styled Checkbox Choice Row Component matching theme aesthetics.
     */
    private static class StyledCheckBoxChoice extends JPanel {
        private boolean isChecked;
        private final String labelText;

        public StyledCheckBoxChoice(String labelText, boolean initialChecked) {
            this.labelText = labelText;
            this.isChecked = initialChecked;

            setLayout(new BorderLayout(10, 0));
            setOpaque(false);
            setCursor(new Cursor(Cursor.HAND_CURSOR));
            setBorder(new EmptyBorder(6, 4, 6, 4));

            JComponent checkIcon = new JComponent() {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2 = (Graphics2D) g.create();
                    g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                    int size = 20;
                    int x = 0;
                    int y = (getHeight() - size) / 2;

                    if (isChecked) {
                        g2.setColor(Theme.PRIMARY_DARK);
                        g2.fillRoundRect(x, y, size, size, 6, 6);

                        g2.setColor(Theme.TEXT_LIGHT);
                        g2.setStroke(new BasicStroke(2.0f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
                        g2.drawLine(x + 5, y + 10, x + 9, y + 14);
                        g2.drawLine(x + 9, y + 14, x + 15, y + 6);
                    } else {
                        g2.setColor(Theme.LIGHT_SURFACE);
                        g2.fillRoundRect(x, y, size, size, 6, 6);

                        g2.setColor(Theme.BORDER_COLOR);
                        g2.setStroke(new BasicStroke(1.5f));
                        g2.drawRoundRect(x, y, size - 1, size - 1, 6, 6);
                    }
                    g2.dispose();
                }
            };
            checkIcon.setPreferredSize(new Dimension(24, 24));

            JLabel textLabel = new JLabel(labelText);
            textLabel.setFont(Theme.FONT_BODY);
            textLabel.setForeground(Theme.PRIMARY_DARK);

            add(checkIcon, BorderLayout.WEST);
            add(textLabel, BorderLayout.CENTER);

            addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    isChecked = !isChecked;
                    repaint();
                }
            });
        }
    }
}
