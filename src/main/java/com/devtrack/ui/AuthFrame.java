package com.devtrack.ui;

import com.devtrack.ui.screens.LoginScreen;
import com.devtrack.ui.screens.SignupScreen;
import com.devtrack.ui.theme.DevTrackColors;

import javax.swing.*;
import java.awt.*;

/**
 * Authentication Frame managing switching between LoginScreen and SignupScreen.
 * (Nordic Technical Dark).
 */
public class AuthFrame extends JFrame {

    public interface OnAuthSuccessListener {
        void onAuthSuccess();
    }

    private final CardLayout cardLayout;
    private final JPanel cardsPanel;
    private final LoginScreen loginScreen;
    private final SignupScreen signupScreen;

    public AuthFrame(OnAuthSuccessListener authSuccessListener) {
        super("DevTrack — Authentication");

        // Anti-aliased font settings
        System.setProperty("awt.useSystemAAFontSettings", "on");
        System.setProperty("swing.aatext", "true");

        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            // Fallback to default
        }

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1040, 760);
        setMinimumSize(new Dimension(840, 640));
        setLocationRelativeTo(null);
        getContentPane().setBackground(DevTrackColors.BG_APP);

        cardLayout = new CardLayout();
        cardsPanel = new JPanel(cardLayout);
        cardsPanel.setOpaque(false);

        loginScreen = new LoginScreen(
            () -> {
                if (authSuccessListener != null) authSuccessListener.onAuthSuccess();
            },
            () -> showSignup()
        );

        signupScreen = new SignupScreen(
            () -> {
                if (authSuccessListener != null) authSuccessListener.onAuthSuccess();
            },
            () -> showLogin()
        );

        cardsPanel.add(loginScreen, "Login");
        cardsPanel.add(signupScreen, "Signup");

        add(cardsPanel);
        showLogin();
    }

    public void showLogin() {
        loginScreen.clearForm();
        cardLayout.show(cardsPanel, "Login");
        loginScreen.requestInitialFocus();
    }

    public void showSignup() {
        signupScreen.clearForm();
        cardLayout.show(cardsPanel, "Signup");
        signupScreen.requestInitialFocus();
    }

    public LoginScreen getLoginScreen() {
        return loginScreen;
    }

    public SignupScreen getSignupScreen() {
        return signupScreen;
    }
}
