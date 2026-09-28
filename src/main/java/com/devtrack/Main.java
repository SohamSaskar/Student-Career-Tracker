package com.devtrack;

import com.devtrack.service.OnboardingService;
import com.devtrack.ui.AuthFrame;
import com.devtrack.ui.DevTrackFrame;
import com.devtrack.ui.OnboardingFrame;
import com.devtrack.util.SessionManager;

import com.devtrack.ui.theme.DevTrackUI;

import javax.swing.SwingUtilities;

/**
 * DevTrack Application Main Entry Point.
 * Controls authentication lifecycle, post-login onboarding check, and main application routing.
 */
public class Main {

    private static AuthFrame authFrame;
    private static OnboardingFrame onboardingFrame;
    private static DevTrackFrame devTrackFrame;
    private static final OnboardingService onboardingService = new OnboardingService();

    public static void main(String[] args) {
        System.out.println("==========================================");
        System.out.println(" DevTrack - Skill & Opportunity Platform ");
        System.out.println(" Starting Java Swing Application...       ");
        System.out.println("==========================================");

        DevTrackUI.install();

        SwingUtilities.invokeLater(() -> launchAuthFlow());
    }

    private static void launchAuthFlow() {
        disposeAllFrames();

        authFrame = new AuthFrame(() -> onAuthSuccess());
        authFrame.setVisible(true);
    }

    private static void onAuthSuccess() {
        if (authFrame != null) {
            authFrame.dispose();
            authFrame = null;
        }

        int currentStudentId = SessionManager.getInstance().getCurrentStudentId();

        // Check if student has completed onboarding
        boolean onboarded = onboardingService.isOnboarded(currentStudentId);

        if (onboarded) {
            launchMainApp();
        } else {
            launchOnboardingFlow();
        }
    }

    private static void launchOnboardingFlow() {
        disposeAllFrames();

        onboardingFrame = new OnboardingFrame(() -> onOnboardingComplete());
        onboardingFrame.setVisible(true);
    }

    private static void onOnboardingComplete() {
        if (onboardingFrame != null) {
            onboardingFrame.dispose();
            onboardingFrame = null;
        }

        launchMainApp();
    }

    private static void launchMainApp() {
        disposeAllFrames();

        devTrackFrame = new DevTrackFrame(() -> onLogout());
        devTrackFrame.refreshAllScreens();
        devTrackFrame.setVisible(true);
    }

    private static void onLogout() {
        SessionManager.getInstance().logout();
        SwingUtilities.invokeLater(() -> launchAuthFlow());
    }

    private static void disposeAllFrames() {
        if (authFrame != null) {
            authFrame.dispose();
            authFrame = null;
        }
        if (onboardingFrame != null) {
            onboardingFrame.dispose();
            onboardingFrame = null;
        }
        if (devTrackFrame != null) {
            devTrackFrame.dispose();
            devTrackFrame = null;
        }
    }
}
