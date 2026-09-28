package com.devtrack.ui.dialogs;

import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

/**
 * Custom DTAlert dialog supporting Success, Warning, Error, Info alerts with DevTrack Charcoal + Muted Gold styling.
 */
public class DTAlert extends JDialog {

    public enum AlertType {
        SUCCESS,
        WARNING,
        ERROR,
        INFO
    }

    public DTAlert(Frame owner, String title, String message, AlertType type) {
        super(owner, title, true);

        setUndecorated(true);
        setSize(420, 210);
        setLocationRelativeTo(owner);

        JPanel mainPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                Color border;
                switch (type) {
                    case SUCCESS:
                        border = DevTrackColors.SUCCESS_MAIN;
                        break;
                    case WARNING:
                        border = DevTrackColors.WARNING_MAIN;
                        break;
                    case ERROR:
                        border = DevTrackColors.ERROR_MAIN;
                        break;
                    case INFO:
                    default:
                        border = DevTrackColors.INFO_MAIN;
                        break;
                }

                // Shadow
                g2.setColor(new Color(0, 0, 0, 80));
                g2.fillRoundRect(1, 3, getWidth() - 2, getHeight() - 3, DevTrackColors.RADIUS_DIALOG * 2, DevTrackColors.RADIUS_DIALOG * 2);

                // Background Elevated Surface (#242729)
                g2.setColor(DevTrackColors.BG_ELEVATED);
                g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 2, DevTrackColors.RADIUS_DIALOG * 2, DevTrackColors.RADIUS_DIALOG * 2);

                // Top Status Bar Accent
                g2.setColor(border);
                g2.fillRoundRect(0, 0, getWidth() - 1, 6, DevTrackColors.RADIUS_DIALOG * 2, DevTrackColors.RADIUS_DIALOG * 2);

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

        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 0, 0));
        footer.setOpaque(false);

        DTButton okBtn = new DTButton("OK", DTButton.ButtonType.PRIMARY);
        okBtn.setPreferredSize(new Dimension(80, 34));
        okBtn.addActionListener(e -> dispose());

        footer.add(okBtn);
        mainPanel.add(footer, BorderLayout.SOUTH);

        add(mainPanel);
    }

    public static void showSuccess(Component parent, String title, String message) {
        show(parent, title, message, AlertType.SUCCESS);
    }

    public static void showWarning(Component parent, String title, String message) {
        show(parent, title, message, AlertType.WARNING);
    }

    public static void showError(Component parent, String title, String message) {
        show(parent, title, message, AlertType.ERROR);
    }

    public static void showInfo(Component parent, String title, String message) {
        show(parent, title, message, AlertType.INFO);
    }

    private static void show(Component parent, String title, String message, AlertType type) {
        Frame owner = parent instanceof Frame ? (Frame) parent : (Frame) SwingUtilities.getWindowAncestor(parent);
        DTAlert alert = new DTAlert(owner, title, message, type);
        alert.setVisible(true);
    }
}
