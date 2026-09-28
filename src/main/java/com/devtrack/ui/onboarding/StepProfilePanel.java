package com.devtrack.ui.onboarding;

import com.devtrack.model.Student;
import com.devtrack.service.OnboardingService;
import com.devtrack.ui.components.*;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

/**
 * Onboarding Step 1: Student Profile Review & Update Panel (Nordic Technical Dark).
 */
public class StepProfilePanel extends JPanel {

    public interface OnStepCompleteListener {
        void onStepComplete();
    }

    private final OnStepCompleteListener listener;
    private final OnboardingService onboardingService;

    private final DTTextField nameField;
    private final DTTextField emailField;
    private final DTTextField collegeField;
    private final DTTextField branchField;
    private final DTComboBox<Integer> yearCombo;
    private final JLabel errorLabel;

    public StepProfilePanel(OnStepCompleteListener listener) {
        this.listener = listener;
        this.onboardingService = new OnboardingService();

        setLayout(new GridBagLayout());
        setOpaque(false);

        // Center Card Panel (Nordic Dark Level 2 Surface, 6px radius)
        DTCard card = new DTCard();
        card.setLayout(new BoxLayout(card, BoxLayout.Y_AXIS));
        card.setBorder(new EmptyBorder(32, 40, 32, 40));
        card.setPreferredSize(new Dimension(660, 580));
        card.setMaximumSize(new Dimension(660, 580));
        card.setMinimumSize(new Dimension(600, 540));

        // Header
        JLabel title = new JLabel("STEP 01 — REVIEW YOUR PROFILE");
        title.setFont(DevTrackFonts.SECTION_TITLE);
        title.setForeground(DevTrackColors.TEXT_PRIMARY);
        title.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel subtitle = new JLabel("Confirm your academic details to personalize your career track.");
        subtitle.setFont(DevTrackFonts.SECONDARY);
        subtitle.setForeground(DevTrackColors.TEXT_SECONDARY);
        subtitle.setAlignmentX(Component.CENTER_ALIGNMENT);
        subtitle.setPreferredSize(new Dimension(580, 24));
        subtitle.setMaximumSize(new Dimension(580, 24));

        card.add(title);
        card.add(Box.createVerticalStrut(4));
        card.add(subtitle);
        card.add(Box.createVerticalStrut(18));

        errorLabel = new JLabel(" ");
        errorLabel.setFont(DevTrackFonts.CAPTION);
        errorLabel.setForeground(DevTrackColors.ERROR_TEXT);
        errorLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        card.add(errorLabel);
        card.add(Box.createVerticalStrut(12));

        // Fetch Current Authenticated Student
        Student currentStudent = SessionManager.getInstance().getCurrentStudent();
        String nameVal = currentStudent != null ? currentStudent.getName() : "Soham Saskar";
        String emailVal = currentStudent != null ? currentStudent.getEmail() : "soham@devtrack.com";
        String collegeVal = currentStudent != null ? currentStudent.getCollege() : "Sanjivani University";
        String branchVal = currentStudent != null ? currentStudent.getBranch() : "AI & Data Science";
        int yearVal = currentStudent != null ? currentStudent.getYear() : 3;

        // Form Grid Panel
        JPanel formGrid = new JPanel(new GridLayout(3, 2, 24, 16));
        formGrid.setOpaque(false);
        formGrid.setPreferredSize(new Dimension(580, 250));
        formGrid.setMaximumSize(new Dimension(580, 250));
        formGrid.setAlignmentX(Component.CENTER_ALIGNMENT);

        nameField = new DTTextField(nameVal);
        emailField = new DTTextField(emailVal);
        emailField.setEditable(false);

        collegeField = new DTTextField(collegeVal);
        branchField = new DTTextField(branchVal);
        yearCombo = new DTComboBox<>(new Integer[]{1, 2, 3, 4, 5, 6});
        yearCombo.setSelectedItem(yearVal);

        formGrid.add(createFieldBox("Full Name", nameField));
        formGrid.add(createFieldBox("Email (Account ID)", emailField));
        formGrid.add(createFieldBox("College / University", collegeField));
        formGrid.add(createFieldBox("Branch / Specialization", branchField));
        formGrid.add(createFieldBox("Academic Year", yearCombo));
        formGrid.add(new JPanel() {{ setOpaque(false); }});

        card.add(formGrid);
        card.add(Box.createVerticalStrut(32));

        // Footer Action Strip
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 0));
        footer.setOpaque(false);
        footer.setPreferredSize(new Dimension(580, 44));
        footer.setMaximumSize(new Dimension(580, 44));
        footer.setAlignmentX(Component.CENTER_ALIGNMENT);

        DTButton continueBtn = new DTButton("CONTINUE TO CAREER GOAL →", DTButton.ButtonType.PRIMARY);
        continueBtn.setFont(DevTrackFonts.BUTTON);
        continueBtn.setPreferredSize(new Dimension(280, 44));
        continueBtn.setMaximumSize(new Dimension(280, 44));
        continueBtn.addActionListener(e -> saveAndContinue());
        footer.add(continueBtn);

        card.add(footer);
        add(card);
    }

    private JPanel createFieldBox(String labelText, JComponent field) {
        JPanel box = new JPanel();
        box.setLayout(new BoxLayout(box, BoxLayout.Y_AXIS));
        box.setOpaque(false);

        JLabel lbl = new JLabel(labelText);
        lbl.setFont(DevTrackFonts.FORM_LABEL);
        lbl.setForeground(DevTrackColors.TEXT_PRIMARY);
        lbl.setAlignmentX(Component.LEFT_ALIGNMENT);
        lbl.setPreferredSize(new Dimension(278, 20));
        lbl.setMaximumSize(new Dimension(278, 20));

        field.setFont(DevTrackFonts.BODY);
        field.setPreferredSize(new Dimension(278, 44));
        field.setMaximumSize(new Dimension(278, 44));
        field.setMinimumSize(new Dimension(278, 44));
        field.setAlignmentX(Component.LEFT_ALIGNMENT);

        box.add(lbl);
        box.add(Box.createVerticalStrut(6));
        box.add(field);
        return box;
    }

    private void saveAndContinue() {
        String name = nameField.getText().trim();
        String college = collegeField.getText().trim();
        String branch = branchField.getText().trim();
        Object yearObj = yearCombo.getSelectedItem();
        int year = yearObj instanceof Integer ? (Integer) yearObj : 3;

        if (name.isEmpty() || college.isEmpty() || branch.isEmpty()) {
            errorLabel.setText("Please fill in all profile fields.");
            return;
        }

        Student current = SessionManager.getInstance().getCurrentStudent();
        if (current != null) {
            current.setName(name);
            current.setCollege(college);
            current.setBranch(branch);
            current.setYear(year);
            onboardingService.updateStudentProfile(current);
        }

        errorLabel.setText(" ");
        if (listener != null) {
            listener.onStepComplete();
        }
    }
}
