package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Custom DTCard component matching DevTrack Slate/Light aesthetic.
 * Features 1px crisp clean border (#E2E8F0), subtle surface fill, and soft ambient shadow.
 */
public class DTCard extends JPanel {

    private boolean isHoverable = false;
    private boolean isHovered = false;
    private boolean isSelected = false;

    public DTCard() {
        this(false);
    }

    public DTCard(boolean isHoverable) {
        this.isHoverable = isHoverable;
        setLayout(new BorderLayout());
        setOpaque(false);
        setBorder(new EmptyBorder(16, 18, 16, 18));

        if (isHoverable) {
            setCursor(new Cursor(Cursor.HAND_CURSOR));
            addMouseListener(new MouseAdapter() {
                @Override
                public void mouseEntered(MouseEvent e) {
                    isHovered = true;
                    repaint();
                }

                @Override
                public void mouseExited(MouseEvent e) {
                    isHovered = false;
                    repaint();
                }
            });
        }
    }

    public boolean isSelected() { return isSelected; }
    public void setSelected(boolean selected) {
        this.isSelected = selected;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int width = getWidth();
        int height = getHeight();
        int radius = DevTrackColors.RADIUS_CARD;

        Color bg;
        Color border;

        if (isSelected) {
            bg = DevTrackColors.ACCENT_SUBTLE_BG;
            border = DevTrackColors.ACCENT_PRIMARY;
        } else if (isHovered && isHoverable) {
            bg = DevTrackColors.TABLE_ROW_HOVER;
            border = DevTrackColors.BORDER_HOVER;
        } else {
            bg = DevTrackColors.BG_SURFACE;
            border = DevTrackColors.BORDER_DEFAULT; // Crisp clean 1px Slate border (#E2E8F0)
        }

        // Soft ambient card shadow
        g2.setColor(new Color(15, 23, 42, 12));
        g2.fillRoundRect(2, 4, width - 4, height - 5, radius * 2, radius * 2);

        // Card Fill (#FFFFFF)
        g2.setColor(bg);
        g2.fillRoundRect(1, 1, width - 3, height - 3, radius * 2, radius * 2);

        // Crisp 1.5px Near-Black Card Border (#252525)
        g2.setColor(border);
        g2.setStroke(new BasicStroke(isSelected ? 2.0f : 1.5f));
        g2.drawRoundRect(1, 1, width - 3, height - 3, radius * 2, radius * 2);

        g2.dispose();
        super.paintComponent(g);
    }
}
