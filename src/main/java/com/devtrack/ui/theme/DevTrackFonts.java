package com.devtrack.ui.theme;

import java.awt.Font;

/**
 * DevTrack Design System — Typography System (Arial).
 * Standardized fonts across all screens and components.
 */
public class DevTrackFonts {

    public static final String FONT_FAMILY = "Arial";

    public static final Font PAGE_TITLE    = new Font(FONT_FAMILY, Font.BOLD, 22);
    public static final Font SECTION_TITLE = new Font(FONT_FAMILY, Font.BOLD, 14);
    public static final Font CARD_TITLE    = new Font(FONT_FAMILY, Font.BOLD, 14);
    public static final Font BODY          = new Font(FONT_FAMILY, Font.PLAIN, 13);
    public static final Font SECONDARY     = new Font(FONT_FAMILY, Font.PLAIN, 13);
    public static final Font FORM_LABEL    = new Font(FONT_FAMILY, Font.BOLD, 13);
    public static final Font CAPTION       = new Font(FONT_FAMILY, Font.PLAIN, 12);
    public static final Font BUTTON        = new Font(FONT_FAMILY, Font.BOLD, 13);
    public static final Font NAVIGATION    = new Font(FONT_FAMILY, Font.PLAIN, 13);
    public static final Font NAV_ACTIVE    = new Font(FONT_FAMILY, Font.BOLD, 13);
    public static final Font METRIC        = new Font(FONT_FAMILY, Font.BOLD, 36);

    public static final Font HEADING_1      = PAGE_TITLE;
    public static final Font HEADING_2      = new Font(FONT_FAMILY, Font.BOLD, 18);
    public static final Font HEADING_3      = SECTION_TITLE;
    public static final Font BODY_SMALL     = CAPTION;
    public static final Font BODY_SECONDARY = SECONDARY;
    public static final Font BODY_BOLD      = FORM_LABEL;
    public static final Font METRIC_VALUE   = METRIC;

    public static Font custom(int style, int size) {
        return new Font(FONT_FAMILY, style, size);
    }
}
