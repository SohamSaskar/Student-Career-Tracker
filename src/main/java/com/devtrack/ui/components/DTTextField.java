package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Custom DTTextField component matching DevTrack Warm Porcelain aesthetic.
 * Fixed 38px input height prevents BoxLayout vertical stretching defects.
 */
public class DTTextField extends JTextField {

    private String placeholder = "";
    private boolean isHovered = false;
    private boolean isFocused = false;
    private boolean isError = false;
    private boolean isSuccess = false;

    public DTTextField() {
        this("", 20);
    }

    public DTTextField(String text) {
        this(text, 20);
    }

    public DTTextField(int columns) {
        this("", columns);
    }

    public DTTextField(String text, int columns) {
        super(text, columns);

        setFont(DevTrackFonts.BODY);
        setForeground(DevTrackColors.TEXT_PRIMARY);
        setCaretColor(DevTrackColors.TEXT_PRIMARY);
        setSelectedTextColor(DevTrackColors.TEXT_ON_ACCENT);
        setSelectionColor(DevTrackColors.ACCENT_PRIMARY);
        setOpaque(false);
        setBorder(new EmptyBorder(8, 12, 8, 12));

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

        addFocusListener(new FocusAdapter() {
            @Override
            public void focusGained(FocusEvent e) {
                if (isEnabled()) {
                    isFocused = true;
                    repaint();
                }
            }

            @Override
            public void focusLost(FocusEvent e) {
                if (isEnabled()) {
                    isFocused = false;
                    repaint();
                }
            }
        });
    }

    public String getPlaceholder() { return placeholder; }
    public void setPlaceholder(String placeholder) {
        this.placeholder = placeholder;
        repaint();
    }

    public boolean isError() { return isError; }
    public void setError(boolean error) {
        this.isError = error;
        repaint();
    }

    public boolean isSuccess() { return isSuccess; }
    public void setSuccess(boolean success) {
        this.isSuccess = success;
        repaint();
    }

    @Override
    public Dimension getPreferredSize() {
        Dimension d = super.getPreferredSize();
        return new Dimension(Math.max(d.width, 140), 38);
    }

    @Override
    public Dimension getMaximumSize() {
        return new Dimension(Integer.MAX_VALUE, 38);
    }

    @Override
    public Dimension getMinimumSize() {
        return new Dimension(100, 38);
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int width = getWidth();
        int height = getHeight();
        int radius = DevTrackColors.RADIUS_INPUT;

        // Background Color - Warm Input Fill #EFEBE3
        Color bg = !isEnabled() ? new Color(243, 240, 234) : (isFocused ? new Color(255, 255, 255) : new Color(239, 235, 227));
        g2.setColor(bg);
        g2.fillRoundRect(0, 0, width, height, radius * 2, radius * 2);

        // Border Color - #E4DED2 default, #D8CFC0 hover, #8B3A2B focus
        Color border;
        if (!isEnabled()) {
            border = DevTrackColors.BORDER_SUBTLE;
        } else if (isError) {
            border = DevTrackColors.ERROR_MAIN;
        } else if (isSuccess) {
            border = DevTrackColors.SUCCESS_MAIN;
        } else if (isFocused) {
            border = new Color(139, 58, 43); // Rust focus
        } else if (isHovered) {
            border = new Color(216, 207, 192); // Hover border
        } else {
            border = new Color(228, 222, 210); // Default border #E4DED2
        }

        g2.setColor(border);
        g2.setStroke(new BasicStroke(isFocused ? 1.8f : 1.5f));
        g2.drawRoundRect(0, 0, width - 1, height - 1, radius * 2, radius * 2);

        super.paintComponent(g);

        // Paint Placeholder if empty and not focused
        if (getText().isEmpty() && placeholder != null && !placeholder.isEmpty()) {
            g2.setColor(DevTrackColors.TEXT_MUTED);
            g2.setFont(getFont());
            FontMetrics fm = g2.getFontMetrics();
            int padding = getInsets().left;
            if (getLayout() instanceof BorderLayout) {
                Component westComp = ((BorderLayout) getLayout()).getLayoutComponent(BorderLayout.WEST);
                if (westComp != null && westComp.isVisible()) {
                    padding += westComp.getPreferredSize().width;
                }
            }
            int textY = (height + fm.getAscent() - fm.getDescent()) / 2;
            g2.drawString(placeholder, padding, textY);
        }

        g2.dispose();
    }
}
