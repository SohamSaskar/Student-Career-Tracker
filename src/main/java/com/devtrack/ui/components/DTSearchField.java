package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Custom DTSearchField component with anti-aliased vector search icon and clear button.
 * Eliminates missing font glyph boxes ([?]) across operating systems and Swing look-and-feels.
 */
public class DTSearchField extends DTTextField {

    public DTSearchField() {
        this("Search certifications...");
    }

    public DTSearchField(String placeholder) {
        super();
        setPlaceholder(placeholder);
        setBorder(new EmptyBorder(8, 8, 8, 8));

        setLayout(new BorderLayout());

        // Vector Search Icon (Left)
        JLabel searchIconLabel = new JLabel(new Icon() {
            @Override
            public void paintIcon(Component c, Graphics g, int x, int y) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(DevTrackColors.TEXT_MUTED);
                g2.setStroke(new BasicStroke(1.8f));

                // Magnifying Glass Circle
                int cx = x + 2;
                int cy = y + 2;
                int r = 9;
                g2.drawOval(cx, cy, r, r);

                // Handle
                g2.drawLine(cx + 7, cy + 7, cx + 13, cy + 13);
                g2.dispose();
            }

            @Override
            public int getIconWidth() { return 16; }

            @Override
            public int getIconHeight() { return 16; }
        });
        searchIconLabel.setBorder(new EmptyBorder(0, 10, 0, 0));

        // Vector Clear Button (Right)
        JLabel clearBtnLabel = new JLabel(new Icon() {
            @Override
            public void paintIcon(Component c, Graphics g, int x, int y) {
                if (getText().isEmpty()) return;
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(DevTrackColors.TEXT_MUTED);
                g2.setStroke(new BasicStroke(1.6f));

                g2.drawLine(x + 2, y + 2, x + 10, y + 10);
                g2.drawLine(x + 10, y + 2, x + 2, y + 10);
                g2.dispose();
            }

            @Override
            public int getIconWidth() { return 12; }

            @Override
            public int getIconHeight() { return 12; }
        });
        clearBtnLabel.setCursor(new Cursor(Cursor.HAND_CURSOR));
        clearBtnLabel.setBorder(new EmptyBorder(0, 0, 0, 10));
        clearBtnLabel.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                setText("");
                requestFocusInWindow();
            }
        });

        add(searchIconLabel, BorderLayout.WEST);
        add(clearBtnLabel, BorderLayout.EAST);
    }
}
