package com.devtrack.ui.dialogs;

import com.devtrack.model.Certification;
import com.devtrack.model.CertificationDetails;
import com.devtrack.service.CertificationService;
import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.components.DTTextField;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.CertificateThumbnailGenerator;
import com.devtrack.util.FileStorageUtil;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.io.File;
import java.text.SimpleDateFormat;

/**
 * Compact Add / Edit Certification modal form dialog featuring instant thumbnail preview upon file selection,
 * Change File & Remove File actions, format validation, relative file storage, and polished input alignment.
 */
public class DTCertificationFormDialog extends JDialog {

    public interface OnCertificationSavedListener {
        void onCertificationSaved();
    }

    private final int studentId;
    private final CertificationDetails existingCertDetails;
    private final CertificationService certService;
    private final OnCertificationSavedListener savedListener;

    private DTTextField nameField;
    private DTTextField issuerField;
    private DTTextField issueDateField;
    private DTTextField expiryDateField;
    private DTTextField credIdField;
    private DTTextField credUrlField;

    // File selection state
    private File selectedNewFile = null;
    private String existingFilePath = null;
    private boolean isFileRemoved = false;

    // Upload UI components
    private JPanel uploadContainerPanel;
    private JPanel selectUploadCard;
    private JPanel selectedPreviewPanel;
    private JLabel lblPreviewThumb;
    private JLabel lblSelectedFileName;

    public DTCertificationFormDialog(Window parentWindow, CertificationDetails existingCertDetails, OnCertificationSavedListener savedListener) {
        super(parentWindow instanceof Frame ? (Frame) parentWindow : (Frame) SwingUtilities.getWindowAncestor(parentWindow),
                existingCertDetails == null ? "Add Certificate" : "Edit Certificate", ModalityType.APPLICATION_MODAL);
        this.studentId = SessionManager.getInstance().getCurrentStudentId();
        this.existingCertDetails = existingCertDetails;
        this.certService = new CertificationService();
        this.savedListener = savedListener;

        if (existingCertDetails != null && existingCertDetails.getCertification() != null) {
            this.existingFilePath = existingCertDetails.getCertification().getCertificateFile();
        }

        setSize(520, 640);
        setResizable(false);
        setLocationRelativeTo(parentWindow);
        initUI();
    }

    private void initUI() {
        JPanel mainPanel = new JPanel(new BorderLayout(0, 16));
        mainPanel.setBackground(DevTrackColors.BG_SURFACE);
        mainPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(228, 222, 210), 1),
                new EmptyBorder(20, 24, 20, 24)
        ));

        Certification existing = existingCertDetails != null ? existingCertDetails.getCertification() : null;

        // Header Title
        JLabel titleLabel = new JLabel(existing == null ? "+ Add Certificate" : "Edit Certificate");
        titleLabel.setFont(DevTrackFonts.HEADING_2);
        titleLabel.setForeground(DevTrackColors.TEXT_PRIMARY);

        mainPanel.add(titleLabel, BorderLayout.NORTH);

        // Form Fields Container
        JPanel formContainer = new JPanel();
        formContainer.setLayout(new BoxLayout(formContainer, BoxLayout.Y_AXIS));
        formContainer.setOpaque(false);

        // Certificate Name
        nameField = new DTTextField(existing != null ? existing.getCertificateName() : "", 30);
        nameField.setPlaceholder("e.g., AWS Certified Developer");
        formContainer.add(createFormField("Certificate Name *", nameField));
        formContainer.add(Box.createVerticalStrut(12));

        // Issuer
        issuerField = new DTTextField(existing != null ? existing.getIssuer() : "", 30);
        issuerField.setPlaceholder("e.g., Amazon Web Services / Coursera / Forage");
        formContainer.add(createFormField("Issuer *", issuerField));
        formContainer.add(Box.createVerticalStrut(12));

        // Dates Row
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String issueStr = (existing != null && existing.getIssueDate() != null) ? sdf.format(existing.getIssueDate()) : "";
        String expiryStr = (existing != null && existing.getExpiryDate() != null) ? sdf.format(existing.getExpiryDate()) : "";

        JPanel datesRow = new JPanel(new GridLayout(1, 2, 12, 0));
        datesRow.setOpaque(false);

        issueDateField = new DTTextField(issueStr, 15);
        issueDateField.setPlaceholder("YYYY-MM-DD");
        datesRow.add(createFormField("Issue Date", issueDateField));

        expiryDateField = new DTTextField(expiryStr, 15);
        expiryDateField.setPlaceholder("YYYY-MM-DD (optional)");
        datesRow.add(createFormField("Expiry Date (optional)", expiryDateField));

        datesRow.setAlignmentX(Component.LEFT_ALIGNMENT);
        datesRow.setMaximumSize(new Dimension(Integer.MAX_VALUE, 60));
        formContainer.add(datesRow);
        formContainer.add(Box.createVerticalStrut(12));

        // Credential ID and URL Row
        JPanel credsRow = new JPanel(new GridLayout(1, 2, 12, 0));
        credsRow.setOpaque(false);

        credIdField = new DTTextField(existing != null && existing.getCredentialId() != null ? existing.getCredentialId() : "", 20);
        credIdField.setPlaceholder("e.g., AWS-1029384 (optional)");
        credsRow.add(createFormField("Credential ID (optional)", credIdField));

        credUrlField = new DTTextField(existing != null && existing.getCredentialUrl() != null ? existing.getCredentialUrl() : "", 20);
        credUrlField.setPlaceholder("https://... (optional)");
        credsRow.add(createFormField("Credential URL (optional)", credUrlField));

        credsRow.setAlignmentX(Component.LEFT_ALIGNMENT);
        credsRow.setMaximumSize(new Dimension(Integer.MAX_VALUE, 60));
        formContainer.add(credsRow);
        formContainer.add(Box.createVerticalStrut(16));

        // File Upload Section (Left-aligned)
        JLabel lblFileHeader = new JLabel("Certificate File");
        lblFileHeader.setFont(DevTrackFonts.FORM_LABEL);
        lblFileHeader.setForeground(DevTrackColors.TEXT_PRIMARY);
        lblFileHeader.setAlignmentX(Component.LEFT_ALIGNMENT);
        lblFileHeader.setMaximumSize(new Dimension(Integer.MAX_VALUE, 24));

        formContainer.add(lblFileHeader);
        formContainer.add(Box.createVerticalStrut(6));

        uploadContainerPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        uploadContainerPanel.setOpaque(false);
        uploadContainerPanel.setAlignmentX(Component.LEFT_ALIGNMENT);

        buildUploadComponents();
        formContainer.add(uploadContainerPanel);

        JScrollPane scrollPane = new JScrollPane(formContainer);
        scrollPane.setBorder(null);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);

        mainPanel.add(scrollPane, BorderLayout.CENTER);

        // Footer Action Buttons
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        footer.setOpaque(false);

        DTButton btnCancel = new DTButton("Cancel", DTButton.ButtonType.SECONDARY);
        btnCancel.setPreferredSize(new Dimension(100, 38));
        btnCancel.addActionListener(e -> dispose());

        DTButton btnSave = new DTButton("Save Certificate", DTButton.ButtonType.PRIMARY);
        btnSave.setPreferredSize(new Dimension(150, 38));
        btnSave.addActionListener(e -> saveCertificate());

        footer.add(btnCancel);
        footer.add(btnSave);

        mainPanel.add(footer, BorderLayout.SOUTH);
        setContentPane(mainPanel);

        updateUploadUIState();
    }

    private void buildUploadComponents() {
        // 1. Small Select Certificate Card (195px x 90px)
        selectUploadCard = new JPanel();
        selectUploadCard.setLayout(new BoxLayout(selectUploadCard, BoxLayout.Y_AXIS));
        selectUploadCard.setPreferredSize(new Dimension(195, 90));
        selectUploadCard.setMaximumSize(new Dimension(195, 90));
        selectUploadCard.setBackground(new Color(243, 240, 234)); // Warm #F3F0EA surface
        selectUploadCard.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(228, 222, 210), 1),
                new EmptyBorder(10, 12, 10, 12)
        ));
        selectUploadCard.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        JLabel lblAddIcon = new JLabel("+ Select File");
        lblAddIcon.setFont(DevTrackFonts.BODY_BOLD);
        lblAddIcon.setForeground(DevTrackColors.ACCENT_PRIMARY);
        lblAddIcon.setAlignmentX(Component.LEFT_ALIGNMENT);
        lblAddIcon.setMaximumSize(new Dimension(Integer.MAX_VALUE, 24));

        JLabel lblTypes = new JLabel("PDF / JPG / PNG");
        lblTypes.setFont(DevTrackFonts.CAPTION);
        lblTypes.setForeground(DevTrackColors.TEXT_MUTED);
        lblTypes.setAlignmentX(Component.LEFT_ALIGNMENT);

        selectUploadCard.add(Box.createVerticalGlue());
        selectUploadCard.add(lblAddIcon);
        selectUploadCard.add(Box.createRigidArea(new Dimension(0, 4)));
        selectUploadCard.add(lblTypes);
        selectUploadCard.add(Box.createVerticalGlue());

        selectUploadCard.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                chooseCertificateFile();
            }
        });

        // 2. Immediate Thumbnail Preview Panel
        selectedPreviewPanel = new JPanel(new BorderLayout(12, 0));
        selectedPreviewPanel.setBackground(new Color(243, 240, 234));
        selectedPreviewPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(228, 222, 210), 1),
                new EmptyBorder(8, 10, 8, 12)
        ));

        // Thumbnail image label (110px x 85px)
        lblPreviewThumb = new JLabel();
        lblPreviewThumb.setPreferredSize(new Dimension(110, 85));
        lblPreviewThumb.setHorizontalAlignment(SwingConstants.CENTER);
        lblPreviewThumb.setVerticalAlignment(SwingConstants.CENTER);
        lblPreviewThumb.setBorder(BorderFactory.createLineBorder(new Color(228, 222, 210), 1));

        JPanel rightDetails = new JPanel();
        rightDetails.setLayout(new BoxLayout(rightDetails, BoxLayout.Y_AXIS));
        rightDetails.setOpaque(false);

        lblSelectedFileName = new JLabel();
        lblSelectedFileName.setFont(DevTrackFonts.BODY_BOLD);
        lblSelectedFileName.setForeground(DevTrackColors.TEXT_PRIMARY);

        JPanel btnBox = new JPanel(new FlowLayout(FlowLayout.LEFT, 6, 0));
        btnBox.setOpaque(false);

        DTButton btnChange = new DTButton("Change File", DTButton.ButtonType.SECONDARY);
        btnChange.setPreferredSize(new Dimension(100, 30));
        btnChange.addActionListener(e -> chooseCertificateFile());

        DTButton btnRemove = new DTButton("Remove", DTButton.ButtonType.DESTRUCTIVE);
        btnRemove.setPreferredSize(new Dimension(85, 30));
        btnRemove.addActionListener(e -> removeSelectedFile());

        btnBox.add(btnChange);
        btnBox.add(btnRemove);

        rightDetails.add(Box.createVerticalGlue());
        rightDetails.add(lblSelectedFileName);
        rightDetails.add(Box.createRigidArea(new Dimension(0, 8)));
        rightDetails.add(btnBox);
        rightDetails.add(Box.createVerticalGlue());

        selectedPreviewPanel.add(lblPreviewThumb, BorderLayout.WEST);
        selectedPreviewPanel.add(rightDetails, BorderLayout.CENTER);
    }

    private void updateUploadUIState() {
        uploadContainerPanel.removeAll();

        if (selectedNewFile != null) {
            lblSelectedFileName.setText(selectedNewFile.getName());
            ImageIcon icon = CertificateThumbnailGenerator.getThumbnail(selectedNewFile.getAbsolutePath(), 108, 83);
            lblPreviewThumb.setIcon(icon);
            uploadContainerPanel.add(selectedPreviewPanel);

        } else if (!isFileRemoved && existingFilePath != null && !existingFilePath.isBlank()) {
            File existingFile = FileStorageUtil.resolveFile(existingFilePath);
            String nameToShow = existingFile != null ? existingFile.getName() : "Attached File";
            lblSelectedFileName.setText(nameToShow);

            ImageIcon icon = CertificateThumbnailGenerator.getThumbnail(existingFilePath, 108, 83);
            lblPreviewThumb.setIcon(icon);
            uploadContainerPanel.add(selectedPreviewPanel);

        } else {
            uploadContainerPanel.add(selectUploadCard);
        }

        uploadContainerPanel.revalidate();
        uploadContainerPanel.repaint();
    }

    private void chooseCertificateFile() {
        JFileChooser chooser = new JFileChooser();
        chooser.setDialogTitle("Select Certificate Document or Image");
        chooser.setFileFilter(new FileNameExtensionFilter("Certificates (*.pdf, *.png, *.jpg, *.jpeg)", "pdf", "png", "jpg", "jpeg"));

        int choice = chooser.showOpenDialog(this);
        if (choice == JFileChooser.APPROVE_OPTION) {
            File chosen = chooser.getSelectedFile();
            if (chosen != null && chosen.exists()) {
                String ext = FileStorageUtil.getFileExtension(chosen.getName()).toLowerCase();
                if (!ext.equals("pdf") && !ext.equals("png") && !ext.equals("jpg") && !ext.equals("jpeg")) {
                    JOptionPane.showMessageDialog(this, "Unsupported file format. Please choose a PDF, PNG, JPG, or JPEG file.", "Invalid File", JOptionPane.WARNING_MESSAGE);
                    return;
                }
                this.selectedNewFile = chosen;
                this.isFileRemoved = false;
                updateUploadUIState();
            }
        }
    }

    private void removeSelectedFile() {
        this.selectedNewFile = null;
        this.isFileRemoved = true;
        updateUploadUIState();
    }

    private JPanel createFormField(String labelText, JComponent inputComponent) {
        JPanel p = new JPanel(new BorderLayout(0, 4));
        p.setOpaque(false);
        p.setAlignmentX(Component.LEFT_ALIGNMENT);

        JLabel lbl = new JLabel(labelText);
        lbl.setFont(DevTrackFonts.CAPTION);
        lbl.setForeground(DevTrackColors.TEXT_SECONDARY);

        p.add(lbl, BorderLayout.NORTH);
        p.add(inputComponent, BorderLayout.CENTER);

        int targetH = 22 + inputComponent.getPreferredSize().height;
        p.setPreferredSize(new Dimension(p.getPreferredSize().width, targetH));
        p.setMaximumSize(new Dimension(Integer.MAX_VALUE, targetH));

        return p;
    }

    private void saveCertificate() {
        String certName = nameField.getText().trim();
        String issuer = issuerField.getText().trim();
        String issueStr = issueDateField.getText().trim();
        String expiryStr = expiryDateField.getText().trim();
        String credId = credIdField.getText().trim();
        String credUrl = credUrlField.getText().trim();

        if (certName.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Certificate Name is required.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        if (issuer.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Issuer is required.", "Validation Error", JOptionPane.WARNING_MESSAGE);
            return;
        }

        String finalFilePath = null;

        if (selectedNewFile != null) {
            FileStorageUtil.FileUploadResult uploadResult = FileStorageUtil.saveCertificateFile(selectedNewFile);
            if (!uploadResult.isSuccess()) {
                JOptionPane.showMessageDialog(this, uploadResult.getMessage(), "File Upload Error", JOptionPane.ERROR_MESSAGE);
                return;
            }
            finalFilePath = uploadResult.getRelativePath();
        } else if (!isFileRemoved) {
            finalFilePath = existingFilePath;
        } else {
            finalFilePath = null;
        }

        CertificationService.CertificationResult res;
        if (existingCertDetails == null) {
            res = certService.createCertification(studentId, certName, issuer, issueStr, expiryStr, credId, credUrl, finalFilePath, null);
        } else {
            int certId = existingCertDetails.getCertification().getCertificationId();
            res = certService.updateCertification(studentId, certId, certName, issuer, issueStr, expiryStr, credId, credUrl, finalFilePath, null);
        }

        if (res.isSuccess()) {
            dispose();
            if (savedListener != null) {
                savedListener.onCertificationSaved();
            }
        } else {
            JOptionPane.showMessageDialog(this, res.getMessage(), "Validation Error", JOptionPane.WARNING_MESSAGE);
        }
    }
}
