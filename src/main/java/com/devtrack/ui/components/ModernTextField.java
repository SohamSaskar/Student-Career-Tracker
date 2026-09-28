package com.devtrack.ui.components;

import com.devtrack.ui.Theme;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;

/**
 * Reusable Text Input Field with focus border transitions.
 */
public class ModernTextField extends JTextField {

    private boolean isFocused = false;

    public ModernTextField(String placeholder) {
        super(placeholder);
        setFont(Theme.FONT_BODY);
        setForeground(Theme.PRIMARY_DARK);
        setBackground(Theme.LIGHT_SURFACE);
        setOpaque(false);
        setBorder(new EmptyBorder(8, 12, 8, 12));

        addFocusListener(new FocusAdapter() {
            @Override
            public void focusGained(FocusEvent e) {
                isFocused = true;
                repaint();
            }

            @Override
            public void focusLost(FocusEvent e) {
                isFocused = false;
                repaint();
            }
        });
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();

        // Background
        g2.setColor(Theme.LIGHT_SURFACE);
        g2.fillRoundRect(1, 1, w - 2, h - 2, 6, 6);

        // Border
        g2.setColor(isFocused ? Theme.ACCENT_PRIMARY : Theme.BORDER_COLOR);
        g2.setStroke(new BasicStroke(isFocused ? 1.5f : 1.0f));
        g2.drawRoundRect(1, 1, w - 3, h - 3, 6, 6);

        g2.dispose();
        super.paintComponent(g);
    }
}
