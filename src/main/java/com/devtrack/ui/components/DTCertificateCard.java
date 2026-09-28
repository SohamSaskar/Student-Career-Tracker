package com.devtrack.ui.components;

import com.devtrack.model.Certification;
import com.devtrack.model.CertificationDetails;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.CertificateThumbnailGenerator;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.text.SimpleDateFormat;

/**
 * Professional, compact Certificate Card component.
 * Displays top thumbnail preview box (140px height), certificate metadata below,
 * and bottom action buttons ([ View ] [ Edit ] [ Delete ]).
 */
public class DTCertificateCard extends JPanel {

    public interface CertificateCardActionListener {
        void onView(CertificationDetails details);
        void onEdit(CertificationDetails details);
        void onDelete(CertificationDetails details);
    }

    private final CertificationDetails certDetails;
    private final CertificateCardActionListener actionListener;
    private boolean isHovered = false;

    public DTCertificateCard(CertificationDetails certDetails, CertificateCardActionListener actionListener) {
        this.certDetails = certDetails;
        this.actionListener = actionListener;

        setLayout(new BorderLayout(0, 8));
        setOpaque(false);
        setPreferredSize(new Dimension(320, 295));
        setMinimumSize(new Dimension(280, 280));
        setBorder(new EmptyBorder(12, 12, 12, 12));

        initCardUI();

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                isHovered = true;
                repaint();
            }

            @Override
            public void mouseExited(MouseEvent e) {
                isHovered = false;
                repaint();
            }
        });
    }

    private void initCardUI() {
        Certification c = certDetails.getCertification();

        // --- 1. Top Thumbnail Box (130px Height, 100% Width) ---
        JPanel thumbBox = new JPanel(new BorderLayout());
        thumbBox.setPreferredSize(new Dimension(296, 130));
        thumbBox.setBackground(new Color(220, 224, 230)); // Deeper warm neutral container #DCE0E6
        thumbBox.setBorder(BorderFactory.createLineBorder(new Color(228, 222, 210), 1));
        thumbBox.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        ImageIcon thumbIcon = CertificateThumbnailGenerator.getThumbnail(c.getCertificateFile(), 294, 128);
        JLabel lblThumb = new JLabel(thumbIcon);
        lblThumb.setHorizontalAlignment(SwingConstants.CENTER);
        lblThumb.setVerticalAlignment(SwingConstants.CENTER);
        lblThumb.setToolTipText("Click to view certificate preview");

        lblThumb.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (actionListener != null) actionListener.onView(certDetails);
            }
        });

        thumbBox.add(lblThumb, BorderLayout.CENTER);
        add(thumbBox, BorderLayout.NORTH);

        // --- 2. Center Content (Metadata + Actions) ---
        JPanel centerContainer = new JPanel(new BorderLayout(0, 8));
        centerContainer.setOpaque(false);

        JPanel infoPanel = new JPanel();
        infoPanel.setLayout(new BoxLayout(infoPanel, BoxLayout.Y_AXIS));
        infoPanel.setOpaque(false);

        // Certificate Name
        String rawTitle = c.getCertificateName() != null ? c.getCertificateName() : "Untitled Certificate";
        JLabel lblTitle = new JLabel(rawTitle);
        lblTitle.setFont(DevTrackFonts.FORM_LABEL);
        lblTitle.setForeground(DevTrackColors.TEXT_PRIMARY);
        lblTitle.setAlignmentX(Component.LEFT_ALIGNMENT);
        lblTitle.setToolTipText(rawTitle);

        // Issuer Name
        String issuerStr = c.getIssuer() != null && !c.getIssuer().isBlank() ? c.getIssuer() : "Unknown Issuer";
        JLabel lblIssuer = new JLabel("Issued by: " + issuerStr);
        lblIssuer.setFont(DevTrackFonts.BODY);
        lblIssuer.setForeground(DevTrackColors.TEXT_SECONDARY);
        lblIssuer.setAlignmentX(Component.LEFT_ALIGNMENT);
        lblIssuer.setToolTipText(issuerStr);

        // Issue Date
        String dateFormatted = formatIssueDate(c.getIssueDate());
        JLabel lblDate = new JLabel("Issued: " + dateFormatted);
        lblDate.setFont(DevTrackFonts.CAPTION);
        lblDate.setForeground(DevTrackColors.TEXT_MUTED);
        lblDate.setAlignmentX(Component.LEFT_ALIGNMENT);

        infoPanel.add(lblTitle);
        infoPanel.add(Box.createRigidArea(new Dimension(0, 2)));
        infoPanel.add(lblIssuer);
        infoPanel.add(Box.createRigidArea(new Dimension(0, 2)));
        infoPanel.add(lblDate);

        // Optional Expiry Date
        if (c.getExpiryDate() != null) {
            JLabel lblExpiry = new JLabel("Expires: " + formatIssueDate(c.getExpiryDate()));
            lblExpiry.setFont(DevTrackFonts.CAPTION);
            lblExpiry.setForeground(DevTrackColors.TEXT_MUTED);
            lblExpiry.setAlignmentX(Component.LEFT_ALIGNMENT);
            infoPanel.add(Box.createRigidArea(new Dimension(0, 2)));
            infoPanel.add(lblExpiry);
        }

        // Optional Credential ID
        if (c.getCredentialId() != null && !c.getCredentialId().isBlank()) {
            JLabel lblCred = new JLabel("Credential ID: " + c.getCredentialId());
            lblCred.setFont(DevTrackFonts.CAPTION);
            lblCred.setForeground(DevTrackColors.TEXT_MUTED);
            lblCred.setAlignmentX(Component.LEFT_ALIGNMENT);
            infoPanel.add(Box.createRigidArea(new Dimension(0, 2)));
            infoPanel.add(lblCred);
        }

        centerContainer.add(infoPanel, BorderLayout.CENTER);

        // --- 3. Bottom Action Buttons ---
        JPanel actionBox = new JPanel(new FlowLayout(FlowLayout.RIGHT, 6, 0));
        actionBox.setOpaque(false);

        DTButton btnView = new DTButton("View", DTButton.ButtonType.SECONDARY);
        btnView.setPreferredSize(new Dimension(70, 36));
        btnView.addActionListener(e -> {
            if (actionListener != null) actionListener.onView(certDetails);
        });

        DTButton btnEdit = new DTButton("Edit", DTButton.ButtonType.SECONDARY);
        btnEdit.setPreferredSize(new Dimension(70, 36));
        btnEdit.addActionListener(e -> {
            if (actionListener != null) actionListener.onEdit(certDetails);
        });

        DTButton btnDelete = new DTButton("Delete", DTButton.ButtonType.DESTRUCTIVE);
        btnDelete.setPreferredSize(new Dimension(78, 36));
        btnDelete.addActionListener(e -> {
            if (actionListener != null) actionListener.onDelete(certDetails);
        });

        actionBox.add(btnView);
        actionBox.add(btnEdit);
        actionBox.add(btnDelete);

        centerContainer.add(actionBox, BorderLayout.SOUTH);
        add(centerContainer, BorderLayout.CENTER);
    }

    private String formatIssueDate(java.sql.Date date) {
        if (date == null) return "N/A";
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy");
            return sdf.format(date);
        } catch (Exception e) {
            return date.toString();
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();

        // Background Fill #EAEDF1
        g2.setColor(new Color(234, 237, 241));
        g2.fillRoundRect(1, 1, w - 3, h - 3, 8, 8);

        // Border (Hover vs Default)
        Color borderColor = isHovered ? new Color(216, 207, 192) : new Color(228, 222, 210);
        g2.setColor(borderColor);
        g2.setStroke(new BasicStroke(1.5f));
        g2.drawRoundRect(1, 1, w - 3, h - 3, 8, 8);

        g2.dispose();
        super.paintComponent(g);
    }
}
