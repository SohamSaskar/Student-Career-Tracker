package com.devtrack.ui.screens;

import com.devtrack.service.AuthService;
import com.devtrack.service.AuthService.AuthResult;
import com.devtrack.ui.components.*;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Signup Screen View (Light / Slate Professional Specification).
 * Matches exact spec:
 * - Background: #FAFAFA
 * - Auth card: #FFFFFF surface, 1px #E1E3E6 border, subtle shadow
 * - "DEVTRACK" wordmark: #1A1D21, letter-spaced
 * - "Create account": #52585F
 * - Labels: #52585F
 * - Input fields: #F1F2F4 fill, #E1E3E6 border, focus -> #2A4C78 ring
 * - Create Account button: #1E3A5F fill, #FFFFFF text -> hover #2A4C78 -> active #142A45
 * - "Already have an account?": #8A8F96
 * - "Sign in" link: #1E3A5F, underline on hover
 */
public class SignupScreen extends JPanel {

    public interface OnSignupSuccessListener {
        void onSignupSuccess();
    }

    public interface OnSwitchToLoginListener {
        void onSwitchToLogin();
    }

    private final OnSignupSuccessListener signupSuccessListener;
    private final OnSwitchToLoginListener switchToLoginListener;
    private final AuthService authService;

    private final DTTextField nameField;
    private final DTTextField usernameField;
    private final DTTextField emailField;
    private final DTPasswordField passwordField;
    private final DTPasswordField confirmPasswordField;
    private final DTTextField collegeField;
    private final DTTextField branchField;
    private final DTComboBox<Integer> yearCombo;
    private final DTButton createBtn;
    private final JLabel errorLabel;

    private static final int FORM_WIDTH = 380;
    private static final int FIELD_HEIGHT = 44;

    public SignupScreen(OnSignupSuccessListener signupSuccessListener, OnSwitchToLoginListener switchToLoginListener) {
        this.signupSuccessListener = signupSuccessListener;
        this.switchToLoginListener = switchToLoginListener;
        this.authService = new AuthService();

        setLayout(new GridBagLayout());
        setBackground(DevTrackColors.BG_APP); // #FAFAFA

        // Center Card Panel (460px Fixed Width for Scrollable Container, #FFFFFF Surface)
        DTCard card = new DTCard();
        card.setLayout(new BorderLayout());
        card.setBorder(new EmptyBorder(24, 24, 24, 24));
        card.setPreferredSize(new Dimension(460, 640));
        card.setMaximumSize(new Dimension(460, 680));

        // Inner Form Container (Single Column, 380px Width Components)
        JPanel formContent = new JPanel();
        formContent.setLayout(new BoxLayout(formContent, BoxLayout.Y_AXIS));
        formContent.setOpaque(false);
        formContent.setBorder(new EmptyBorder(0, 10, 0, 10));

        // 1. Header & Identity
        JLabel wordmark = new JLabel("D E V T R A C K");
        wordmark.setFont(new Font(DevTrackFonts.FONT_FAMILY, Font.BOLD, 22));
        wordmark.setForeground(DevTrackColors.TEXT_PRIMARY); // #1A1D21
        wordmark.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel brandSub = new JLabel("Student Career Readiness Platform");
        brandSub.setFont(DevTrackFonts.CAPTION);
        brandSub.setForeground(DevTrackColors.TEXT_MUTED); // #8A8F96
        brandSub.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel subtitle = new JLabel("Create account");
        subtitle.setFont(DevTrackFonts.PAGE_TITLE);
        subtitle.setForeground(DevTrackColors.TEXT_SECONDARY); // #52585F
        subtitle.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel tag = new JLabel("Start your career readiness journey.");
        tag.setFont(DevTrackFonts.SECONDARY);
        tag.setForeground(DevTrackColors.TEXT_MUTED); // #8A8F96
        tag.setAlignmentX(Component.CENTER_ALIGNMENT);

        formContent.add(wordmark);
        formContent.add(Box.createVerticalStrut(2));
        formContent.add(brandSub);
        formContent.add(Box.createVerticalStrut(10));
        formContent.add(subtitle);
        formContent.add(Box.createVerticalStrut(4));
        formContent.add(tag);
        formContent.add(Box.createVerticalStrut(12));

        // 2. Fixed Error Area
        JPanel errorPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 0));
        errorPanel.setOpaque(false);
        errorPanel.setPreferredSize(new Dimension(FORM_WIDTH, 22));
        errorPanel.setMaximumSize(new Dimension(FORM_WIDTH, 22));
        errorPanel.setAlignmentX(Component.CENTER_ALIGNMENT);

        errorLabel = new JLabel(" ");
        errorLabel.setFont(DevTrackFonts.CAPTION);
        errorLabel.setForeground(DevTrackColors.ERROR_TEXT); // #B3261E
        errorPanel.add(errorLabel);

        formContent.add(errorPanel);
        formContent.add(Box.createVerticalStrut(8));

        // 3. Single Column Fields (380px Width x 44px Height Each)
        nameField = new DTTextField();
        nameField.setPlaceholder("Your full name");
        nameField.addActionListener(e -> performSignup());

        usernameField = new DTTextField();
        usernameField.setPlaceholder("Desired username");
        usernameField.addActionListener(e -> performSignup());

        emailField = new DTTextField();
        emailField.setPlaceholder("you@example.com");
        emailField.addActionListener(e -> performSignup());

        passwordField = new DTPasswordField();
        passwordField.addActionListener(e -> performSignup());

        confirmPasswordField = new DTPasswordField();
        confirmPasswordField.addActionListener(e -> performSignup());

        collegeField = new DTTextField("Sanjivani University");
        collegeField.addActionListener(e -> performSignup());

        branchField = new DTTextField("AI & Data Science");
        branchField.addActionListener(e -> performSignup());

        yearCombo = new DTComboBox<>(new Integer[]{1, 2, 3, 4, 5, 6});
        yearCombo.setSelectedItem(3);

        JPanel nameGroup = createFieldGroup("Full Name", nameField);
        JPanel usernameGroup = createFieldGroup("Username", usernameField);
        JPanel emailGroup = createFieldGroup("Email", emailField);
        JPanel passwordGroup = createFieldGroup("Password", passwordField);
        JPanel confirmPasswordGroup = createFieldGroup("Confirm Password", confirmPasswordField);
        JPanel collegeGroup = createFieldGroup("College / University", collegeField);
        JPanel branchGroup = createFieldGroup("Branch / Major", branchField);
        JPanel yearGroup = createFieldGroup("Academic Year", yearCombo);

        formContent.add(nameGroup);
        formContent.add(Box.createVerticalStrut(12));
        formContent.add(usernameGroup);
        formContent.add(Box.createVerticalStrut(12));
        formContent.add(emailGroup);
        formContent.add(Box.createVerticalStrut(12));
        formContent.add(passwordGroup);
        formContent.add(Box.createVerticalStrut(12));
        formContent.add(confirmPasswordGroup);
        formContent.add(Box.createVerticalStrut(12));
        formContent.add(collegeGroup);
        formContent.add(Box.createVerticalStrut(12));
        formContent.add(branchGroup);
        formContent.add(Box.createVerticalStrut(12));
        formContent.add(yearGroup);
        formContent.add(Box.createVerticalStrut(20));

        // 4. Create Account Button (#1E3A5F fill, #FFFFFF text -> hover #2A4C78 -> active #142A45)
        createBtn = new DTButton("Create Account", DTButton.ButtonType.PRIMARY);
        createBtn.setFont(DevTrackFonts.BUTTON);
        createBtn.setAlignmentX(Component.CENTER_ALIGNMENT);
        createBtn.setPreferredSize(new Dimension(FORM_WIDTH, FIELD_HEIGHT));
        createBtn.setMaximumSize(new Dimension(FORM_WIDTH, FIELD_HEIGHT));
        createBtn.setMinimumSize(new Dimension(FORM_WIDTH, FIELD_HEIGHT));
        createBtn.addActionListener(e -> performSignup());
        formContent.add(createBtn);
        formContent.add(Box.createVerticalStrut(16));

        // 5. Login Switch Link ("Already have an account?": #8A8F96, "Sign in": #1E3A5F underline on hover)
        JPanel switchPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 4, 0));
        switchPanel.setOpaque(false);
        switchPanel.setPreferredSize(new Dimension(FORM_WIDTH, 24));
        switchPanel.setMaximumSize(new Dimension(FORM_WIDTH, 24));

        JLabel promptLabel = new JLabel("Already have an account?");
        promptLabel.setFont(DevTrackFonts.BODY);
        promptLabel.setForeground(DevTrackColors.TEXT_MUTED); // #8A8F96

        JLabel loginLink = new JLabel("Sign in");
        loginLink.setFont(DevTrackFonts.FORM_LABEL);
        loginLink.setForeground(DevTrackColors.ACCENT_PRIMARY); // #1E3A5F
        loginLink.setCursor(new Cursor(Cursor.HAND_CURSOR));
        loginLink.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                loginLink.setText("<html><u>Sign in</u></html>");
            }

            @Override
            public void mouseExited(MouseEvent e) {
                loginLink.setText("Sign in");
            }

            @Override
            public void mouseClicked(MouseEvent e) {
                if (switchToLoginListener != null) {
                    clearForm();
                    switchToLoginListener.onSwitchToLogin();
                }
            }
        });

        switchPanel.add(promptLabel);
        switchPanel.add(loginLink);
        switchPanel.setAlignmentX(Component.CENTER_ALIGNMENT);
        formContent.add(switchPanel);
        formContent.add(Box.createVerticalStrut(10));

        // Wrap inner form in a dark JScrollPane
        JScrollPane scrollPane = new JScrollPane(formContent);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.setBorder(null);
        scrollPane.getVerticalScrollBar().setUnitIncrement(12);

        card.add(scrollPane, BorderLayout.CENTER);
        add(card);
    }

    private JPanel createFieldGroup(String labelText, JComponent field) {
        JPanel group = new JPanel();
        group.setLayout(new BoxLayout(group, BoxLayout.Y_AXIS));
        group.setOpaque(false);
        group.setPreferredSize(new Dimension(FORM_WIDTH, 70));
        group.setMaximumSize(new Dimension(FORM_WIDTH, 70));
        group.setMinimumSize(new Dimension(FORM_WIDTH, 70));
        group.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel label = new JLabel(labelText);
        label.setFont(DevTrackFonts.FORM_LABEL);
        label.setForeground(DevTrackColors.TEXT_PRIMARY); // #181818
        label.setAlignmentX(Component.LEFT_ALIGNMENT);

        field.setFont(DevTrackFonts.BODY);
        field.setPreferredSize(new Dimension(FORM_WIDTH, FIELD_HEIGHT));
        field.setMaximumSize(new Dimension(FORM_WIDTH, FIELD_HEIGHT));
        field.setMinimumSize(new Dimension(FORM_WIDTH, FIELD_HEIGHT));
        field.setAlignmentX(Component.LEFT_ALIGNMENT);

        group.add(label);
        group.add(Box.createVerticalStrut(6));
        group.add(field);
        return group;
    }

    public void performSignup() {
        String name = nameField.getText() != null ? nameField.getText().trim() : "";
        String username = usernameField.getText() != null ? usernameField.getText().trim() : "";
        String email = emailField.getText() != null ? emailField.getText().trim() : "";
        String password = new String(passwordField.getPassword());
        String confirmPassword = new String(confirmPasswordField.getPassword());
        String college = collegeField.getText() != null ? collegeField.getText().trim() : "";
        String branch = branchField.getText() != null ? branchField.getText().trim() : "";
        Object yearObj = yearCombo.getSelectedItem();
        String yearStr = yearObj != null ? yearObj.toString() : "";

        if (name.isEmpty()) {
            errorLabel.setText("Full name is required.");
            nameField.setError(true);
            nameField.requestFocusInWindow();
            return;
        }

        if (username.isEmpty()) {
            errorLabel.setText("Username is required.");
            usernameField.setError(true);
            usernameField.requestFocusInWindow();
            return;
        }

        if (!username.matches("^[a-zA-Z0-9_]+$")) {
            errorLabel.setText("Username can contain letters, numbers, and underscores only.");
            usernameField.setError(true);
            usernameField.requestFocusInWindow();
            return;
        }

        if (email.isEmpty()) {
            errorLabel.setText("Email is required.");
            emailField.setError(true);
            emailField.requestFocusInWindow();
            return;
        }

        if (!email.contains("@") || !email.contains(".") || email.length() < 5) {
            errorLabel.setText("Please enter a valid email address.");
            emailField.setError(true);
            emailField.requestFocusInWindow();
            return;
        }

        if (password.isEmpty()) {
            errorLabel.setText("Password is required.");
            passwordField.setError(true);
            passwordField.requestFocusInWindow();
            return;
        }

        if (password.length() < 8) {
            errorLabel.setText("Password must be at least 8 characters long.");
            passwordField.setError(true);
            passwordField.requestFocusInWindow();
            return;
        }

        if (!password.equals(confirmPassword)) {
            errorLabel.setText("Passwords do not match.");
            confirmPasswordField.setError(true);
            confirmPasswordField.requestFocusInWindow();
            return;
        }

        createBtn.setEnabled(false);
        createBtn.setText("Creating Account...");

        SwingUtilities.invokeLater(() -> {
            try {
                AuthResult result = authService.signup(name, username, email, password, confirmPassword, college, branch, yearStr);

                if (result.isSuccess()) {
                    errorLabel.setText(" ");
                    nameField.setError(false);
                    usernameField.setError(false);
                    emailField.setError(false);
                    passwordField.setError(false);
                    confirmPasswordField.setError(false);
                    if (signupSuccessListener != null) {
                        signupSuccessListener.onSignupSuccess();
                    }
                } else {
                    errorLabel.setText(result.getMessage());
                    String msg = result.getMessage().toLowerCase();
                    if (msg.contains("username")) {
                        usernameField.setError(true);
                    } else if (msg.contains("email")) {
                        emailField.setError(true);
                    } else if (msg.contains("password")) {
                        passwordField.setError(true);
                    }
                }
            } finally {
                createBtn.setEnabled(true);
                createBtn.setText("Create Account");
            }
        });
    }

    public void requestInitialFocus() {
        SwingUtilities.invokeLater(() -> nameField.requestFocusInWindow());
    }

    public void clearForm() {
        nameField.setText("");
        usernameField.setText("");
        emailField.setText("");
        passwordField.setText("");
        confirmPasswordField.setText("");
        collegeField.setText("Sanjivani University");
        branchField.setText("AI & Data Science");
        yearCombo.setSelectedItem(3);
        nameField.setError(false);
        usernameField.setError(false);
        emailField.setError(false);
        passwordField.setError(false);
        confirmPasswordField.setError(false);
        errorLabel.setText(" ");
        if (passwordField.isPasswordVisible()) {
            passwordField.toggleVisibility();
        }
        if (confirmPasswordField.isPasswordVisible()) {
            confirmPasswordField.toggleVisibility();
        }
    }
}
