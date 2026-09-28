package com.devtrack.ui.theme;

import javax.swing.UIManager;

/**
 * DevTrack Theme Initialization & UIManager Defaults Manager.
 */
public class DevTrackTheme {

    public static void install() {
        System.setProperty("awt.useSystemAAFontSettings", "on");
        System.setProperty("swing.aatext", "true");

        try {
            UIManager.setLookAndFeel(UIManager.getCrossPlatformLookAndFeelClassName());
        } catch (Exception ignored) {}

        // Global Swing UIManager Colors
        UIManager.put("Panel.background", DevTrackColors.BG_SURFACE);
        UIManager.put("Panel.foreground", DevTrackColors.TEXT_PRIMARY);

        UIManager.put("Label.font", DevTrackFonts.BODY);
        UIManager.put("Label.foreground", DevTrackColors.TEXT_PRIMARY);

        UIManager.put("TextField.background", DevTrackColors.BG_INTERACTIVE);
        UIManager.put("TextField.foreground", DevTrackColors.TEXT_PRIMARY);
        UIManager.put("TextField.caretForeground", DevTrackColors.TEXT_PRIMARY);
        UIManager.put("TextField.selectionBackground", DevTrackColors.ACCENT_SUBTLE_BG);
        UIManager.put("TextField.selectionForeground", DevTrackColors.ACCENT_PRIMARY);

        UIManager.put("PasswordField.background", DevTrackColors.BG_INTERACTIVE);
        UIManager.put("PasswordField.foreground", DevTrackColors.TEXT_PRIMARY);
        UIManager.put("PasswordField.caretForeground", DevTrackColors.TEXT_PRIMARY);

        UIManager.put("ComboBox.background", DevTrackColors.BG_INTERACTIVE);
        UIManager.put("ComboBox.foreground", DevTrackColors.TEXT_PRIMARY);
        UIManager.put("ComboBox.selectionBackground", DevTrackColors.ACCENT_SUBTLE_BG);
        UIManager.put("ComboBox.selectionForeground", DevTrackColors.ACCENT_PRIMARY);

        UIManager.put("Table.background", DevTrackColors.TABLE_ROW_DEFAULT);
        UIManager.put("Table.foreground", DevTrackColors.TEXT_PRIMARY);
        UIManager.put("Table.selectionBackground", DevTrackColors.ACCENT_SUBTLE_BG);
        UIManager.put("Table.selectionForeground", DevTrackColors.ACCENT_PRIMARY);

        UIManager.put("TableHeader.background", DevTrackColors.TABLE_HEADER_BG);
        UIManager.put("TableHeader.foreground", DevTrackColors.TEXT_SECONDARY);
        UIManager.put("TableHeader.font", DevTrackFonts.FORM_LABEL);

        UIManager.put("ScrollPane.background", DevTrackColors.BG_SURFACE);
        UIManager.put("Viewport.background", DevTrackColors.BG_SURFACE);

        UIManager.put("Button.background", DevTrackColors.ACCENT_PRIMARY);
        UIManager.put("Button.foreground", DevTrackColors.TEXT_ON_ACCENT);
        UIManager.put("Button.font", DevTrackFonts.BUTTON);
    }
}
