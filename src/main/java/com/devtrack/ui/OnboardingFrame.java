package com.devtrack.ui;

import com.devtrack.ui.onboarding.*;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import java.awt.*;

/**
 * Multi-Step Onboarding Window Frame (Nordic Technical Dark).
 * Displays step progress indicator header and routes student through Profile, Goal, Skills, and Analysis.
 */
public class OnboardingFrame extends JFrame {

    public interface OnOnboardingCompleteListener {
        void onOnboardingComplete();
    }

    private final OnOnboardingCompleteListener onboardingCompleteListener;

    private int currentStep = 1; // 1 to 4
    private final CardLayout cardLayout;
    private final JPanel cardsPanel;
    private final JPanel progressHeader;

    private final StepProfilePanel profilePanel;
    private final StepGoalPanel goalPanel;
    private final StepSkillsPanel skillsPanel;
    private final StepAnalysisPanel analysisPanel;

    public OnboardingFrame(OnOnboardingCompleteListener onboardingCompleteListener) {
        super("DevTrack — Student Onboarding & Initial Analysis");
        this.onboardingCompleteListener = onboardingCompleteListener;

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1100, 780);
        setMinimumSize(new Dimension(940, 640));
        setLocationRelativeTo(null);
        getContentPane().setBackground(DevTrackColors.BG_APP);

        JPanel mainContainer = new JPanel(new BorderLayout());
        mainContainer.setBackground(DevTrackColors.BG_APP);

        // Progress Header
        progressHeader = createProgressHeader();
        mainContainer.add(progressHeader, BorderLayout.NORTH);

        // Card Panel Router
        cardLayout = new CardLayout();
        cardsPanel = new JPanel(cardLayout);
        cardsPanel.setOpaque(false);

        // Instantiate Steps
        profilePanel = new StepProfilePanel(() -> goToStep(2));
        goalPanel = new StepGoalPanel(new StepGoalPanel.OnStepNavigationListener() {
            @Override
            public void onNextStep() { goToStep(3); }
            @Override
            public void onPrevStep() { goToStep(1); }
        });
        skillsPanel = new StepSkillsPanel(new StepSkillsPanel.OnStepNavigationListener() {
            @Override
            public void onNextStep() {
                analysisPanel.refreshAnalysis();
                goToStep(4);
            }
            @Override
            public void onPrevStep() { goToStep(2); }
        });
        analysisPanel = new StepAnalysisPanel(() -> {
            if (onboardingCompleteListener != null) {
                onboardingCompleteListener.onOnboardingComplete();
            }
        });

        cardsPanel.add(profilePanel, "Step1");
        cardsPanel.add(goalPanel, "Step2");
        cardsPanel.add(skillsPanel, "Step3");
        cardsPanel.add(analysisPanel, "Step4");

        mainContainer.add(cardsPanel, BorderLayout.CENTER);
        add(mainContainer);

        goToStep(1);
    }

    public void goToStep(int step) {
        this.currentStep = step;
        cardLayout.show(cardsPanel, "Step" + step);
        refreshProgressHeader();
    }

    private JPanel createProgressHeader() {
        JPanel header = new JPanel(new FlowLayout(FlowLayout.CENTER, 36, 16));
        header.setBackground(DevTrackColors.BG_HEADER);
        header.setPreferredSize(new Dimension(1100, 60));
        header.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, DevTrackColors.BORDER_DEFAULT));
        return header;
    }

    private void refreshProgressHeader() {
        progressHeader.removeAll();

        String[] stepTitles = {"01 Profile", "02 Career Goal", "03 Skills", "04 Analysis"};

        for (int i = 0; i < stepTitles.length; i++) {
            int stepNum = i + 1;
            boolean isActive = (stepNum == currentStep);
            boolean isCompleted = (stepNum < currentStep);

            JLabel label = new JLabel(stepTitles[i]);
            label.setFont(isActive ? DevTrackFonts.NAV_ACTIVE : DevTrackFonts.NAVIGATION);

            if (isActive) {
                label.setForeground(DevTrackColors.TEXT_PRIMARY);
                label.setBorder(BorderFactory.createMatteBorder(0, 0, 2, 0, DevTrackColors.ACCENT_PRIMARY));
            } else if (isCompleted) {
                label.setForeground(DevTrackColors.SUCCESS_TEXT);
            } else {
                label.setForeground(DevTrackColors.TEXT_MUTED);
            }

            progressHeader.add(label);

            if (i < stepTitles.length - 1) {
                JLabel arrow = new JLabel("→");
                arrow.setFont(DevTrackFonts.CAPTION);
                arrow.setForeground(DevTrackColors.TEXT_MUTED);
                progressHeader.add(arrow);
            }
        }

        progressHeader.revalidate();
        progressHeader.repaint();
    }
}
