package com.devtrack.ui.onboarding;

import com.devtrack.dao.CareerRoleDAO;
import com.devtrack.model.CareerRole;
import com.devtrack.service.OnboardingService;
import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.components.DTCard;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.List;

/**
 * Onboarding Step 2: Target Career Goal Selection Panel (Nordic Technical Dark).
 */
public class StepGoalPanel extends JPanel {

    public interface OnStepNavigationListener {
        void onNextStep();
        void onPrevStep();
    }

    private final OnStepNavigationListener navListener;
    private final CareerRoleDAO roleDAO;
    private final OnboardingService onboardingService;

    private int selectedRoleId = -1;
    private final JLabel errorLabel;
    private final JPanel rolesGrid;

    public StepGoalPanel(OnStepNavigationListener navListener) {
        this.navListener = navListener;
        this.roleDAO = new CareerRoleDAO();
        this.onboardingService = new OnboardingService();

        setLayout(new BorderLayout());
        setOpaque(false);
        setBorder(new EmptyBorder(16, 24, 16, 24));

        // Header Panel
        JPanel headerPanel = new JPanel();
        headerPanel.setLayout(new BoxLayout(headerPanel, BoxLayout.Y_AXIS));
        headerPanel.setOpaque(false);

        JLabel title = new JLabel("STEP 02 — SELECT YOUR PRIMARY CAREER GOAL");
        title.setFont(DevTrackFonts.SECTION_TITLE);
        title.setForeground(DevTrackColors.TEXT_PRIMARY);
        title.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel subtitle = new JLabel("Choose the career role you are actively targeting. Your skill gaps will be measured against this goal.");
        subtitle.setFont(DevTrackFonts.SECONDARY);
        subtitle.setForeground(DevTrackColors.TEXT_SECONDARY);
        subtitle.setAlignmentX(Component.CENTER_ALIGNMENT);

        errorLabel = new JLabel(" ");
        errorLabel.setFont(DevTrackFonts.CAPTION);
        errorLabel.setForeground(DevTrackColors.ERROR_TEXT);
        errorLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        headerPanel.add(title);
        headerPanel.add(Box.createVerticalStrut(4));
        headerPanel.add(subtitle);
        headerPanel.add(Box.createVerticalStrut(8));
        headerPanel.add(errorLabel);
        headerPanel.add(Box.createVerticalStrut(12));

        add(headerPanel, BorderLayout.NORTH);

        // Dynamically load career roles from MySQL
        List<CareerRole> roles = roleDAO.getAllCareerRoles();

        rolesGrid = new JPanel(new GridLayout(0, 2, 16, 16));
        rolesGrid.setOpaque(false);
        rolesGrid.setBorder(new EmptyBorder(12, 16, 16, 16));

        for (CareerRole role : roles) {
            rolesGrid.add(createRoleCard(role));
        }

        JScrollPane scrollPane = new JScrollPane(rolesGrid);
        scrollPane.setBorder(null);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.getVerticalScrollBar().setUnitIncrement(20);

        add(scrollPane, BorderLayout.CENTER);

        // Footer Action Strip
        JPanel footer = new JPanel(new BorderLayout());
        footer.setOpaque(false);
        footer.setBorder(new EmptyBorder(16, 0, 0, 0));

        DTButton backBtn = new DTButton("← BACK", DTButton.ButtonType.SECONDARY);
        backBtn.setPreferredSize(new Dimension(140, 44));
        backBtn.addActionListener(e -> {
            if (navListener != null) navListener.onPrevStep();
        });

        DTButton continueBtn = new DTButton("CONTINUE TO SKILLS →", DTButton.ButtonType.PRIMARY);
        continueBtn.setPreferredSize(new Dimension(240, 44));
        continueBtn.addActionListener(e -> saveAndContinue());

        footer.add(backBtn, BorderLayout.WEST);
        footer.add(continueBtn, BorderLayout.EAST);

        add(footer, BorderLayout.SOUTH);
    }

    private JPanel createRoleCard(CareerRole role) {
        RoleCardPanel card = new RoleCardPanel(role);
        card.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                selectedRoleId = role.getRoleId();
                refreshRoleGridSelection();
            }
        });
        return card;
    }

    private void refreshRoleGridSelection() {
        for (Component comp : rolesGrid.getComponents()) {
            if (comp instanceof RoleCardPanel) {
                ((RoleCardPanel) comp).updateSelectedState();
            }
        }
        rolesGrid.revalidate();
        rolesGrid.repaint();
    }

    private void saveAndContinue() {
        if (selectedRoleId <= 0) {
            errorLabel.setText("Please select a career goal.");
            return;
        }

        int currentStudentId = SessionManager.getInstance().getCurrentStudentId();
        boolean saved = onboardingService.saveCareerGoal(currentStudentId, selectedRoleId);

        if (saved) {
            errorLabel.setText(" ");
            if (navListener != null) {
                navListener.onNextStep();
            }
        } else {
            errorLabel.setText("Unable to save career goal. Please try again.");
        }
    }

    private class RoleCardPanel extends DTCard {
        private final CareerRole role;

        public RoleCardPanel(CareerRole role) {
            super(true);
            this.role = role;
            setLayout(new BorderLayout(0, 6));
            setPreferredSize(new Dimension(340, 135));

            JLabel nameLbl = new JLabel(role.getRoleName());
            nameLbl.setFont(DevTrackFonts.HEADING_2);
            nameLbl.setForeground(DevTrackColors.TEXT_PRIMARY);

            JTextArea descArea = new JTextArea(role.getDescription());
            descArea.setFont(DevTrackFonts.BODY);
            descArea.setForeground(DevTrackColors.TEXT_SECONDARY);
            descArea.setLineWrap(true);
            descArea.setWrapStyleWord(true);
            descArea.setEditable(false);
            descArea.setOpaque(false);
            descArea.setFocusable(false);

            add(nameLbl, BorderLayout.NORTH);
            add(descArea, BorderLayout.CENTER);
        }

        public void updateSelectedState() {
            setSelected(selectedRoleId == role.getRoleId());
        }
    }
}
