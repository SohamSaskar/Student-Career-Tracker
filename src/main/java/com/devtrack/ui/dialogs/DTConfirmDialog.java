package com.devtrack.ui.dialogs;

import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

/**
 * Custom DTConfirmDialog modal dialog matching DevTrack Charcoal + Muted Gold aesthetic.
 */
public class DTConfirmDialog extends JDialog {

    private boolean confirmed = false;

    public DTConfirmDialog(Frame owner, String title, String message) {
        super(owner, title, true);

        setUndecorated(true);
        setSize(420, 210);
        setLocationRelativeTo(owner);

        JPanel mainPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                // Shadow
                g2.setColor(new Color(0, 0, 0, 80));
                g2.fillRoundRect(1, 3, getWidth() - 2, getHeight() - 3, DevTrackColors.RADIUS_DIALOG * 2, DevTrackColors.RADIUS_DIALOG * 2);

                // Elevated Surface fill (#242729)
                g2.setColor(DevTrackColors.BG_ELEVATED);
                g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 2, DevTrackColors.RADIUS_DIALOG * 2, DevTrackColors.RADIUS_DIALOG * 2);

                // Border (#2E3133)
                g2.setColor(DevTrackColors.BORDER_DEFAULT);
                g2.setStroke(new BasicStroke(1.0f));
                g2.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 2, DevTrackColors.RADIUS_DIALOG * 2, DevTrackColors.RADIUS_DIALOG * 2);

                g2.dispose();
                super.paintComponent(g);
            }
        };
        mainPanel.setLayout(new BorderLayout());
        mainPanel.setOpaque(false);
        mainPanel.setBorder(new EmptyBorder(22, 24, 20, 24));

        JLabel titleLabel = new JLabel(title);
        titleLabel.setFont(DevTrackFonts.PAGE_TITLE);
        titleLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        JTextArea msgArea = new JTextArea(message);
        msgArea.setFont(DevTrackFonts.BODY);
        msgArea.setForeground(DevTrackColors.TEXT_SECONDARY);
        msgArea.setLineWrap(true);
        msgArea.setWrapStyleWord(true);
        msgArea.setEditable(false);
        msgArea.setOpaque(false);

        JPanel contentWrap = new JPanel();
        contentWrap.setLayout(new BoxLayout(contentWrap, BoxLayout.Y_AXIS));
        contentWrap.setOpaque(false);
        contentWrap.add(titleLabel);
        contentWrap.add(Box.createVerticalStrut(10));
        contentWrap.add(msgArea);

        mainPanel.add(contentWrap, BorderLayout.CENTER);

        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        footer.setOpaque(false);

        DTButton cancelBtn = new DTButton("Cancel", DTButton.ButtonType.SECONDARY);
        cancelBtn.setPreferredSize(new Dimension(90, 34));
        cancelBtn.addActionListener(e -> {
            confirmed = false;
            dispose();
        });

        DTButton confirmBtn = new DTButton("Confirm", DTButton.ButtonType.PRIMARY);
        confirmBtn.setPreferredSize(new Dimension(95, 34));
        confirmBtn.addActionListener(e -> {
            confirmed = true;
            dispose();
        });

        footer.add(cancelBtn);
        footer.add(confirmBtn);

        mainPanel.add(footer, BorderLayout.SOUTH);
        add(mainPanel);
    }

    public static boolean show(Component parent, String title, String message) {
        Frame owner = parent instanceof Frame ? (Frame) parent : (Frame) SwingUtilities.getWindowAncestor(parent);
        DTConfirmDialog dialog = new DTConfirmDialog(owner, title, message);
        dialog.setVisible(true);
        return dialog.confirmed;
    }
}
