package com.devtrack.ui.components;

import com.devtrack.ui.Theme;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Reusable Action Button with zero border clipping, clean margins, and hover transitions.
 */
public class ModernButton extends JButton {

    private final boolean isPrimary;
    private boolean isHovered = false;

    public ModernButton(String text, boolean isPrimary) {
        super(text);
        this.isPrimary = isPrimary;

        setFocusPainted(false);
        setBorderPainted(false);
        setContentAreaFilled(false);
        setFont(Theme.FONT_BODY_MEDIUM);
        setCursor(new Cursor(Cursor.HAND_CURSOR));
        setBorder(new EmptyBorder(8, 16, 8, 16));

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

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();

        if (isPrimary) {
            g2.setColor(isHovered ? Theme.ACCENT_HOVER : Theme.PRIMARY_DARK);
            g2.fillRoundRect(1, 1, w - 2, h - 2, 6, 6);
            setForeground(Theme.TEXT_LIGHT);
        } else {
            g2.setColor(isHovered ? Theme.LIGHT_SURFACE_HOVER : Theme.LIGHT_SURFACE);
            g2.fillRoundRect(1, 1, w - 3, h - 3, 6, 6);

            g2.setColor(isHovered ? Theme.PRIMARY_DARK : Theme.BORDER_COLOR);
            g2.setStroke(new BasicStroke(isHovered ? 1.5f : 1.0f));
            g2.drawRoundRect(1, 1, w - 3, h - 3, 6, 6);
            setForeground(Theme.PRIMARY_DARK);
        }

        super.paintComponent(g2);
        g2.dispose();
    }
}
