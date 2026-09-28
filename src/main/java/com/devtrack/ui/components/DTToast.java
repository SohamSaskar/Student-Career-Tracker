package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * Reusable non-blocking toast notification overlay for DevTrack.
 * Displays brief success, info, warning, or error feedback near the bottom center
 * of the screen without interrupting user workflow or forcing 'OK' clicks.
 */
public class DTToast extends JWindow {

    public enum ToastType {
        SUCCESS,
        INFO,
        WARNING,
        ERROR
    }

    private final Timer dismissTimer;

    public DTToast(Window owner, String message, ToastType type) {
        super(owner);

        setFocusableWindowState(false);
        setAlwaysOnTop(true);

        JPanel contentPanel = new JPanel(new BorderLayout(10, 0)) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                int width = getWidth();
                int height = getHeight();
                int radius = DevTrackColors.RADIUS_CARD;

                // Soft shadow
                g2.setColor(new Color(15, 23, 42, 24));
                g2.fillRoundRect(1, 3, width - 2, height - 3, radius * 2, radius * 2);

                // Card surface fill (#FFFFFF)
                g2.setColor(DevTrackColors.BG_SURFACE);
                g2.fillRoundRect(0, 0, width - 1, height - 2, radius * 2, radius * 2);

                // 1px Slate Border (#E2E8F0)
                g2.setColor(DevTrackColors.BORDER_DEFAULT);
                g2.setStroke(new BasicStroke(1.0f));
                g2.drawRoundRect(0, 0, width - 1, height - 2, radius * 2, radius * 2);

                g2.dispose();
                super.paintComponent(g);
            }
        };
        contentPanel.setOpaque(false);
        contentPanel.setBorder(new EmptyBorder(10, 16, 10, 18));

        // Status Indicator Icon / Dot
        Color statusColor;
        String iconSymbol;
        switch (type) {
            case SUCCESS:
                statusColor = DevTrackColors.SUCCESS_MAIN;
                iconSymbol = "✓";
                break;
            case WARNING:
                statusColor = DevTrackColors.WARNING_MAIN;
                iconSymbol = "!";
                break;
            case ERROR:
                statusColor = DevTrackColors.ERROR_MAIN;
                iconSymbol = "✕";
                break;
            case INFO:
            default:
                statusColor = DevTrackColors.ACCENT_PRIMARY;
                iconSymbol = "i";
                break;
        }

        JLabel iconLabel = new JLabel(iconSymbol);
        iconLabel.setFont(DevTrackFonts.FORM_LABEL);
        iconLabel.setForeground(statusColor);

        JLabel msgLabel = new JLabel(message);
        msgLabel.setFont(DevTrackFonts.BODY);
        msgLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        contentPanel.add(iconLabel, BorderLayout.WEST);
        contentPanel.add(msgLabel, BorderLayout.CENTER);

        add(contentPanel);
        pack();

        // Position Toast near bottom center of owner window or screen
        if (owner != null && owner.isVisible()) {
            Point loc = owner.getLocationOnScreen();
            int x = loc.x + (owner.getWidth() - getWidth()) / 2;
            int y = loc.y + owner.getHeight() - getHeight() - 40;
            setLocation(x, y);
        } else {
            Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
            int x = (screenSize.width - getWidth()) / 2;
            int y = screenSize.height - getHeight() - 80;
            setLocation(x, y);
        }

        // Auto dismiss after 2.5 seconds (2500ms)
        dismissTimer = new Timer(2500, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dispose();
            }
        });
        dismissTimer.setRepeats(false);
    }

    public static void showSuccess(Component parent, String message) {
        show(parent, message, ToastType.SUCCESS);
    }

    public static void showInfo(Component parent, String message) {
        show(parent, message, ToastType.INFO);
    }

    public static void showWarning(Component parent, String message) {
        show(parent, message, ToastType.WARNING);
    }

    public static void showError(Component parent, String message) {
        show(parent, message, ToastType.ERROR);
    }

    private static void show(Component parent, String message, ToastType type) {
        SwingUtilities.invokeLater(() -> {
            Window window = parent != null ? SwingUtilities.getWindowAncestor(parent) : null;
            DTToast toast = new DTToast(window, message, type);
            toast.setVisible(true);
            toast.dismissTimer.start();
        });
    }
}
