package com.devtrack.ui.dialogs;

import com.devtrack.model.Certification;
import com.devtrack.model.CertificationDetails;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.CertificateThumbnailGenerator;
import com.devtrack.util.FileStorageUtil;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.io.File;

/**
 * Full preview dialog for viewing certificate details and full-size image/PDF preview.
 */
public class DTCertificationPreviewDialog extends JDialog {

    private final CertificationDetails certDetails;

    public DTCertificationPreviewDialog(Window owner, CertificationDetails certDetails) {
        super(owner, "Certificate Preview — " + certDetails.getCertification().getCertificateName(), ModalityType.APPLICATION_MODAL);
        this.certDetails = certDetails;

        setSize(750, 700);
        setLocationRelativeTo(owner);
        initUI();
    }

    private void initUI() {
        JPanel root = new JPanel(new BorderLayout(0, 16));
        root.setBackground(DevTrackColors.BG_PRIMARY);
        root.setBorder(new EmptyBorder(20, 24, 20, 24));

        Certification c = certDetails.getCertification();

        // Top Header
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setOpaque(false);

        JLabel lblTitle = new JLabel(c.getCertificateName());
        lblTitle.setFont(DevTrackFonts.HEADING_2);
        lblTitle.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel lblSub = new JLabel("Issued by: " + (c.getIssuer() != null ? c.getIssuer() : "N/A") + "  •  Issued: " + (c.getIssueDate() != null ? c.getIssueDate().toString() : "N/A"));
        lblSub.setFont(DevTrackFonts.BODY_SECONDARY);
        lblSub.setForeground(DevTrackColors.TEXT_SECONDARY);

        JPanel headerText = new JPanel();
        headerText.setLayout(new BoxLayout(headerText, BoxLayout.Y_AXIS));
        headerText.setOpaque(false);
        headerText.add(lblTitle);
        headerText.add(Box.createRigidArea(new Dimension(0, 4)));
        headerText.add(lblSub);

        headerPanel.add(headerText, BorderLayout.CENTER);
        root.add(headerPanel, BorderLayout.NORTH);

        // Center Preview Container
        JPanel previewContainer = new JPanel(new BorderLayout());
        previewContainer.setBackground(Color.WHITE);
        previewContainer.setBorder(BorderFactory.createLineBorder(new Color(228, 222, 210), 1));

        String filePath = c.getCertificateFile();
        File file = FileStorageUtil.resolveFile(filePath);

        if (file != null && file.exists()) {
            ImageIcon previewIcon = CertificateThumbnailGenerator.getThumbnail(filePath, 680, 520);
            JLabel lblPreview = new JLabel(previewIcon);
            lblPreview.setHorizontalAlignment(SwingConstants.CENTER);
            lblPreview.setVerticalAlignment(SwingConstants.CENTER);

            JScrollPane scrollPane = new JScrollPane(lblPreview);
            scrollPane.setBorder(null);
            scrollPane.getViewport().setBackground(Color.WHITE);

            previewContainer.add(scrollPane, BorderLayout.CENTER);
        } else {
            JPanel emptyBox = new JPanel(new GridBagLayout());
            emptyBox.setBackground(Color.WHITE);

            JLabel lblEmpty = new JLabel("<html><center><b>No Certificate Document Attached</b><br><span style='color:#8F8779'>No local file attached for this certification record.</span></center></html>");
            lblEmpty.setFont(DevTrackFonts.BODY_SECONDARY);
            emptyBox.add(lblEmpty);

            previewContainer.add(emptyBox, BorderLayout.CENTER);
        }

        root.add(previewContainer, BorderLayout.CENTER);

        // Bottom Bar
        JPanel bottomBar = new JPanel(new BorderLayout());
        bottomBar.setOpaque(false);

        if (file != null && file.exists()) {
            JButton btnOpenExternal = new JButton("Open in System Viewer ↗");
            btnOpenExternal.setFont(DevTrackFonts.BUTTON);
            btnOpenExternal.setForeground(DevTrackColors.TEXT_PRIMARY);
            btnOpenExternal.setBackground(DevTrackColors.BG_SURFACE);
            btnOpenExternal.setFocusPainted(false);
            btnOpenExternal.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
            btnOpenExternal.addActionListener(e -> openFileInSystemViewer(file));
            bottomBar.add(btnOpenExternal, BorderLayout.WEST);
        }

        JButton btnClose = new JButton("Close");
        btnClose.setFont(DevTrackFonts.BUTTON);
        btnClose.setForeground(Color.WHITE);
        btnClose.setBackground(DevTrackColors.ACCENT_PRIMARY);
        btnClose.setFocusPainted(false);
        btnClose.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        btnClose.addActionListener(e -> dispose());

        bottomBar.add(btnClose, BorderLayout.EAST);

        root.add(bottomBar, BorderLayout.SOUTH);
        setContentPane(root);
    }

    private void openFileInSystemViewer(File file) {
        try {
            if (Desktop.isDesktopSupported()) {
                Desktop.getDesktop().open(file);
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Could not open file: " + ex.getMessage(), "File Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
