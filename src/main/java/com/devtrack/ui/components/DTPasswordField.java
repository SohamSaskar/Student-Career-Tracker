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
import java.awt.geom.Path2D;

/**
 * Custom DTPasswordField component matching Nordic Technical Dark aesthetic
 * with vector Eye / Eye-Off icon visibility toggle.
 */
public class DTPasswordField extends JPasswordField {

    private boolean isHovered = false;
    private boolean isFocused = false;
    private boolean isError = false;
    private boolean isPasswordVisible = false;
    private final JButton toggleBtn;

    public DTPasswordField() {
        this(20);
    }

    public DTPasswordField(int columns) {
        super(columns);

        setFont(DevTrackFonts.BODY);
        setForeground(DevTrackColors.TEXT_PRIMARY);
        setCaretColor(DevTrackColors.TEXT_PRIMARY);
        setSelectedTextColor(DevTrackColors.TEXT_ON_ACCENT);
        setSelectionColor(DevTrackColors.ACCENT_PRIMARY);
        setOpaque(false);
        setBorder(new EmptyBorder(8, 10, 8, 36)); // Padding for right vector toggle button

        toggleBtn = new JButton();
        toggleBtn.setIcon(new EyeIcon(false));
        toggleBtn.setToolTipText("Show password");
        toggleBtn.setContentAreaFilled(false);
        toggleBtn.setBorderPainted(false);
        toggleBtn.setFocusPainted(false);
        toggleBtn.setMargin(new Insets(0, 0, 0, 0));
        toggleBtn.setPreferredSize(new Dimension(28, 28));
        toggleBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));

        toggleBtn.addActionListener(e -> toggleVisibility());

        setLayout(new BorderLayout());
        JPanel rightContainer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 4, 4));
        rightContainer.setOpaque(false);
        rightContainer.add(toggleBtn);
        add(rightContainer, BorderLayout.EAST);

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

    public boolean isPasswordVisible() {
        return isPasswordVisible;
    }

    public JButton getToggleBtn() {
        return toggleBtn;
    }

    public void setError(boolean error) {
        this.isError = error;
        repaint();
    }

    public void toggleVisibility() {
        int caretPos = getCaretPosition();
        isPasswordVisible = !isPasswordVisible;
        if (isPasswordVisible) {
            setEchoChar((char) 0);
            toggleBtn.setIcon(new EyeIcon(true));
            toggleBtn.setToolTipText("Hide password");
        } else {
            setEchoChar('•');
            toggleBtn.setIcon(new EyeIcon(false));
            toggleBtn.setToolTipText("Show password");
        }
        requestFocusInWindow();
        if (caretPos <= getDocument().getLength()) {
            setCaretPosition(caretPos);
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int width = getWidth();
        int height = getHeight();
        int radius = DevTrackColors.RADIUS_INPUT;

        // Background Color
        Color bg = !isEnabled() ? DevTrackColors.BG_SURFACE : (isFocused ? DevTrackColors.BG_ELEVATED : DevTrackColors.BG_INTERACTIVE);
        g2.setColor(bg);
        g2.fillRoundRect(0, 0, width, height, radius * 2, radius * 2);

        // Border Color
        Color border;
        if (!isEnabled()) {
            border = DevTrackColors.BORDER_SUBTLE;
        } else if (isError) {
            border = DevTrackColors.ERROR_MAIN;
        } else if (isFocused) {
            border = DevTrackColors.BORDER_FOCUS;
        } else if (isHovered) {
            border = DevTrackColors.BORDER_HOVER;
        } else {
            border = DevTrackColors.BORDER_INPUT;
        }

        g2.setColor(border);
        g2.setStroke(new BasicStroke(isFocused ? 2.0f : 1.5f));
        g2.drawRoundRect(0, 0, width - 1, height - 1, radius * 2, radius * 2);

        super.paintComponent(g);
        g2.dispose();
    }

    /**
     * Custom vector Icon drawing Eye (hidden state) and Eye-Off (visible state with slash line).
     */
    public static class EyeIcon implements Icon {
        private final boolean isVisibleState;
        private final int width = 18;
        private final int height = 18;

        public EyeIcon(boolean isVisibleState) {
            this.isVisibleState = isVisibleState;
        }

        @Override
        public void paintIcon(Component c, Graphics g, int x, int y) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_PURE);

            Color strokeColor = DevTrackColors.TEXT_SECONDARY;
            if (c instanceof AbstractButton btn && btn.getModel().isRollover()) {
                strokeColor = DevTrackColors.ACCENT_PRIMARY;
            }
            g2.setColor(strokeColor);
            g2.setStroke(new BasicStroke(1.5f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));

            double cx = x + width / 2.0;
            double cy = y + height / 2.0;

            // Eye outline path
            Path2D.Double eyePath = new Path2D.Double();
            eyePath.moveTo(x + 2, cy);
            eyePath.quadTo(cx, cy - 6.5, x + width - 2, cy);
            eyePath.quadTo(cx, cy + 6.5, x + 2, cy);
            g2.draw(eyePath);

            // Pupil
            g2.fillOval((int) (cx - 2.5), (int) (cy - 2.5), 5, 5);

            // Diagonal slash line for Eye-Off (when password text is currently visible)
            if (isVisibleState) {
                g2.setStroke(new BasicStroke(1.8f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
                g2.drawLine(x + 3, y + height - 3, x + width - 3, y + 3);
            }

            g2.dispose();
        }

        @Override
        public int getIconWidth() { return width; }

        @Override
        public int getIconHeight() { return height; }
    }
}
