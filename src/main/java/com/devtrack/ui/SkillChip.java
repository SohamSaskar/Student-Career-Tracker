package com.devtrack.ui;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Skill Chip component in Dark Design System with hover response.
 */
public class SkillChip extends JPanel {

    private final String skillName;
    private final String statusTag;
    private boolean isHovered = false;
    private final boolean isRecommended;

    public SkillChip(String skillName, String statusTag, boolean isRecommended) {
        this.skillName = skillName;
        this.statusTag = statusTag;
        this.isRecommended = isRecommended;

        setLayout(new FlowLayout(FlowLayout.LEFT, 8, 4));
        setOpaque(false);
        setBorder(new EmptyBorder(4, 12, 4, 12));
        setCursor(new Cursor(Cursor.HAND_CURSOR));

        JLabel nameLabel = new JLabel(skillName);
        nameLabel.setFont(Theme.FONT_BODY_MEDIUM);
        nameLabel.setForeground(Theme.TEXT_PRIMARY);
        add(nameLabel);

        if (statusTag != null && !statusTag.isEmpty()) {
            JLabel tagLabel = new JLabel("  " + statusTag);
            tagLabel.setFont(Theme.FONT_SMALL);
            tagLabel.setForeground(isRecommended ? Theme.ACCENT_PRIMARY : Theme.TEXT_SECONDARY);
            add(tagLabel);
        }

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

        int w = getWidth();
        int h = getHeight();

        if (isRecommended) {
            g2.setColor(isHovered ? Theme.ACCENT_TINT : Theme.BG_SURFACE);
        } else {
            g2.setColor(isHovered ? Theme.BG_RAISED : Theme.BG_SURFACE);
        }
        g2.fillRoundRect(0, 0, w - 1, h - 1, 8, 8);

        g2.setColor(isHovered ? (isRecommended ? Theme.ACCENT_PRIMARY : Theme.BORDER_HOVER) : Theme.BORDER_COLOR);
        g2.drawRoundRect(0, 0, w - 1, h - 1, 8, 8);

        g2.dispose();
        super.paintComponent(g);
    }
}
