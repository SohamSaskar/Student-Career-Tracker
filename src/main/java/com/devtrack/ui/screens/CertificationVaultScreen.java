package com.devtrack.ui.screens;

import com.devtrack.model.Certification;
import com.devtrack.model.CertificationDetails;
import com.devtrack.service.CertificationService;
import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.components.DTCertificateCard;
import com.devtrack.ui.components.DTSearchField;
import com.devtrack.ui.dialogs.DTCertificationFormDialog;
import com.devtrack.ui.dialogs.DTCertificationPreviewDialog;
import com.devtrack.ui.dialogs.DTConfirmDialog;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Certification Vault Screen for DevTrack Application.
 * Displays certificates in a clean responsive grid using custom DT components.
 */
public class CertificationVaultScreen extends JPanel implements DTCertificateCard.CertificateCardActionListener {

    private final CertificationService certService;
    private List<CertificationDetails> allCertifications;
    private String searchQuery = "";
    private String selectedFilter = "ALL";

    private JPanel gridContainer;
    private DTSearchField searchField;
    private JPanel filterBarPanel;

    public CertificationVaultScreen() {
        this.certService = new CertificationService();
        this.allCertifications = new ArrayList<>();

        setLayout(new BorderLayout(0, 16));
        setBackground(DevTrackColors.BG_PRIMARY);
        setBorder(new EmptyBorder(24, 28, 24, 28));

        initScreenUI();
        loadCertifications();
    }

    private void initScreenUI() {
        // --- 1. Top Header ---
        JPanel topHeader = new JPanel(new BorderLayout(16, 0));
        topHeader.setOpaque(false);

        JPanel titlePanel = new JPanel();
        titlePanel.setLayout(new BoxLayout(titlePanel, BoxLayout.Y_AXIS));
        titlePanel.setOpaque(false);

        JLabel lblTitle = new JLabel("Certification Vault");
        lblTitle.setFont(DevTrackFonts.PAGE_TITLE);
        lblTitle.setForeground(DevTrackColors.TEXT_PRIMARY);

        JLabel lblSub = new JLabel("Keep track of your certifications and achievements.");
        lblSub.setFont(DevTrackFonts.BODY_SECONDARY);
        lblSub.setForeground(DevTrackColors.TEXT_SECONDARY);

        titlePanel.add(lblTitle);
        titlePanel.add(Box.createRigidArea(new Dimension(0, 4)));
        titlePanel.add(lblSub);

        DTButton btnAddCert = new DTButton("+ Add Certification", DTButton.ButtonType.PRIMARY);
        btnAddCert.setPreferredSize(new Dimension(175, 40));
        btnAddCert.addActionListener(e -> openAddCertificateDialog());

        topHeader.add(titlePanel, BorderLayout.CENTER);
        topHeader.add(btnAddCert, BorderLayout.EAST);

        // --- 2. Filter and Search Toolbar ---
        JPanel toolbar = new JPanel(new BorderLayout(12, 0));
        toolbar.setOpaque(false);

        filterBarPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        filterBarPanel.setOpaque(false);
        rebuildFilterButtons();

        searchField = new DTSearchField("Search certifications...");
        searchField.setPreferredSize(new Dimension(280, 38));
        searchField.getDocument().addDocumentListener(new DocumentListener() {
            @Override
            public void insertUpdate(DocumentEvent e) { updateSearch(); }
            @Override
            public void removeUpdate(DocumentEvent e) { updateSearch(); }
            @Override
            public void changedUpdate(DocumentEvent e) { updateSearch(); }
        });

        toolbar.add(filterBarPanel, BorderLayout.WEST);
        toolbar.add(searchField, BorderLayout.EAST);

        JPanel northContainer = new JPanel();
        northContainer.setLayout(new BoxLayout(northContainer, BoxLayout.Y_AXIS));
        northContainer.setOpaque(false);
        northContainer.add(topHeader);
        northContainer.add(Box.createRigidArea(new Dimension(0, 16)));
        northContainer.add(toolbar);

        add(northContainer, BorderLayout.NORTH);

        // --- 3. Grid Scroll Container ---
        gridContainer = new JPanel();
        gridContainer.setOpaque(false);

        JScrollPane scrollPane = new JScrollPane(gridContainer);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.setBorder(null);
        scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        scrollPane.getVerticalScrollBar().setUnitIncrement(16);

        add(scrollPane, BorderLayout.CENTER);
    }

    private void rebuildFilterButtons() {
        filterBarPanel.removeAll();
        String[] filters = {"ALL", "ACTIVE", "EXPIRED"};

        for (String filter : filters) {
            boolean isSelected = filter.equalsIgnoreCase(selectedFilter);
            String label = filter.equals("ALL") ? "All" : filter.substring(0, 1) + filter.substring(1).toLowerCase();

            DTButton btn = new DTButton(label, isSelected ? DTButton.ButtonType.PRIMARY : DTButton.ButtonType.SECONDARY);
            btn.setPreferredSize(new Dimension(85, 36));

            btn.addActionListener(e -> {
                selectedFilter = filter;
                rebuildFilterButtons();
                filterBarPanel.revalidate();
                filterBarPanel.repaint();
                renderGrid();
            });

            filterBarPanel.add(btn);
        }
    }

    private void updateSearch() {
        this.searchQuery = searchField.getText().trim().toLowerCase();
        if ("search certifications...".equalsIgnoreCase(this.searchQuery)) {
            this.searchQuery = "";
        }
        renderGrid();
    }

    public void loadCertifications() {
        try {
            allCertifications = certService.getCertificationsForCurrentStudent();
            renderGrid();
        } catch (Exception ex) {
            // Logged silently
        }
    }

    private boolean isExpired(Certification c) {
        if (c.getExpiryDate() == null) return false;
        java.sql.Date today = new java.sql.Date(System.currentTimeMillis());
        return c.getExpiryDate().before(today);
    }

    private void renderGrid() {
        gridContainer.removeAll();

        List<CertificationDetails> filtered = allCertifications.stream().filter(cd -> {
            Certification c = cd.getCertification();
            boolean expired = isExpired(c);

            if ("ACTIVE".equalsIgnoreCase(selectedFilter) && expired) return false;
            if ("EXPIRED".equalsIgnoreCase(selectedFilter) && !expired) return false;

            if (!searchQuery.isBlank()) {
                boolean nameMatch = c.getCertificateName() != null && c.getCertificateName().toLowerCase().contains(searchQuery);
                boolean issuerMatch = c.getIssuer() != null && c.getIssuer().toLowerCase().contains(searchQuery);
                boolean credMatch = c.getCredentialId() != null && c.getCredentialId().toLowerCase().contains(searchQuery);
                if (!nameMatch && !issuerMatch && !credMatch) return false;
            }
            return true;
        }).collect(Collectors.toList());

        if (filtered.isEmpty()) {
            gridContainer.setLayout(new BorderLayout());
            gridContainer.add(createEmptyStatePanel(), BorderLayout.CENTER);
        } else {
            gridContainer.setLayout(new BorderLayout());

            int cols = (getWidth() > 900 || getWidth() == 0) ? 3 : 2;
            JPanel grid = new JPanel(new GridLayout(0, cols, 16, 16));
            grid.setOpaque(false);

            for (CertificationDetails cd : filtered) {
                grid.add(new DTCertificateCard(cd, this));
            }

            gridContainer.add(grid, BorderLayout.NORTH);
        }

        gridContainer.revalidate();
        gridContainer.repaint();
    }

    private JPanel createEmptyStatePanel() {
        JPanel emptyPanel = new JPanel(new GridBagLayout());
        emptyPanel.setOpaque(false);
        emptyPanel.setBorder(new EmptyBorder(40, 20, 40, 20));

        JPanel inner = new JPanel();
        inner.setLayout(new BoxLayout(inner, BoxLayout.Y_AXIS));
        inner.setOpaque(false);

        JLabel lblEmptyTitle = new JLabel("No certificates added yet.");
        lblEmptyTitle.setFont(DevTrackFonts.HEADING_2);
        lblEmptyTitle.setForeground(DevTrackColors.TEXT_PRIMARY);
        lblEmptyTitle.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel lblEmptySub = new JLabel("Add your certificates to keep your achievements organized in one place.");
        lblEmptySub.setFont(DevTrackFonts.BODY_SECONDARY);
        lblEmptySub.setForeground(DevTrackColors.TEXT_SECONDARY);
        lblEmptySub.setAlignmentX(Component.CENTER_ALIGNMENT);

        DTButton btnAddFirst = new DTButton("+ Add Certification", DTButton.ButtonType.PRIMARY);
        btnAddFirst.setPreferredSize(new Dimension(190, 42));
        btnAddFirst.setMaximumSize(new Dimension(190, 42));
        btnAddFirst.setAlignmentX(Component.CENTER_ALIGNMENT);
        btnAddFirst.addActionListener(e -> openAddCertificateDialog());

        inner.add(lblEmptyTitle);
        inner.add(Box.createRigidArea(new Dimension(0, 8)));
        inner.add(lblEmptySub);
        inner.add(Box.createRigidArea(new Dimension(0, 20)));
        inner.add(btnAddFirst);

        emptyPanel.add(inner);
        return emptyPanel;
    }

    private void openAddCertificateDialog() {
        Window parentWindow = SwingUtilities.getWindowAncestor(this);
        DTCertificationFormDialog dialog = new DTCertificationFormDialog(parentWindow, null, this::loadCertifications);
        dialog.setVisible(true);
    }

    // --- DTCertificateCard Action Handlers ---

    @Override
    public void onView(CertificationDetails details) {
        Window parentWindow = SwingUtilities.getWindowAncestor(this);
        DTCertificationPreviewDialog previewDialog = new DTCertificationPreviewDialog(parentWindow, details);
        previewDialog.setVisible(true);
    }

    @Override
    public void onEdit(CertificationDetails details) {
        Window parentWindow = SwingUtilities.getWindowAncestor(this);
        DTCertificationFormDialog dialog = new DTCertificationFormDialog(parentWindow, details, this::loadCertifications);
        dialog.setVisible(true);
    }

    @Override
    public void onDelete(CertificationDetails details) {
        Window parentWindow = SwingUtilities.getWindowAncestor(this);
        Certification c = details.getCertification();

        boolean confirmed = DTConfirmDialog.show(
                parentWindow,
                "Delete Certification?",
                "This action cannot be undone.\n\n" + c.getCertificateName()
        );

        if (confirmed) {
            try {
                int studentId = SessionManager.getInstance().getCurrentStudentId();
                boolean success = certService.deleteCertification(c.getCertificationId(), studentId);
                if (success) {
                    loadCertifications();
                }
            } catch (Exception ex) {
                // Logged silently
            }
        }
    }
}
