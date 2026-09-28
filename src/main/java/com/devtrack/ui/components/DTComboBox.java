package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import java.awt.*;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.plaf.basic.BasicComboBoxUI;

/**
 * Custom DTComboBox component matching DevTrack Warm Porcelain aesthetic with 1.5px borders.
 */
public class DTComboBox<E> extends JComboBox<E> {

    private boolean isHovered = false;
    private boolean isFocused = false;

    public DTComboBox() {
        super();
        initStyle();
    }

    public DTComboBox(E[] items) {
        super(items);
        initStyle();
    }

    public DTComboBox(ComboBoxModel<E> model) {
        super(model);
        initStyle();
    }

    private void initStyle() {
        setFont(DevTrackFonts.BODY);
        setBackground(DevTrackColors.BG_SURFACE);
        setForeground(DevTrackColors.TEXT_PRIMARY);
        setOpaque(false);
        setBorder(new EmptyBorder(6, 10, 6, 10));

        setUI(new BasicComboBoxUI() {
            @Override
            protected JButton createArrowButton() {
                JButton btn = new JButton("▼");
                btn.setFont(DevTrackFonts.CAPTION);
                btn.setForeground(DevTrackColors.TEXT_SECONDARY);
                btn.setContentAreaFilled(false);
                btn.setBorderPainted(false);
                btn.setFocusPainted(false);
                btn.setMargin(new Insets(0, 0, 0, 0));
                btn.setPreferredSize(new Dimension(24, 24));
                return btn;
            }
        });

        setRenderer(new DefaultListCellRenderer() {
            @Override
            public Component getListCellRendererComponent(JList<?> list, Object value, int index, boolean isSelected, boolean cellHasFocus) {
                JLabel lbl = (JLabel) super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
                lbl.setFont(DevTrackFonts.BODY);
                lbl.setBorder(new EmptyBorder(4, 8, 4, 8));

                if (isSelected) {
                    lbl.setBackground(DevTrackColors.ACCENT_SUBTLE_BG);
                    lbl.setForeground(DevTrackColors.ACCENT_PRIMARY);
                } else {
                    lbl.setBackground(DevTrackColors.BG_ELEVATED);
                    lbl.setForeground(DevTrackColors.TEXT_PRIMARY);
                }
                return lbl;
            }
        });

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

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int width = getWidth();
        int height = getHeight();
        int radius = DevTrackColors.RADIUS_INPUT;

        // Background
        Color bg = !isEnabled() ? DevTrackColors.DISABLED_FILL : DevTrackColors.BG_SURFACE;
        g2.setColor(bg);
        g2.fillRoundRect(0, 0, width, height, radius * 2, radius * 2);

        // Border Color
        Color border;
        if (!isEnabled()) {
            border = DevTrackColors.DISABLED_BORDER;
        } else if (isFocused) {
            border = DevTrackColors.BORDER_FOCUS; // #1B5240 Focus ring
        } else if (isHovered) {
            border = DevTrackColors.BORDER_HOVER; // #D8CFC0 Hover
        } else {
            border = DevTrackColors.BORDER_INPUT; // #E4DED2 Default
        }

        g2.setColor(border);
        g2.setStroke(new BasicStroke(isFocused ? 2.0f : 1.5f));
        g2.drawRoundRect(0, 0, width - 1, height - 1, radius * 2, radius * 2);

        super.paintComponent(g);
        g2.dispose();
    }

    @Override
    public Dimension getPreferredSize() {
        Dimension d = super.getPreferredSize();
        return new Dimension(d.width, Math.max(44, d.height));
    }
}

