package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Custom DTToggle component matching Nordic Technical Dark aesthetic with smooth transition.
 */
public class DTToggle extends JPanel {

    private boolean selected = false;
    private float handlePos = 0.0f; // 0.0 to 1.0
    private final Timer animTimer;
    private final String labelText;

    public DTToggle(String labelText, boolean initialSelected) {
        this.labelText = labelText;
        this.selected = initialSelected;
        this.handlePos = initialSelected ? 1.0f : 0.0f;

        setLayout(new BorderLayout(10, 0));
        setOpaque(false);
        setCursor(new Cursor(Cursor.HAND_CURSOR));
        setBorder(new EmptyBorder(4, 4, 4, 4));

        JLabel label = new JLabel(labelText);
        label.setFont(DevTrackFonts.BODY);
        label.setForeground(DevTrackColors.TEXT_PRIMARY);

        JComponent toggleGraphic = new JComponent() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                int width = 38;
                int height = 20;
                int y = (getHeight() - height) / 2;

                Color trackBg = blendColor(DevTrackColors.BG_INTERACTIVE, DevTrackColors.ACCENT_SUBTLE_BG, handlePos);
                Color trackBorder = blendColor(DevTrackColors.BORDER_DEFAULT, DevTrackColors.BORDER_FOCUS, handlePos);
                Color handleColor = blendColor(DevTrackColors.TEXT_SECONDARY, DevTrackColors.ACCENT_PRIMARY, handlePos);

                g2.setColor(trackBg);
                g2.fillRoundRect(0, y, width, height, height, height);

                g2.setColor(trackBorder);
                g2.setStroke(new BasicStroke(1.2f));
                g2.drawRoundRect(0, y, width - 1, height - 1, height, height);

                // Handle
                int handleSize = 14;
                int minX = 3;
                int maxX = width - handleSize - 3;
                int handleX = (int) (minX + (maxX - minX) * handlePos);
                int handleY = y + (height - handleSize) / 2;

                g2.setColor(handleColor);
                g2.fillOval(handleX, handleY, handleSize, handleSize);

                g2.dispose();
            }
        };
        toggleGraphic.setPreferredSize(new Dimension(42, 24));

        add(toggleGraphic, BorderLayout.WEST);
        add(label, BorderLayout.CENTER);

        animTimer = new Timer(15, e -> {
            float target = selected ? 1.0f : 0.0f;
            float diff = target - handlePos;
            if (Math.abs(diff) <= 0.08f) {
                handlePos = target;
                ((Timer) e.getSource()).stop();
            } else {
                handlePos += diff * 0.35f;
            }
            repaint();
        });

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                setSelected(!selected);
            }
        });
    }

    public boolean isSelected() { return selected; }

    public void setSelected(boolean selected) {
        this.selected = selected;
        if (animTimer.isRunning()) animTimer.stop();
        animTimer.start();
    }

    private Color blendColor(Color c1, Color c2, float ratio) {
        float r = c1.getRed() + (c2.getRed() - c1.getRed()) * ratio;
        float g = c1.getGreen() + (c2.getGreen() - c1.getGreen()) * ratio;
        float b = c1.getBlue() + (c2.getBlue() - c1.getBlue()) * ratio;
        return new Color((int) r, (int) g, (int) b);
    }
}
