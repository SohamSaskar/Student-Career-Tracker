package com.devtrack.ui.dialogs;

import com.devtrack.model.Certification;
import com.devtrack.model.CertificationDetails;
import com.devtrack.model.Skill;
import com.devtrack.ui.components.DTBadge;
import com.devtrack.ui.components.DTCard;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.net.URI;
import java.util.List;

/**
 * Modal dialog for displaying complete details of a student certification in Nordic Technical Dark theme.
 */
public class DTCertificationDetailsDialog extends JDialog {

    private final CertificationDetails certDetails;
    private Runnable onEditRequested;
    private Runnable onDeleteRequested;

    public DTCertificationDetailsDialog(Window parent, CertificationDetails certDetails, Runnable onEditRequested, Runnable onDeleteRequested) {
        super(parent, "Certification Details — DevTrack", ModalityType.APPLICATION_MODAL);
        this.certDetails = certDetails;
        this.onEditRequested = onEditRequested;
        this.onDeleteRequested = onDeleteRequested;

        initComponents();
    }

    private void initComponents() {
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setSize(650, 620);
        setLocationRelativeTo(getOwner());

        JPanel root = new JPanel(new BorderLayout(0, 20));
        root.setBackground(DevTrackColors.BG_PRIMARY);
        root.setBorder(new EmptyBorder(24, 24, 24, 24));

        Certification c = certDetails.getCertification();

        // --- Header Section ---
        JPanel headerPanel = new JPanel(new BorderLayout(12, 0));
        headerPanel.setOpaque(false);

        JPanel titleBox = new JPanel();
        titleBox.setLayout(new BoxLayout(titleBox, BoxLayout.Y_AXIS));
        titleBox.setOpaque(false);

        JLabel lblTitle = new JLabel(c.getCertificateName() != null ? c.getCertificateName() : "Untitled Certificate");
        lblTitle.setFont(DevTrackFonts.HEADING_2);
        lblTitle.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel lblIssuer = new JLabel("Issued by: " + (c.getIssuer() != null ? c.getIssuer() : "Unknown Organization"));
        lblIssuer.setFont(DevTrackFonts.BODY_SECONDARY);
        lblIssuer.setForeground(DevTrackColors.ACCENT_PRIMARY);

        titleBox.add(lblTitle);
        titleBox.add(Box.createRigidArea(new Dimension(0, 4)));
        titleBox.add(lblIssuer);
        headerPanel.add(titleBox, BorderLayout.CENTER);

        root.add(headerPanel, BorderLayout.NORTH);

        // --- Main Content Area ---
        JPanel mainContent = new JPanel();
        mainContent.setLayout(new BoxLayout(mainContent, BoxLayout.Y_AXIS));
        mainContent.setOpaque(false);

        // Dates Info Card
        DTCard datesCard = new DTCard();
        datesCard.setLayout(new GridLayout(1, 2, 16, 0));

        JPanel issueBox = createDetailItem("ISSUE DATE", c.getIssueDate() != null ? c.getIssueDate().toString() : "Not specified");
        JPanel expiryBox = createDetailItem("EXPIRY DATE", c.getExpiryDate() != null ? c.getExpiryDate().toString() : "No Expiry / Lifetime");

        datesCard.add(issueBox);
        datesCard.add(expiryBox);
        mainContent.add(datesCard);
        mainContent.add(Box.createRigidArea(new Dimension(0, 16)));

        // Credential Verification Card
        DTCard credCard = new DTCard();
        credCard.setLayout(new GridLayout(1, 2, 16, 0));

        JPanel credIdBox = createDetailItem("CREDENTIAL ID", c.getCredentialId() != null && !c.getCredentialId().isBlank() ? c.getCredentialId() : "Not specified");
        JPanel credUrlBox = createLinkItem("VERIFICATION URL", c.getCredentialUrl());

        credCard.add(credIdBox);
        credCard.add(credUrlBox);
        mainContent.add(credCard);
        mainContent.add(Box.createRigidArea(new Dimension(0, 16)));

        // Verified Skills Card
        DTCard skillsCard = new DTCard();
        skillsCard.setLayout(new BorderLayout(0, 10));

        JLabel lblSkillsTitle = new JLabel("VERIFIED / DEMONSTRATED SKILLS");
        lblSkillsTitle.setFont(DevTrackFonts.CAPTION);
        lblSkillsTitle.setForeground(DevTrackColors.TEXT_MUTED);
        skillsCard.add(lblSkillsTitle, BorderLayout.NORTH);

        List<Skill> skills = certDetails.getSkills();
        if (skills == null || skills.isEmpty()) {
            JLabel lblNoSkills = new JLabel("No specific skills tagged for this certification.");
            lblNoSkills.setFont(DevTrackFonts.BODY_SMALL);
            lblNoSkills.setForeground(DevTrackColors.TEXT_MUTED);
            skillsCard.add(lblNoSkills, BorderLayout.CENTER);
        } else {
            JPanel skillsFlow = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 8));
            skillsFlow.setOpaque(false);
            for (Skill s : skills) {
                skillsFlow.add(new DTBadge(s.getSkillName()));
            }
            skillsCard.add(skillsFlow, BorderLayout.CENTER);
        }
        mainContent.add(skillsCard);
        mainContent.add(Box.createRigidArea(new Dimension(0, 16)));

        // Certificate File Document Card
        DTCard fileCard = new DTCard();
        fileCard.setLayout(new BorderLayout(0, 8));

        JLabel lblFileTitle = new JLabel("ATTACHED CERTIFICATE DOCUMENT / IMAGE");
        lblFileTitle.setFont(DevTrackFonts.CAPTION);
        lblFileTitle.setForeground(DevTrackColors.TEXT_MUTED);
        fileCard.add(lblFileTitle, BorderLayout.NORTH);

        String filePath = c.getCertificateFile();
        if (filePath == null || filePath.isBlank()) {
            JLabel lblNoFile = new JLabel("No local document or image attached.");
            lblNoFile.setFont(DevTrackFonts.BODY_SMALL);
            lblNoFile.setForeground(DevTrackColors.TEXT_MUTED);
            fileCard.add(lblNoFile, BorderLayout.CENTER);
        } else {
            java.io.File file = new java.io.File(filePath);
            JPanel fileBox = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
            fileBox.setOpaque(false);

            JLabel lblFileName = new JLabel("📄 " + file.getName());
            lblFileName.setFont(DevTrackFonts.BODY_BOLD);
            lblFileName.setForeground(DevTrackColors.TEXT_PRIMARY);

            JButton btnOpenFile = new JButton("Open Document");
            btnOpenFile.setFont(DevTrackFonts.BODY_SMALL);
            btnOpenFile.setForeground(DevTrackColors.TEXT_PRIMARY);
            btnOpenFile.setBackground(DevTrackColors.ACCENT_PRIMARY);
            btnOpenFile.setFocusPainted(false);
            btnOpenFile.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
            btnOpenFile.addActionListener(e -> openLocalFile(filePath));

            fileBox.add(lblFileName);
            fileBox.add(btnOpenFile);

            fileCard.add(fileBox, BorderLayout.CENTER);
        }
        mainContent.add(fileCard);

        JScrollPane scrollPane = new JScrollPane(mainContent);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.setBorder(null);
        scrollPane.getVerticalScrollBar().setUnitIncrement(12);

        root.add(scrollPane, BorderLayout.CENTER);

        // --- Bottom Actions ---
        JPanel bottomBar = new JPanel(new BorderLayout());
        bottomBar.setOpaque(false);

        JPanel leftActions = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        leftActions.setOpaque(false);

        JButton btnDelete = new JButton("Delete Certification");
        btnDelete.setFont(DevTrackFonts.BUTTON);
        btnDelete.setForeground(DevTrackColors.ACCENT_ERROR);
        btnDelete.setBackground(DevTrackColors.BG_CARD);
        btnDelete.setFocusPainted(false);
        btnDelete.addActionListener(e -> {
            dispose();
            if (onDeleteRequested != null) {
                onDeleteRequested.run();
            }
        });
        leftActions.add(btnDelete);

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        JButton btnEdit = new JButton("Edit Certification");
        btnEdit.setFont(DevTrackFonts.BUTTON);
        btnEdit.setForeground(DevTrackColors.TEXT_PRIMARY);
        btnEdit.setBackground(DevTrackColors.BG_SURFACE);
        btnEdit.setFocusPainted(false);
        btnEdit.addActionListener(e -> {
            dispose();
            if (onEditRequested != null) {
                onEditRequested.run();
            }
        });

        JButton btnClose = new JButton("Close");
        btnClose.setFont(DevTrackFonts.BUTTON);
        btnClose.setForeground(DevTrackColors.TEXT_PRIMARY);
        btnClose.setBackground(DevTrackColors.ACCENT_PRIMARY);
        btnClose.setFocusPainted(false);
        btnClose.addActionListener(e -> dispose());

        rightActions.add(btnEdit);
        rightActions.add(btnClose);

        bottomBar.add(leftActions, BorderLayout.WEST);
        bottomBar.add(rightActions, BorderLayout.EAST);

        root.add(bottomBar, BorderLayout.SOUTH);

        setContentPane(root);
    }

    private JPanel createDetailItem(String label, String value) {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BoxLayout(pnl, BoxLayout.Y_AXIS));
        pnl.setOpaque(false);

        JLabel lbl = new JLabel(label);
        lbl.setFont(DevTrackFonts.CAPTION);
        lbl.setForeground(DevTrackColors.TEXT_MUTED);

        JLabel val = new JLabel(value);
        val.setFont(DevTrackFonts.BODY_BOLD);
        val.setForeground(DevTrackColors.TEXT_PRIMARY);

        pnl.add(lbl);
        pnl.add(Box.createRigidArea(new Dimension(0, 4)));
        pnl.add(val);
        return pnl;
    }

    private JPanel createLinkItem(String label, String url) {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BoxLayout(pnl, BoxLayout.Y_AXIS));
        pnl.setOpaque(false);

        JLabel lbl = new JLabel(label);
        lbl.setFont(DevTrackFonts.CAPTION);
        lbl.setForeground(DevTrackColors.TEXT_MUTED);

        pnl.add(lbl);
        pnl.add(Box.createRigidArea(new Dimension(0, 4)));

        if (url == null || url.isBlank()) {
            JLabel val = new JLabel("Not provided");
            val.setFont(DevTrackFonts.BODY_SMALL);
            val.setForeground(DevTrackColors.TEXT_MUTED);
            pnl.add(val);
        } else {
            JLabel linkLabel = new JLabel("<html><a href='" + url + "'>" + truncateUrl(url) + "</a></html>");
            linkLabel.setFont(DevTrackFonts.BODY_SMALL);
            linkLabel.setForeground(DevTrackColors.ACCENT_PRIMARY);
            linkLabel.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
            linkLabel.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    openWebpage(url);
                }
            });
            pnl.add(linkLabel);
        }
        return pnl;
    }

    private String truncateUrl(String url) {
        if (url.length() > 30) {
            return url.substring(0, 27) + "...";
        }
        return url;
    }

    private void openWebpage(String urlString) {
        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(urlString));
            }
        } catch (Exception ex) {
            DTAlert.showError(this, "Browser Error", "Could not open browser for URL: " + urlString);
        }
    }

    private void openLocalFile(String filePath) {
        try {
            java.io.File file = new java.io.File(filePath);
            if (file.exists() && Desktop.isDesktopSupported()) {
                Desktop.getDesktop().open(file);
            } else {
                DTAlert.showError(this, "File Error", "File does not exist at path: " + filePath);
            }
        } catch (Exception ex) {
            DTAlert.showError(this, "File Error", "Could not open file: " + ex.getMessage());
        }
    }
}
