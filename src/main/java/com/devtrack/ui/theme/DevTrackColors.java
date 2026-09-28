package com.devtrack.ui.theme;

import java.awt.Color;

/**
 * DevTrack Design System — Core Color Tokens & Radius Constants.
 * Centralized Electric Indigo Light Visual Identity (#4338CA).
 */
public class DevTrackColors {

    // Base Surfaces — Light Warm Restrained Palette
    public static final Color BG_APP         = new Color(247, 248, 250); // #F7F8FA (Page Background)
    public static final Color BG_SURFACE     = new Color(255, 255, 255); // #FFFFFF (Elevated Surface)
    public static final Color BG_SECONDARY   = new Color(234, 237, 241); // #EAEDF1 (Card Surface)
    public static final Color BG_ELEVATED    = new Color(255, 255, 255); // #FFFFFF (Dialog Surface)
    public static final Color BG_INTERACTIVE = new Color(220, 224, 230); // #DCE0E6 (Input / Interactive)
    public static final Color BG_HEADER      = new Color(255, 255, 255); // #FFFFFF (Header / Navigation)

    // Brand Primary — Dark Navy (#0D1B33)
    public static final Color ACCENT_PRIMARY   = new Color(13, 27, 51);   // #0D1B33 (Primary Base)
    public static final Color ACCENT_HOVER     = new Color(22, 41, 74);   // #16294A (Primary Hover)
    public static final Color ACCENT_ACTIVE    = new Color(8, 18, 42);    // #08122A (Primary Active)
    public static final Color ACCENT_SUBTLE_BG = new Color(232, 238, 248); // #E8EEF8 (Subtle Navy BG)
    public static final Color ACCENT_BORDER    = new Color(13, 27, 51);   // #0D1B33

    // Brand Secondary — Bottle Green (#123D2C)
    public static final Color SECONDARY_MAIN      = new Color(18, 61, 44);   // #123D2C
    public static final Color SECONDARY_HOVER     = new Color(28, 91, 65);   // #1C5B41
    public static final Color SECONDARY_ACTIVE    = new Color(11, 42, 30);   // #0B2A1E
    public static final Color SECONDARY_SUBTLE_BG = new Color(230, 243, 237); // #E6F3ED

    // Typography — High Contrast Dark Ink
    public static final Color TEXT_HEADINGS  = new Color(16, 19, 24);    // #101318 (Primary Text)
    public static final Color TEXT_PRIMARY   = new Color(16, 19, 24);    // #101318
    public static final Color TEXT_SECONDARY = new Color(75, 80, 90);    // #4B505A (Secondary Text)
    public static final Color TEXT_MUTED     = new Color(134, 140, 150); // #868C96 (Muted Text)
    public static final Color TEXT_DISABLED  = new Color(180, 185, 195); // #B4B9C3 (Disabled Text)
    public static final Color TEXT_ON_ACCENT = new Color(255, 255, 255); // #FFFFFF

    // Borders
    public static final Color BORDER_DEFAULT = new Color(228, 222, 210); // #E4DED2
    public static final Color BORDER_INPUT   = new Color(220, 224, 230); // #DCE0E6
    public static final Color BORDER_TABLE   = new Color(228, 222, 210); // #E4DED2
    public static final Color BORDER_SUBTLE  = new Color(234, 237, 241); // #EAEDF1
    public static final Color BORDER_HOVER   = new Color(216, 207, 192); // #D8CFC0
    public static final Color BORDER_FOCUS   = new Color(13, 27, 51);    // #0D1B33
    public static final Color BORDER_ACTIVE  = new Color(13, 27, 51);

    // Semantics — Status Colors
    public static final Color SUCCESS_MAIN   = new Color(18, 61, 44);    // #123D2C (Bottle Green)
    public static final Color SUCCESS_BG     = new Color(230, 243, 237); // #E6F3ED
    public static final Color SUCCESS_BORDER = new Color(18, 61, 44);    // #123D2C
    public static final Color SUCCESS_TEXT   = new Color(18, 61, 44);

    public static final Color WARNING_MAIN   = new Color(154, 91, 10);   // #9A5B0A (Amber)
    public static final Color WARNING_BG     = new Color(254, 243, 226); // #FEF3E2
    public static final Color WARNING_BORDER = new Color(154, 91, 10);
    public static final Color WARNING_TEXT   = new Color(154, 91, 10);

    public static final Color ERROR_MAIN     = new Color(179, 38, 30);   // #B3261E (Danger Red)
    public static final Color ERROR_BG       = new Color(252, 232, 230); // #FCE8E6
    public static final Color ERROR_BORDER   = new Color(179, 38, 30);
    public static final Color ERROR_TEXT     = new Color(179, 38, 30);

    public static final Color INFO_MAIN      = new Color(14, 95, 115);   // #0E5F73 (Steel Blue)
    public static final Color INFO_BG        = new Color(229, 243, 247); // #E5F3F7
    public static final Color INFO_BORDER    = new Color(14, 95, 115);
    public static final Color INFO_TEXT      = new Color(14, 95, 115);

    public static final Color MISSING_MAIN   = new Color(167, 158, 143); // #A79E8F (Warm Neutral Muted Gray)
    public static final Color MISSING_BG     = new Color(243, 240, 234); // #F3F0EA
    public static final Color MISSING_TEXT   = new Color(167, 158, 143); // #A79E8F

    // Skill States & Priority
    public static final Color PROGRESS_COMPLETED = SUCCESS_MAIN;        // #123D2C
    public static final Color PROGRESS_LEARNING  = ACCENT_PRIMARY;      // #8B3A2B
    public static final Color PROGRESS_MISSING   = MISSING_MAIN;        // #A79E8F

    public static final Color PRIORITY_HIGH   = ERROR_MAIN;             // #7A2A1F
    public static final Color PRIORITY_MEDIUM = ACCENT_PRIMARY;          // #8B3A2B
    public static final Color PRIORITY_LOW    = INFO_MAIN;              // #2C4F63

    // Table Colors
    public static final Color TABLE_ROW_DEFAULT = new Color(255, 255, 255); // #FFFFFF
    public static final Color TABLE_ROW_STRIPE  = new Color(250, 249, 246); // #FAF9F6
    public static final Color TABLE_ROW_HOVER   = new Color(243, 240, 234); // #F3F0EA
    public static final Color TABLE_HEADER_BG   = new Color(243, 240, 234); // #F3F0EA

    // Badges (solid text on subtle bg)
    public static final Color BADGE_NEUTRAL_TEXT = new Color(92, 85, 76);    // #5C554C
    public static final Color BADGE_NEUTRAL_BG   = new Color(243, 240, 234); // #F3F0EA
    public static final Color BADGE_ACCENT_TEXT  = new Color(139, 58, 43);   // #8B3A2B
    public static final Color BADGE_ACCENT_BG    = new Color(242, 222, 215); // #F2DED7
    public static final Color BADGE_SUCCESS_TEXT = new Color(18, 61, 44);    // #123D2C
    public static final Color BADGE_SUCCESS_BG   = new Color(220, 232, 225); // #DCE8E1
    public static final Color BADGE_WARNING_TEXT = new Color(138, 90, 13);   // #8A5A0D
    public static final Color BADGE_WARNING_BG   = new Color(253, 244, 229); // #FDF4E5
    public static final Color BADGE_ERROR_TEXT   = new Color(122, 42, 31);   // #7A2A1F
    public static final Color BADGE_ERROR_BG     = new Color(249, 234, 232); // #F9EAE8

    // Disabled States
    public static final Color DISABLED_FILL   = new Color(243, 240, 234); // #F3F0EA
    public static final Color DISABLED_BORDER = new Color(228, 222, 210); // #E4DED2
    public static final Color DISABLED_TEXT   = new Color(196, 188, 174); // #C4BCAE

    // Corner Radius System
    public static final int RADIUS_INPUT  = 4;
    public static final int RADIUS_BUTTON = 4;
    public static final int RADIUS_CARD   = 6;
    public static final int RADIUS_DIALOG = 6;
    public static final int RADIUS_TABLE  = 0;
    public static final int RADIUS_BADGE  = 4;

    // Color Aliases for Compatibility
    public static final Color ACCENT_ERROR   = ERROR_TEXT;
    public static final Color ACCENT_SUCCESS = SUCCESS_TEXT;
    public static final Color ACCENT_INFO    = INFO_TEXT;
    public static final Color ACCENT_WARNING = WARNING_TEXT;
    public static final Color BORDER_CARD    = BORDER_DEFAULT;
    public static final Color BG_PRIMARY     = BG_APP;
    public static final Color BG_CARD        = BG_SURFACE;
}
