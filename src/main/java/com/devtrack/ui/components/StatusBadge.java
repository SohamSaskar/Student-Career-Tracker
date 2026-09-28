package com.devtrack.ui.components;

import com.devtrack.ui.Theme;
import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Reusable Status Badge Component with zero left clipping, 10px rounded corners,
 * and exact color rules:
 * - Missing / High Gap -> Dark Orange (#C04A00) / #FEF0EC fill
 * - Learning / Completed / Shortlisted -> Bottle Green (#0D5C3A) / #E6F4EA fill
 * - Applied / Neutral -> Dark Charcoal (#333739) / #F0F2F4 fill
 */
public class StatusBadge extends JComponent {

    private final String statusText;
    private boolean isHovered = false;

    public StatusBadge(String statusText) {
        this.statusText = statusText;
        setPreferredSize(new Dimension(94, 26));

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

        boolean isMissing = statusText.equalsIgnoreCase("Missing") || statusText.equalsIgnoreCase("Gap") || statusText.equalsIgnoreCase("Rejected");
        boolean isGreen = statusText.equalsIgnoreCase("Learning") || statusText.equalsIgnoreCase("Completed") || statusText.equalsIgnoreCase("Shortlisted") || statusText.equalsIgnoreCase("Selected") || statusText.equalsIgnoreCase("Interview") || statusText.equalsIgnoreCase("Active Goal");

        Color bg;
        Color border;
        Color textCol;

        if (isMissing) {
            bg = isHovered ? new Color(253, 230, 222) : Theme.ACCENT_TINT;
            border = Theme.ACCENT_PRIMARY;
            textCol = Theme.ACCENT_PRIMARY;
        } else if (isGreen) {
            bg = isHovered ? new Color(215, 240, 222) : Theme.BOTTLE_GREEN_TINT;
            border = Theme.BOTTLE_GREEN;
            textCol = Theme.BOTTLE_GREEN;
        } else {
            bg = isHovered ? new Color(235, 238, 240) : new Color(242, 244, 246);
            border = Theme.BORDER_COLOR;
            textCol = Theme.TEXT_SECONDARY;
        }

        int badgeW = 86;
        int badgeH = 24;
        int x = 2; // Offset by 2px to prevent left border clipping
        int y = 1;

        // Draw 10px rounded background fill
        g2.setColor(bg);
        g2.fillRoundRect(x, y, badgeW, badgeH, 10, 10);

        // Draw 10px rounded border
        g2.setColor(border);
        g2.setStroke(new BasicStroke(isHovered ? 1.5f : 1.0f));
        g2.drawRoundRect(x, y, badgeW - 1, badgeH - 1, 10, 10);

        // Draw centered text
        g2.setFont(Theme.FONT_SMALL);
        g2.setColor(textCol);
        FontMetrics fm = g2.getFontMetrics();
        int textX = x + (badgeW - fm.stringWidth(statusText)) / 2;
        int textY = y + (badgeH + fm.getAscent()) / 2 - 2;
        g2.drawString(statusText, textX, textY);

        g2.dispose();
    }
}
