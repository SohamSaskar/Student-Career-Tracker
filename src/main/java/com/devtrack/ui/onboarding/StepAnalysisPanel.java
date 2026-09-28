package com.devtrack.ui.onboarding;

import com.devtrack.model.Skill;
import com.devtrack.service.OnboardingService;
import com.devtrack.service.OnboardingService.AnalysisResult;
import com.devtrack.ui.components.DTBadge;
import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.components.DTCard;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.List;

/**
 * Onboarding Step 4: Database-Driven DevTrack Analysis Result Panel (Nordic Technical Dark).
 */
public class StepAnalysisPanel extends JPanel {

    public interface OnFinishOnboardingListener {
        void onFinishOnboarding();
    }

    private final OnFinishOnboardingListener finishListener;
    private final OnboardingService onboardingService;
    private final JPanel analysisContainer;

    public StepAnalysisPanel(OnFinishOnboardingListener finishListener) {
        this.finishListener = finishListener;
        this.onboardingService = new OnboardingService();

        setLayout(new BorderLayout());
        setOpaque(false);
        setBorder(new EmptyBorder(16, 24, 16, 24));

        analysisContainer = new JPanel();
        analysisContainer.setLayout(new BoxLayout(analysisContainer, BoxLayout.Y_AXIS));
        analysisContainer.setOpaque(false);
        analysisContainer.setBorder(new EmptyBorder(12, 16, 16, 16));

        JScrollPane scrollPane = new JScrollPane(analysisContainer);
        scrollPane.setBorder(null);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.getVerticalScrollBar().setUnitIncrement(24);

        add(scrollPane, BorderLayout.CENTER);

        // Footer Action
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 0));
        footer.setOpaque(false);
        footer.setBorder(new EmptyBorder(16, 0, 0, 0));

        DTButton finishBtn = new DTButton("CONTINUE TO DASHBOARD →", DTButton.ButtonType.PRIMARY);
        finishBtn.setPreferredSize(new Dimension(260, 44));
        finishBtn.addActionListener(e -> {
            if (finishListener != null) {
                finishListener.onFinishOnboarding();
            }
        });
        footer.add(finishBtn);

        add(footer, BorderLayout.SOUTH);

        refreshAnalysis();
    }

    public void refreshAnalysis() {
        analysisContainer.removeAll();

        int currentStudentId = SessionManager.getInstance().getCurrentStudentId();
        AnalysisResult analysis = onboardingService.calculateAnalysis(currentStudentId);

        // 1. Header Card
        DTCard headerCard = new DTCard();
        headerCard.setLayout(new BoxLayout(headerCard, BoxLayout.Y_AXIS));

        JLabel title = new JLabel("YOUR DEVTRACK ANALYSIS");
        title.setFont(DevTrackFonts.PAGE_TITLE);
        title.setForeground(DevTrackColors.TEXT_PRIMARY);
        title.setAlignmentX(Component.LEFT_ALIGNMENT);

        JLabel sub = new JLabel("Target Goal: " + analysis.getRoleName());
        sub.setFont(DevTrackFonts.SECTION_TITLE);
        sub.setForeground(DevTrackColors.ACCENT_PRIMARY);
        sub.setAlignmentX(Component.LEFT_ALIGNMENT);

        headerCard.add(title);
        headerCard.add(Box.createVerticalStrut(4));
        headerCard.add(sub);

        analysisContainer.add(headerCard);
        analysisContainer.add(Box.createVerticalStrut(16));

        // 2. Readiness & Breakdown Grid
        JPanel metricsGrid = new JPanel(new GridLayout(1, 2, 16, 0));
        metricsGrid.setOpaque(false);

        // Left Metric Card (Readiness Score)
        DTCard scoreCard = new DTCard();
        scoreCard.setLayout(new BoxLayout(scoreCard, BoxLayout.Y_AXIS));

        JLabel scoreTitle = new JLabel("CAREER READINESS");
        scoreTitle.setFont(DevTrackFonts.CAPTION);
        scoreTitle.setForeground(DevTrackColors.TEXT_MUTED);

        JLabel scoreVal = new JLabel(analysis.getReadinessPercentage() + "%");
        scoreVal.setFont(DevTrackFonts.METRIC);
        scoreVal.setForeground(DevTrackColors.SUCCESS_TEXT);

        scoreCard.add(scoreTitle);
        scoreCard.add(Box.createVerticalStrut(6));
        scoreCard.add(scoreVal);

        // Right Metric Card (Skill Counts)
        DTCard countsCard = new DTCard();
        countsCard.setLayout(new GridLayout(3, 2, 8, 6));

        countsCard.add(createMetricLabel("Completed Skills:"));
        countsCard.add(createMetricVal(String.valueOf(analysis.getCompletedCount()), DevTrackColors.SUCCESS_TEXT));

        countsCard.add(createMetricLabel("Learning Skills:"));
        countsCard.add(createMetricVal(String.valueOf(analysis.getLearningCount()), DevTrackColors.WARNING_TEXT));

        countsCard.add(createMetricLabel("Missing Skill Gaps:"));
        countsCard.add(createMetricVal(String.valueOf(analysis.getMissingCount()), DevTrackColors.ERROR_TEXT));

        metricsGrid.add(scoreCard);
        metricsGrid.add(countsCard);

        analysisContainer.add(metricsGrid);
        analysisContainer.add(Box.createVerticalStrut(16));

        // 3. Priority Skill Gaps Section
        DTCard gapsCard = new DTCard();
        gapsCard.setLayout(new BorderLayout());

        JLabel gapTitle = new JLabel("PRIORITY SKILL GAPS FOR " + analysis.getRoleName().toUpperCase());
        gapTitle.setFont(DevTrackFonts.SECTION_TITLE);
        gapTitle.setForeground(DevTrackColors.TEXT_PRIMARY);
        gapTitle.setBorder(new EmptyBorder(0, 0, 12, 0));

        gapsCard.add(gapTitle, BorderLayout.NORTH);

        List<Skill> gaps = analysis.getPriorityGaps();
        if (gaps.isEmpty()) {
            JLabel noGaps = new JLabel("Awesome! You possess all required skills for this career goal.");
            noGaps.setFont(DevTrackFonts.BODY);
            noGaps.setForeground(DevTrackColors.SUCCESS_TEXT);
            gapsCard.add(noGaps, BorderLayout.CENTER);
        } else {
            JPanel gapsList = new JPanel();
            gapsList.setLayout(new BoxLayout(gapsList, BoxLayout.Y_AXIS));
            gapsList.setOpaque(false);

            for (Skill gap : gaps) {
                gapsList.add(createGapRow(gap));
                gapsList.add(Box.createVerticalStrut(8));
            }
            gapsCard.add(gapsList, BorderLayout.CENTER);
        }

        analysisContainer.add(gapsCard);

        analysisContainer.revalidate();
        analysisContainer.repaint();
    }

    private JPanel createGapRow(Skill skill) {
        JPanel row = new JPanel(new BorderLayout());
        row.setOpaque(false);
        row.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 1, 0, DevTrackColors.BORDER_SUBTLE),
                new EmptyBorder(6, 4, 6, 4)
        ));

        JLabel name = new JLabel(skill.getSkillName() + " (" + skill.getCategory() + ")");
        name.setFont(DevTrackFonts.CARD_TITLE);
        name.setForeground(DevTrackColors.TEXT_PRIMARY);

        JPanel rightGroup = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0));
        rightGroup.setOpaque(false);

        JLabel impLabel = new JLabel("Priority: " + skill.getImportance());
        impLabel.setFont(DevTrackFonts.CAPTION);
        impLabel.setForeground(DevTrackColors.TEXT_MUTED);

        DTBadge badge = new DTBadge(skill.getStatus());

        rightGroup.add(impLabel);
        rightGroup.add(badge);

        row.add(name, BorderLayout.WEST);
        row.add(rightGroup, BorderLayout.EAST);
        return row;
    }

    private JLabel createMetricLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(DevTrackFonts.BODY);
        lbl.setForeground(DevTrackColors.TEXT_SECONDARY);
        return lbl;
    }

    private JLabel createMetricVal(String val, Color color) {
        JLabel lbl = new JLabel(val);
        lbl.setFont(DevTrackFonts.FORM_LABEL);
        lbl.setForeground(color);
        return lbl;
    }
}
