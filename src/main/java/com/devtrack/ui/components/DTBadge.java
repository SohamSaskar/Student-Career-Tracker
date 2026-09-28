package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

/**
 * Custom DTBadge component for status and priority tags with solid text on subtle background tint.
 * Charcoal + Muted Gold status tokens:
 * Completed -> #4E9E6E
 * Learning -> #C79A3D
 * Missing -> #5F6367 (Neutral, NOT error red)
 * Error -> #D0564F
 */
public class DTBadge extends JLabel {

    private Color bg;
    private Color border;
    private Color fg;

    public DTBadge(String text) {
        super(text != null ? text.toUpperCase() : "MISSING");
        initBadge(text);
    }

    private void initBadge(String statusText) {
        setFont(DevTrackFonts.custom(Font.BOLD, 11));
        setHorizontalAlignment(SwingConstants.CENTER);
        setOpaque(false);
        setBorder(new EmptyBorder(4, 10, 4, 10));

        String key = statusText != null ? statusText.trim() : "";

        if (key.equalsIgnoreCase("Completed") || key.equalsIgnoreCase("Verified") || key.equalsIgnoreCase("Success")) {
            bg = DevTrackColors.BADGE_SUCCESS_BG; // #E6F3ED
            border = new Color(181, 224, 203); // Soft subtle green border #B5E0CB
            fg = DevTrackColors.BADGE_SUCCESS_TEXT; // #123D2C
        } else if (key.equalsIgnoreCase("Learning") || key.equalsIgnoreCase("In Progress") || key.equalsIgnoreCase("Medium") || key.equalsIgnoreCase("Warning")) {
            bg = DevTrackColors.BADGE_WARNING_BG; // #FEF3E2
            border = new Color(243, 217, 164); // Soft subtle amber border #F3D9A4
            fg = DevTrackColors.BADGE_WARNING_TEXT; // #9A5B0A
        } else if (key.equalsIgnoreCase("Missing") || key.equalsIgnoreCase("Not Started")) {
            bg = DevTrackColors.MISSING_BG; // #F3F0EA
            border = new Color(220, 224, 230); // #DCE0E6
            fg = DevTrackColors.TEXT_MUTED;
        } else if (key.equalsIgnoreCase("High") || key.equalsIgnoreCase("Error") || key.equalsIgnoreCase("Destructive")) {
            bg = DevTrackColors.BADGE_ERROR_BG; // #FCE8E6
            border = new Color(245, 198, 194); // Soft subtle red border #F5C6C2
            fg = DevTrackColors.BADGE_ERROR_TEXT; // #B3261E
        } else if (key.equalsIgnoreCase("Planned") || key.equalsIgnoreCase("Low") || key.equalsIgnoreCase("Info")) {
            bg = DevTrackColors.INFO_BG; // #E5F3F7
            border = new Color(190, 222, 230); // Soft subtle steel border #BEDEE6
            fg = DevTrackColors.INFO_TEXT; // #0E5F73
        } else {
            bg = DevTrackColors.BADGE_NEUTRAL_BG;
            border = new Color(220, 224, 230);
            fg = DevTrackColors.BADGE_NEUTRAL_TEXT;
        }

        setForeground(fg);
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int width = getWidth();
        int height = getHeight();
        int radius = DevTrackColors.RADIUS_BADGE;

        g2.setColor(bg);
        g2.fillRoundRect(1, 1, width - 2, height - 2, radius * 2, radius * 2);

        g2.setColor(border);
        g2.setStroke(new BasicStroke(1.0f));
        g2.drawRoundRect(1, 1, width - 3, height - 3, radius * 2, radius * 2);

        g2.dispose();
        super.paintComponent(g);
    }
}
