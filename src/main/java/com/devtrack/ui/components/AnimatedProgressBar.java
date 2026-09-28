package com.devtrack.ui.components;

import com.devtrack.ui.Theme;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * Reusable Progress Bar Component with smooth load animation and dark orange fill.
 */
public class AnimatedProgressBar extends JComponent {

    private final double targetProgress; // e.g. 0.68 for 68%
    private double currentProgress = 0.0;
    private final Timer animationTimer;

    public AnimatedProgressBar(double targetProgress) {
        this.targetProgress = targetProgress;
        setPreferredSize(new Dimension(300, 10));
        setMinimumSize(new Dimension(100, 10));

        // Smooth 60 FPS animation timer
        animationTimer = new Timer(16, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                if (currentProgress < targetProgress) {
                    currentProgress += (targetProgress - currentProgress) * 0.08 + 0.002;
                    if (currentProgress >= targetProgress) {
                        currentProgress = targetProgress;
                        animationTimer.stop();
                    }
                    repaint();
                }
            }
        });
    }

    public void startAnimation() {
        currentProgress = 0.0;
        animationTimer.start();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int width = getWidth();
        int height = getHeight();

        // Light track background
        g2.setColor(Theme.BORDER_COLOR);
        g2.fillRoundRect(0, 0, width, height, height, height);

        // Active progress fill (Dark Orange)
        int progressWidth = (int) Math.round(width * currentProgress);
        progressWidth = Math.max(0, Math.min(width, progressWidth));

        if (progressWidth > 0) {
            g2.setColor(Theme.ACCENT_PRIMARY);
            g2.fillRoundRect(0, 0, progressWidth, height, height, height);
        }

        g2.dispose();
    }
}
