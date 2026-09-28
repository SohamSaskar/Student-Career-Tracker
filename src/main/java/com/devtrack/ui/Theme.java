package com.devtrack.ui;

import com.devtrack.ui.theme.DevTrackColors;
import java.awt.Color;
import java.awt.Font;

/**
 * DevTrack Design System Tokens
 * Approved visual language: Arial typography, light canvas (#F3F4F2), 50% light mid-tone panels (#E4E8E2),
 * crisp dark borders (#323537, 1.5px stroke), dark orange accent (#C04A00), and bottle green accents (#0D5C3A).
 */
public class Theme {
    // Primary Canvas Colors
    public static final Color BG_PRIMARY = DevTrackColors.BG_APP;
    public static final Color PRIMARY_DARK = DevTrackColors.TEXT_PRIMARY;
    public static final Color DARK_SURFACE = DevTrackColors.BG_SECONDARY;
    public static final Color SECONDARY_DARK = DevTrackColors.TEXT_SECONDARY;
    
    // Mid-light panel color
    public static final Color PANEL_MID_LIGHT = DevTrackColors.BG_SECONDARY;
    public static final Color PANEL_MID_BORDER = DevTrackColors.BORDER_DEFAULT;
    
    // High-Contrast Clear Text Colors
    public static final Color TEXT_PRIMARY = DevTrackColors.TEXT_PRIMARY;
    public static final Color TEXT_SECONDARY = DevTrackColors.TEXT_SECONDARY;
    public static final Color TEXT_MUTED = DevTrackColors.TEXT_MUTED;
    public static final Color TEXT_LIGHT = DevTrackColors.BG_APP;
    
    // Surface & Crisp Dark Border Colors
    public static final Color BORDER_COLOR = DevTrackColors.BORDER_DEFAULT;
    public static final Color BORDER_HOVER = DevTrackColors.BORDER_HOVER;
    public static final Color LIGHT_SURFACE = DevTrackColors.BG_SURFACE;
    public static final Color LIGHT_SURFACE_HOVER = DevTrackColors.BG_SECONDARY;
    
    // Convenience Aliases
    public static final Color BG_SURFACE = LIGHT_SURFACE;
    public static final Color BG_RAISED = LIGHT_SURFACE_HOVER;

    // Deep Rust Primary Palette (#8B3A2B)
    public static final Color ACCENT_PRIMARY = DevTrackColors.ACCENT_PRIMARY;
    public static final Color ACCENT_HOVER = DevTrackColors.ACCENT_HOVER;
    public static final Color ACCENT_TINT = DevTrackColors.ACCENT_SUBTLE_BG;
    public static final Color ACCENT_LINE_RED = DevTrackColors.ACCENT_PRIMARY;
    
    // Red Node & Incomplete Skill Hover Palette
    public static final Color RED_NODE_BORDER = DevTrackColors.ERROR_MAIN;
    public static final Color RED_NODE_BG = DevTrackColors.ERROR_BG;

    // Bottle Green Palette (#123D2C)
    public static final Color BOTTLE_GREEN = DevTrackColors.SECONDARY_MAIN;
    public static final Color BOTTLE_GREEN_TINT = DevTrackColors.SECONDARY_SUBTLE_BG;

    // Student Role Box Styling
    public static final Color ROLE_BOX_BG = DevTrackColors.ACCENT_SUBTLE_BG;
    public static final Color ROLE_BOX_BORDER = DevTrackColors.ACCENT_PRIMARY;

    // Success Colors
    public static final Color ACCENT_SUCCESS = DevTrackColors.SUCCESS_MAIN;
    public static final Color SUCCESS_TINT = DevTrackColors.SUCCESS_BG;
    public static final Color SUCCESS_HOVER_BG = DevTrackColors.SECONDARY_SUBTLE_BG;

    // Typography (Arial everywhere)
    public static final String FONT_FAMILY = "Arial";
    
    public static final Font FONT_WORDMARK = new Font(FONT_FAMILY, Font.BOLD, 19);
    public static final Font FONT_PAGE_TITLE = new Font(FONT_FAMILY, Font.BOLD, 22);
    public static final Font FONT_SECTION_TITLE = new Font(FONT_FAMILY, Font.BOLD, 14);
    public static final Font FONT_SUBTITLE = new Font(FONT_FAMILY, Font.PLAIN, 13);
    public static final Font FONT_LABEL_BOLD = new Font(FONT_FAMILY, Font.BOLD, 13);
    public static final Font FONT_BODY = new Font(FONT_FAMILY, Font.PLAIN, 13);
    public static final Font FONT_BODY_MEDIUM = new Font(FONT_FAMILY, Font.BOLD, 13);
    public static final Font FONT_SMALL = new Font(FONT_FAMILY, Font.PLAIN, 12);
    public static final Font FONT_CAPTION = new Font(FONT_FAMILY, Font.BOLD, 11);
    public static final Font FONT_NAV = new Font(FONT_FAMILY, Font.PLAIN, 13);
    public static final Font FONT_NAV_ACTIVE = new Font(FONT_FAMILY, Font.BOLD, 13);
}
