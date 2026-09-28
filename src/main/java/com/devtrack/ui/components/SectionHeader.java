package com.devtrack.ui.components;

import com.devtrack.ui.Theme;
import javax.swing.*;
import java.awt.*;

/**
 * Reusable Section Header Component displaying page/section titles and subtitles.
 */
public class SectionHeader extends JPanel {

    public SectionHeader(String titleText, String subtitleText) {
        setLayout(new BorderLayout());
        setOpaque(false);

        JPanel textBox = new JPanel();
        textBox.setLayout(new BoxLayout(textBox, BoxLayout.Y_AXIS));
        textBox.setOpaque(false);

        JLabel titleLabel = new JLabel(titleText);
        titleLabel.setFont(Theme.FONT_PAGE_TITLE);
        titleLabel.setForeground(Theme.PRIMARY_DARK);

        textBox.add(titleLabel);

        if (subtitleText != null && !subtitleText.isEmpty()) {
            JLabel subtitleLabel = new JLabel(subtitleText);
            subtitleLabel.setFont(Theme.FONT_SUBTITLE);
            subtitleLabel.setForeground(Theme.TEXT_SECONDARY);
            textBox.add(Box.createVerticalStrut(4));
            textBox.add(subtitleLabel);
        }

        add(textBox, BorderLayout.WEST);
    }
}
