package com.devtrack.ui.screens;

import com.devtrack.model.Project;
import com.devtrack.model.ProjectDetails;
import com.devtrack.service.ProjectService;
import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.components.DTProjectCard;
import com.devtrack.ui.components.DTSearchField;
import com.devtrack.ui.components.DTToast;
import com.devtrack.ui.dialogs.DTConfirmDialog;
import com.devtrack.ui.dialogs.DTProjectFormDialog;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import java.awt.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Redesigned Project Vault Screen for DevTrack Application.
 * Displays student software projects in clean, full-width horizontal cards.
 */
public class ProjectVaultScreen extends JPanel implements DTProjectCard.ProjectCardActionListener {

    private final ProjectService projectService;
    private List<ProjectDetails> allProjects;
    private String searchQuery = "";

    private JPanel cardsStackContainer;
    private DTSearchField searchField;

    public ProjectVaultScreen() {
        this.projectService = new ProjectService();
        this.allProjects = new ArrayList<>();

        setLayout(new BorderLayout(0, 16));
        setBackground(new Color(250, 249, 246)); // Page background #FAF9F6
        setBorder(new EmptyBorder(24, 28, 24, 28));

        initScreenUI();
        loadProjects();
    }

    private void initScreenUI() {
        // --- 1. Top Header ---
        JPanel topHeader = new JPanel(new BorderLayout(16, 0));
        topHeader.setOpaque(false);

        JPanel titlePanel = new JPanel();
        titlePanel.setLayout(new BoxLayout(titlePanel, BoxLayout.Y_AXIS));
        titlePanel.setOpaque(false);

        JLabel lblTitle = new JLabel("Project Vault");
        lblTitle.setFont(DevTrackFonts.PAGE_TITLE);
        lblTitle.setForeground(new Color(34, 30, 26)); // #221E1A
        lblTitle.setAlignmentX(Component.LEFT_ALIGNMENT);
        lblTitle.setMaximumSize(new Dimension(Integer.MAX_VALUE, 30));

        JLabel lblSub = new JLabel("Manage the projects you've built and keep your portfolio organized.");
        lblSub.setFont(DevTrackFonts.BODY_SECONDARY);
        lblSub.setForeground(new Color(92, 85, 76)); // #5C554C
        lblSub.setAlignmentX(Component.LEFT_ALIGNMENT);
        lblSub.setMaximumSize(new Dimension(Integer.MAX_VALUE, 24));

        titlePanel.add(lblTitle);
        titlePanel.add(Box.createRigidArea(new Dimension(0, 4)));
        titlePanel.add(lblSub);

        DTButton btnAddProject = new DTButton("+ Add Project", DTButton.ButtonType.PRIMARY);
        btnAddProject.setPreferredSize(new Dimension(160, 38));
        btnAddProject.addActionListener(e -> openAddProjectDialog());

        topHeader.add(titlePanel, BorderLayout.CENTER);
        topHeader.add(btnAddProject, BorderLayout.EAST);

        // --- 2. Search Toolbar & Section Heading ---
        JPanel toolbar = new JPanel(new BorderLayout(12, 0));
        toolbar.setOpaque(false);

        searchField = new DTSearchField("Search projects...");
        searchField.setPreferredSize(new Dimension(280, 38));
        searchField.getDocument().addDocumentListener(new DocumentListener() {
            @Override
            public void insertUpdate(DocumentEvent e) { updateSearch(); }
            @Override
            public void removeUpdate(DocumentEvent e) { updateSearch(); }
            @Override
            public void changedUpdate(DocumentEvent e) { updateSearch(); }
        });

        toolbar.add(searchField, BorderLayout.WEST);

        // Section Heading: "Your Projects" + Divider line
        JPanel sectionHeadingPanel = new JPanel();
        sectionHeadingPanel.setLayout(new BoxLayout(sectionHeadingPanel, BoxLayout.Y_AXIS));
        sectionHeadingPanel.setOpaque(false);

        JLabel lblSection = new JLabel("Your Projects");
        lblSection.setFont(DevTrackFonts.HEADING_2);
        lblSection.setForeground(new Color(34, 30, 26)); // #221E1A
        lblSection.setAlignmentX(Component.LEFT_ALIGNMENT);
        lblSection.setMaximumSize(new Dimension(Integer.MAX_VALUE, 26));

        JSeparator divider = new JSeparator(SwingConstants.HORIZONTAL);
        divider.setForeground(new Color(228, 222, 210)); // #E4DED2
        divider.setBackground(new Color(228, 222, 210));
        divider.setMaximumSize(new Dimension(Integer.MAX_VALUE, 1));
        divider.setAlignmentX(Component.LEFT_ALIGNMENT);

        sectionHeadingPanel.add(lblSection);
        sectionHeadingPanel.add(Box.createRigidArea(new Dimension(0, 8)));
        sectionHeadingPanel.add(divider);

        JPanel northContainer = new JPanel();
        northContainer.setLayout(new BoxLayout(northContainer, BoxLayout.Y_AXIS));
        northContainer.setOpaque(false);
        northContainer.add(topHeader);
        northContainer.add(Box.createRigidArea(new Dimension(0, 16)));
        northContainer.add(toolbar);
        northContainer.add(Box.createRigidArea(new Dimension(0, 20)));
        northContainer.add(sectionHeadingPanel);

        add(northContainer, BorderLayout.NORTH);

        // --- 3. Cards Scroll Container (Single Column Vertical Stack) ---
        cardsStackContainer = new JPanel();
        cardsStackContainer.setOpaque(false);

        JScrollPane scrollPane = new JScrollPane(cardsStackContainer);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.setBorder(null);
        scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);
        scrollPane.getVerticalScrollBar().setUnitIncrement(16);

        add(scrollPane, BorderLayout.CENTER);
    }

    private void updateSearch() {
        this.searchQuery = searchField.getText().trim().toLowerCase();
        if ("search projects...".equalsIgnoreCase(this.searchQuery)) {
            this.searchQuery = "";
        }
        renderGrid();
    }

    public void loadProjects() {
        try {
            allProjects = projectService.getProjectsForCurrentStudent();
            renderGrid();
        } catch (Exception ex) {
            // Handled silently
        }
    }

    private void renderGrid() {
        cardsStackContainer.removeAll();

        List<ProjectDetails> filtered = allProjects.stream().filter(pd -> {
            Project p = pd.getProject();
            if (!searchQuery.isBlank()) {
                boolean nameMatch = p.getProjectName() != null && p.getProjectName().toLowerCase().contains(searchQuery);
                boolean titleMatch = p.getTitle() != null && p.getTitle().toLowerCase().contains(searchQuery);
                boolean descMatch = p.getDescription() != null && p.getDescription().toLowerCase().contains(searchQuery);
                if (!nameMatch && !titleMatch && !descMatch) return false;
            }
            return true;
        }).collect(Collectors.toList());

        if (filtered.isEmpty()) {
            cardsStackContainer.setLayout(new BorderLayout());
            cardsStackContainer.add(createEmptyStatePanel(), BorderLayout.CENTER);
        } else {
            JPanel verticalStack = new JPanel();
            verticalStack.setLayout(new BoxLayout(verticalStack, BoxLayout.Y_AXIS));
            verticalStack.setOpaque(false);

            for (ProjectDetails pd : filtered) {
                verticalStack.add(new DTProjectCard(pd, this));
                verticalStack.add(Box.createRigidArea(new Dimension(0, 14)));
            }

            cardsStackContainer.setLayout(new BorderLayout());
            cardsStackContainer.add(verticalStack, BorderLayout.NORTH);
        }

        cardsStackContainer.revalidate();
        cardsStackContainer.repaint();
    }

    private JPanel createEmptyStatePanel() {
        JPanel emptyPanel = new JPanel(new GridBagLayout());
        emptyPanel.setOpaque(false);
        emptyPanel.setBorder(new EmptyBorder(40, 20, 40, 20));

        JPanel inner = new JPanel();
        inner.setLayout(new BoxLayout(inner, BoxLayout.Y_AXIS));
        inner.setOpaque(false);

        JLabel lblEmptyTitle = new JLabel("No projects added yet.");
        lblEmptyTitle.setFont(DevTrackFonts.HEADING_2);
        lblEmptyTitle.setForeground(new Color(34, 30, 26)); // #221E1A
        lblEmptyTitle.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel lblEmptySub = new JLabel("Add the projects you've built to keep your portfolio organized.");
        lblEmptySub.setFont(DevTrackFonts.BODY_SECONDARY);
        lblEmptySub.setForeground(new Color(92, 85, 76)); // #5C554C
        lblEmptySub.setAlignmentX(Component.CENTER_ALIGNMENT);

        DTButton btnAddFirst = new DTButton("+ Add Project", DTButton.ButtonType.PRIMARY);
        btnAddFirst.setPreferredSize(new Dimension(170, 40));
        btnAddFirst.setMaximumSize(new Dimension(170, 40));
        btnAddFirst.setAlignmentX(Component.CENTER_ALIGNMENT);
        btnAddFirst.addActionListener(e -> openAddProjectDialog());

        inner.add(lblEmptyTitle);
        inner.add(Box.createRigidArea(new Dimension(0, 8)));
        inner.add(lblEmptySub);
        inner.add(Box.createRigidArea(new Dimension(0, 20)));
        inner.add(btnAddFirst);

        emptyPanel.add(inner);
        return emptyPanel;
    }

    private void openAddProjectDialog() {
        Window parentWindow = SwingUtilities.getWindowAncestor(this);
        DTProjectFormDialog dialog = new DTProjectFormDialog(parentWindow, null, this::loadProjects);
        dialog.setVisible(true);
    }

    // --- DTProjectCard Action Handlers ---

    @Override
    public void onDeleteProject(Project project) {
        Window parentWindow = SwingUtilities.getWindowAncestor(this);

        boolean confirmed = DTConfirmDialog.show(
                parentWindow,
                "Delete Project?",
                "This action cannot be undone.\n\n" + project.getTitle()
        );

        if (confirmed) {
            try {
                int studentId = SessionManager.getInstance().getCurrentStudentId();
                boolean success = projectService.deleteProject(studentId, project.getProjectId());
                if (success) {
                    loadProjects();
                }
            } catch (Exception ex) {
                // Handled silently
            }
        }
    }

    @Override
    public void onOpenGithubUrl(String url) {
        if (url == null || url.isBlank()) {
            DTToast.showInfo(this, "No GitHub repository URL linked.");
            return;
        }

        String fullUrl = url.trim();
        if (!fullUrl.toLowerCase().startsWith("http://") && !fullUrl.toLowerCase().startsWith("https://")) {
            fullUrl = "https://" + fullUrl;
        }

        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(fullUrl));
            } else {
                DTToast.showInfo(this, "Cannot open browser automatically. Link: " + fullUrl);
            }
        } catch (Exception ex) {
            DTToast.showInfo(this, "Unable to open link: " + fullUrl);
        }
    }
}
