package com.devtrack.ui.dialogs;

import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.components.DTTextField;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

/**
 * Custom DTInputDialog prompt modal dialog.
 */
public class DTInputDialog extends JDialog {

    private String inputResult = null;
    private final DTTextField textField;

    public DTInputDialog(Frame owner, String title, String prompt, String initialValue) {
        super(owner, title, true);

        setUndecorated(true);
        setSize(420, 230);
        setLocationRelativeTo(owner);

        JPanel mainPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                g2.setColor(DevTrackColors.BG_ELEVATED);
                g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, DevTrackColors.RADIUS_DIALOG * 2, DevTrackColors.RADIUS_DIALOG * 2);

                g2.setColor(DevTrackColors.BORDER_DEFAULT);
                g2.setStroke(new BasicStroke(1.5f));
                g2.drawRoundRect(1, 1, getWidth() - 3, getHeight() - 3, DevTrackColors.RADIUS_DIALOG * 2, DevTrackColors.RADIUS_DIALOG * 2);

                g2.dispose();
                super.paintComponent(g);
            }
        };
        mainPanel.setLayout(new BorderLayout());
        mainPanel.setOpaque(false);
        mainPanel.setBorder(new EmptyBorder(20, 24, 20, 24));

        JLabel titleLabel = new JLabel(title);
        titleLabel.setFont(DevTrackFonts.PAGE_TITLE);
        titleLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel promptLabel = new JLabel(prompt);
        promptLabel.setFont(DevTrackFonts.BODY);
        promptLabel.setForeground(DevTrackColors.TEXT_SECONDARY);

        textField = new DTTextField(initialValue != null ? initialValue : "");

        JPanel contentWrap = new JPanel();
        contentWrap.setLayout(new BoxLayout(contentWrap, BoxLayout.Y_AXIS));
        contentWrap.setOpaque(false);
        contentWrap.add(titleLabel);
        contentWrap.add(Box.createVerticalStrut(6));
        contentWrap.add(promptLabel);
        contentWrap.add(Box.createVerticalStrut(12));
        contentWrap.add(textField);

        mainPanel.add(contentWrap, BorderLayout.CENTER);

        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 0));
        footer.setOpaque(false);

        DTButton cancelBtn = new DTButton("CANCEL", DTButton.ButtonType.SECONDARY);
        cancelBtn.addActionListener(e -> {
            inputResult = null;
            dispose();
        });

        DTButton submitBtn = new DTButton("SUBMIT", DTButton.ButtonType.PRIMARY);
        submitBtn.addActionListener(e -> {
            inputResult = textField.getText().trim();
            dispose();
        });

        footer.add(cancelBtn);
        footer.add(submitBtn);

        mainPanel.add(footer, BorderLayout.SOUTH);
        add(mainPanel);
    }

    public static String show(Component parent, String title, String prompt, String initialValue) {
        Frame owner = parent instanceof Frame ? (Frame) parent : (Frame) SwingUtilities.getWindowAncestor(parent);
        DTInputDialog dialog = new DTInputDialog(owner, title, prompt, initialValue);
        dialog.setVisible(true);
        return dialog.inputResult;
    }
}
