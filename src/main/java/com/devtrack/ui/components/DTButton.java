package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Custom DTButton component matching DevTrack Warm Porcelain aesthetic.
 * Strictly adheres to the project color system: Primary, Secondary/Cancel, GitHub, and Destructive.
 */
public class DTButton extends JButton {

    public enum ButtonType {
        PRIMARY,
        SECONDARY,
        GITHUB,
        DESTRUCTIVE,
        SUCCESS
    }

    private final ButtonType type;
    private boolean isHovered = false;
    private boolean isPressed = false;

    public DTButton(String text) {
        this(text, ButtonType.PRIMARY);
    }

    public DTButton(String text, boolean isPrimary) {
        this(text, isPrimary ? ButtonType.PRIMARY : ButtonType.SECONDARY);
    }

    public DTButton(String text, ButtonType type) {
        super(text);
        this.type = type;

        setFont(DevTrackFonts.BUTTON);
        setFocusPainted(false);
        setBorderPainted(false);
        setContentAreaFilled(false);
        setCursor(new Cursor(Cursor.HAND_CURSOR));
        setBorder(new EmptyBorder(8, 16, 8, 16));

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                if (isEnabled()) {
                    isHovered = true;
                    repaint();
                }
            }

            @Override
            public void mouseExited(MouseEvent e) {
                if (isEnabled()) {
                    isHovered = false;
                    isPressed = false;
                    repaint();
                }
            }

            @Override
            public void mousePressed(MouseEvent e) {
                if (isEnabled()) {
                    isPressed = true;
                    repaint();
                }
            }

            @Override
            public void mouseReleased(MouseEvent e) {
                if (isEnabled()) {
                    isPressed = false;
                    repaint();
                }
            }
        });
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        Color bg;
        Color fg;
        Color border;

        if (!isEnabled()) {
            bg = DevTrackColors.DISABLED_FILL;
            fg = DevTrackColors.DISABLED_TEXT;
            border = DevTrackColors.DISABLED_BORDER;
        } else {
            switch (type) {
                case GITHUB:
                case SECONDARY:
                    bg = isPressed ? new Color(207, 212, 220) : (isHovered ? new Color(220, 224, 230) : new Color(255, 255, 255));
                    fg = new Color(16, 19, 24); // #101318
                    border = isHovered ? new Color(216, 207, 192) : new Color(228, 222, 210); // #E4DED2
                    break;

                case DESTRUCTIVE:
                    bg = isPressed ? new Color(140, 29, 23) : (isHovered ? new Color(201, 59, 50) : new Color(179, 38, 30)); // #B3261E
                    fg = Color.WHITE;
                    border = bg;
                    break;

                case SUCCESS:
                    bg = isPressed ? new Color(11, 42, 30) : (isHovered ? new Color(28, 91, 65) : new Color(18, 61, 44)); // #123D2C
                    fg = Color.WHITE;
                    border = bg;
                    break;

                case PRIMARY:
                default:
                    bg = isPressed ? new Color(8, 18, 42) : (isHovered ? new Color(22, 41, 74) : new Color(13, 27, 51)); // #0D1B33
                    fg = Color.WHITE;
                    border = bg;
                    break;
            }
        }

        setForeground(fg);

        int width = getWidth();
        int height = getHeight();
        int radius = DevTrackColors.RADIUS_BUTTON;

        // Draw Background
        g2.setColor(bg);
        g2.fillRoundRect(1, 1, width - 2, height - 2, radius * 2, radius * 2);

        // Draw Clean 1px Border inside bounds
        g2.setColor(border);
        g2.setStroke(new BasicStroke(1.0f));
        g2.drawRoundRect(1, 1, width - 3, height - 3, radius * 2, radius * 2);

        // Draw Text
        g2.setColor(fg);
        g2.setFont(getFont());
        FontMetrics fm = g2.getFontMetrics();
        int textX = (width - fm.stringWidth(getText())) / 2;
        int textY = (height + fm.getAscent() - fm.getDescent()) / 2;
        if (isPressed) {
            textY += 1;
        }
        g2.drawString(getText(), textX, textY);

        g2.dispose();
    }
}
