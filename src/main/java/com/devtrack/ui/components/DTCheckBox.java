package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Custom DTCheckBox component matching Nordic Technical Dark aesthetic.
 */
public class DTCheckBox extends JCheckBox {

    private boolean isHovered = false;

    public DTCheckBox(String text) {
        this(text, false);
    }

    public DTCheckBox(String text, boolean selected) {
        super(text, selected);
        setFont(DevTrackFonts.BODY);
        setForeground(DevTrackColors.TEXT_PRIMARY);
        setOpaque(false);
        setFocusPainted(false);
        setCursor(new Cursor(Cursor.HAND_CURSOR));
        setBorder(new EmptyBorder(4, 4, 4, 4));

        setIcon(new CheckBoxIcon(false));
        setSelectedIcon(new CheckBoxIcon(true));

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
                    repaint();
                }
            }
        });
    }

    private class CheckBoxIcon implements Icon {
        private final boolean checked;

        public CheckBoxIcon(boolean checked) {
            this.checked = checked;
        }

        @Override
        public void paintIcon(Component c, Graphics g, int x, int y) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            int size = 18;
            int radius = DevTrackColors.RADIUS_BADGE;

            if (!isEnabled()) {
                g2.setColor(DevTrackColors.BG_ELEVATED);
                g2.fillRoundRect(x, y, size, size, radius, radius);
                g2.setColor(DevTrackColors.BORDER_SUBTLE);
                g2.drawRoundRect(x, y, size - 1, size - 1, radius, radius);
            } else if (checked) {
                g2.setColor(DevTrackColors.ACCENT_PRIMARY);
                g2.fillRoundRect(x, y, size, size, radius, radius);

                // Vector Checkmark
                g2.setColor(DevTrackColors.TEXT_ON_ACCENT);
                g2.setStroke(new BasicStroke(2.0f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
                g2.drawLine(x + 4, y + 9, x + 8, y + 13);
                g2.drawLine(x + 8, y + 13, x + 14, y + 5);
            } else {
                g2.setColor(DevTrackColors.BG_INTERACTIVE);
                g2.fillRoundRect(x, y, size, size, radius, radius);

                g2.setColor(isHovered ? DevTrackColors.BORDER_FOCUS : DevTrackColors.BORDER_DEFAULT);
                g2.setStroke(new BasicStroke(1.2f));
                g2.drawRoundRect(x, y, size - 1, size - 1, radius, radius);
            }

            g2.dispose();
        }

        @Override
        public int getIconWidth() { return 18; }

        @Override
        public int getIconHeight() { return 18; }
    }
}
