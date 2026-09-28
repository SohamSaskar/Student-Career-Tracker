package com.devtrack.ui.screens;

import com.devtrack.service.AuthService;
import com.devtrack.service.AuthService.AuthResult;
import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.components.DTCard;
import com.devtrack.ui.components.DTPasswordField;
import com.devtrack.ui.components.DTTextField;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Login Screen View (Light / Slate Professional Specification).
 * Matches exact spec:
 * - Background: #FAFAFA
 * - Auth card: #FFFFFF surface, 1px #E1E3E6 border, subtle shadow
 * - "DEVTRACK" wordmark: #1A1D21, letter-spaced
 * - "Welcome back": #52585F
 * - Labels: #52585F
 * - Input fields: #F1F2F4 fill, #E1E3E6 border, focus -> #2A4C78 ring
 * - Sign In button: #1E3A5F fill, #FFFFFF text -> hover #2A4C78 -> active #142A45
 * - "Don't have an account?": #8A8F96
 * - "Create account" link: #1E3A5F, underline on hover
 */
public class LoginScreen extends JPanel {

    public interface OnLoginSuccessListener {
        void onLoginSuccess();
    }

    public interface OnSwitchToSignupListener {
        void onSwitchToLogin();
    }

    private final OnLoginSuccessListener loginSuccessListener;
    private final OnSwitchToSignupListener switchToSignupListener;
    private final AuthService authService;

    private final DTTextField usernameField;
    private final DTPasswordField passwordField;
    private final DTButton signInBtn;
    private final JLabel errorLabel;

    private static final int FORM_WIDTH = 380;
    private static final int FIELD_HEIGHT = 44;

    public LoginScreen(OnLoginSuccessListener loginSuccessListener, OnSwitchToSignupListener switchToSignupListener) {
        this.loginSuccessListener = loginSuccessListener;
        this.switchToSignupListener = switchToSignupListener;
        this.authService = new AuthService();

        setLayout(new GridBagLayout());
        setBackground(DevTrackColors.BG_APP); // #FAFAFA

        // Center Card Panel (440px Fixed Width, #FFFFFF Surface)
        DTCard card = new DTCard();
        card.setLayout(new BoxLayout(card, BoxLayout.Y_AXIS));
        card.setBorder(new EmptyBorder(32, 30, 32, 30));
        card.setPreferredSize(new Dimension(440, 520));
        card.setMaximumSize(new Dimension(440, 520));
        card.setMinimumSize(new Dimension(440, 520));

        // 1. Header & Identity
        JLabel wordmark = new JLabel("D E V T R A C K");
        wordmark.setFont(new Font(DevTrackFonts.FONT_FAMILY, Font.BOLD, 22));
        wordmark.setForeground(DevTrackColors.TEXT_PRIMARY); // #1A1D21
        wordmark.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel brandSub = new JLabel("Student Career Readiness Platform");
        brandSub.setFont(DevTrackFonts.CAPTION);
        brandSub.setForeground(DevTrackColors.TEXT_MUTED); // #8A8F96
        brandSub.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel subtitle = new JLabel("Welcome back");
        subtitle.setFont(DevTrackFonts.PAGE_TITLE);
        subtitle.setForeground(DevTrackColors.TEXT_SECONDARY); // #52585F
        subtitle.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel tag = new JLabel("Sign in to continue your progress.");
        tag.setFont(DevTrackFonts.SECONDARY);
        tag.setForeground(DevTrackColors.TEXT_MUTED); // #8A8F96
        tag.setAlignmentX(Component.CENTER_ALIGNMENT);

        card.add(wordmark);
        card.add(Box.createVerticalStrut(2));
        card.add(brandSub);
        card.add(Box.createVerticalStrut(14));
        card.add(subtitle);
        card.add(Box.createVerticalStrut(4));
        card.add(tag);
        card.add(Box.createVerticalStrut(16));

        // 2. Fixed-Height Error Area
        JPanel errorPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 0));
        errorPanel.setOpaque(false);
        errorPanel.setPreferredSize(new Dimension(FORM_WIDTH, 22));
        errorPanel.setMaximumSize(new Dimension(FORM_WIDTH, 22));
        errorPanel.setAlignmentX(Component.CENTER_ALIGNMENT);

        errorLabel = new JLabel(" ");
        errorLabel.setFont(DevTrackFonts.CAPTION);
        errorLabel.setForeground(DevTrackColors.ERROR_TEXT); // #B3261E
        errorPanel.add(errorLabel);

        card.add(errorPanel);
        card.add(Box.createVerticalStrut(8));

        // 3. Username Field Group
        usernameField = new DTTextField();
        usernameField.setPlaceholder("Your username");
        usernameField.addActionListener(e -> performLogin());
        JPanel usernameGroup = createFieldGroup("Username", usernameField);
        usernameGroup.setAlignmentX(Component.CENTER_ALIGNMENT);
        card.add(usernameGroup);
        card.add(Box.createVerticalStrut(14));

        // 4. Password Field Group
        passwordField = new DTPasswordField();
        passwordField.addActionListener(e -> performLogin());
        JPanel passwordGroup = createFieldGroup("Password", passwordField);
        passwordGroup.setAlignmentX(Component.CENTER_ALIGNMENT);
        card.add(passwordGroup);
        card.add(Box.createVerticalStrut(22));

        // 5. Sign In Button (#1E3A5F fill, #FFFFFF text -> hover #2A4C78 -> active #142A45)
        signInBtn = new DTButton("Sign In", DTButton.ButtonType.PRIMARY);
        signInBtn.setFont(DevTrackFonts.BUTTON);
        signInBtn.setAlignmentX(Component.CENTER_ALIGNMENT);
        signInBtn.setPreferredSize(new Dimension(FORM_WIDTH, FIELD_HEIGHT));
        signInBtn.setMaximumSize(new Dimension(FORM_WIDTH, FIELD_HEIGHT));
        signInBtn.setMinimumSize(new Dimension(FORM_WIDTH, FIELD_HEIGHT));
        signInBtn.addActionListener(e -> performLogin());
        card.add(signInBtn);
        card.add(Box.createVerticalStrut(20));

        // 6. Signup Switch Link ("Don't have an account?": #8A8F96, "Create account": #1E3A5F underline on hover)
        JPanel switchPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 4, 0));
        switchPanel.setOpaque(false);
        switchPanel.setPreferredSize(new Dimension(FORM_WIDTH, 24));
        switchPanel.setMaximumSize(new Dimension(FORM_WIDTH, 24));

        JLabel promptLabel = new JLabel("Don't have an account?");
        promptLabel.setFont(DevTrackFonts.BODY);
        promptLabel.setForeground(DevTrackColors.TEXT_MUTED); // #8A8F96

        JLabel signupLink = new JLabel("Create account");
        signupLink.setFont(DevTrackFonts.FORM_LABEL);
        signupLink.setForeground(DevTrackColors.ACCENT_PRIMARY); // #1E3A5F
        signupLink.setCursor(new Cursor(Cursor.HAND_CURSOR));
        signupLink.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                signupLink.setText("<html><u>Create account</u></html>");
            }

            @Override
            public void mouseExited(MouseEvent e) {
                signupLink.setText("Create account");
            }

            @Override
            public void mouseClicked(MouseEvent e) {
                if (switchToSignupListener != null) {
                    clearForm();
                    switchToSignupListener.onSwitchToLogin();
                }
            }
        });

        switchPanel.add(promptLabel);
        switchPanel.add(signupLink);
        switchPanel.setAlignmentX(Component.CENTER_ALIGNMENT);
        card.add(switchPanel);

        add(card);
    }

    private JPanel createFieldGroup(String labelText, JComponent field) {
        JPanel group = new JPanel();
        group.setLayout(new BoxLayout(group, BoxLayout.Y_AXIS));
        group.setOpaque(false);
        group.setPreferredSize(new Dimension(FORM_WIDTH, 72));
        group.setMaximumSize(new Dimension(FORM_WIDTH, 72));
        group.setMinimumSize(new Dimension(FORM_WIDTH, 72));

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

    public void performLogin() {
        String username = usernameField.getText() != null ? usernameField.getText().trim() : "";
        String password = new String(passwordField.getPassword());

        if (username.isEmpty()) {
            errorLabel.setText("Username is required.");
            usernameField.setError(true);
            passwordField.setError(false);
            usernameField.requestFocusInWindow();
            return;
        }

        if (password.isEmpty()) {
            errorLabel.setText("Password is required.");
            usernameField.setError(false);
            passwordField.setError(true);
            passwordField.requestFocusInWindow();
            return;
        }

        signInBtn.setEnabled(false);
        signInBtn.setText("Signing in...");

        SwingUtilities.invokeLater(() -> {
            try {
                AuthResult result = authService.login(username, password);

                if (result.isSuccess()) {
                    errorLabel.setText(" ");
                    usernameField.setError(false);
                    passwordField.setError(false);
                    if (loginSuccessListener != null) {
                        loginSuccessListener.onLoginSuccess();
                    }
                } else {
                    errorLabel.setText(result.getMessage());
                    usernameField.setError(true);
                    passwordField.setError(true);
                }
            } finally {
                signInBtn.setEnabled(true);
                signInBtn.setText("Sign In");
            }
        });
    }

    public void requestInitialFocus() {
        SwingUtilities.invokeLater(() -> usernameField.requestFocusInWindow());
    }

    public void clearForm() {
        usernameField.setText("");
        passwordField.setText("");
        usernameField.setError(false);
        passwordField.setError(false);
        errorLabel.setText(" ");
        if (passwordField.isPasswordVisible()) {
            passwordField.toggleVisibility();
        }
    }

    public DTTextField getUsernameField() {
        return usernameField;
    }

    public DTTextField getEmailField() {
        return usernameField;
    }
}
