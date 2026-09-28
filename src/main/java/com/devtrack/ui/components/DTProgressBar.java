package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;

import javax.swing.*;
import java.awt.*;

/**
 * Custom DTProgressBar component with smooth fill animation and 4px radius.
 */
public class DTProgressBar extends JComponent {

    private double targetProgress = 0.0; // 0.0 to 1.0
    private double currentProgress = 0.0;
    private final Timer animTimer;

    public DTProgressBar() {
        this(0.0);
    }

    public DTProgressBar(double initialProgress) {
        this.targetProgress = Math.max(0.0, Math.min(1.0, initialProgress));
        this.currentProgress = 0.0;

        setPreferredSize(new Dimension(200, 10));
        setMinimumSize(new Dimension(100, 10));

        animTimer = new Timer(15, e -> {
            double diff = targetProgress - currentProgress;
            if (Math.abs(diff) <= 0.005) {
                currentProgress = targetProgress;
                ((Timer) e.getSource()).stop();
            } else {
                currentProgress += diff * 0.25;
            }
            repaint();
        });
    }

    public void setProgress(double progress) {
        this.targetProgress = Math.max(0.0, Math.min(1.0, progress));
        if (animTimer.isRunning()) animTimer.stop();
        animTimer.start();
    }

    public void startAnimation() {
        this.currentProgress = 0.0;
        if (animTimer.isRunning()) animTimer.stop();
        animTimer.start();
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int width = getWidth();
        int height = getHeight();
        int radius = DevTrackColors.RADIUS_INPUT;

        // Track Background
        g2.setColor(DevTrackColors.BG_INTERACTIVE);
        g2.fillRoundRect(0, 0, width, height, radius * 2, radius * 2);

        // Fill Bar
        int fillWidth = (int) Math.round(width * currentProgress);
        if (fillWidth > 0) {
            g2.setColor(DevTrackColors.ACCENT_PRIMARY);
            g2.fillRoundRect(0, 0, fillWidth, height, radius * 2, radius * 2);
        }

        // Track Border
        g2.setColor(DevTrackColors.BORDER_DEFAULT);
        g2.setStroke(new BasicStroke(1.0f));
        g2.drawRoundRect(0, 0, width - 1, height - 1, radius * 2, radius * 2);

        g2.dispose();
    }
}
