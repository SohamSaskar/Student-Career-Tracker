package com.devtrack.ui.dialogs;

import com.devtrack.model.Project;
import com.devtrack.model.ProjectDetails;
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
 * Modal dialog for displaying complete details of a student project in Nordic Technical Dark theme.
 */
public class DTProjectDetailsDialog extends JDialog {

    private final ProjectDetails projectDetails;
    private Runnable onEditRequested;
    private Runnable onDeleteRequested;

    public DTProjectDetailsDialog(Window parent, ProjectDetails projectDetails, Runnable onEditRequested, Runnable onDeleteRequested) {
        super(parent, "Project Details — DevTrack", ModalityType.APPLICATION_MODAL);
        this.projectDetails = projectDetails;
        this.onEditRequested = onEditRequested;
        this.onDeleteRequested = onDeleteRequested;

        initComponents();
    }

    private void initComponents() {
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setSize(650, 680);
        setLocationRelativeTo(getOwner());

        JPanel root = new JPanel(new BorderLayout(0, 20));
        root.setBackground(DevTrackColors.BG_PRIMARY);
        root.setBorder(new EmptyBorder(24, 24, 24, 24));

        Project p = projectDetails.getProject();

        // --- Header Section ---
        JPanel headerPanel = new JPanel(new BorderLayout(12, 0));
        headerPanel.setOpaque(false);

        JPanel titleBox = new JPanel();
        titleBox.setLayout(new BoxLayout(titleBox, BoxLayout.Y_AXIS));
        titleBox.setOpaque(false);

        JLabel lblTitle = new JLabel(p.getTitle() != null ? p.getTitle() : "Untitled Project");
        lblTitle.setFont(DevTrackFonts.HEADING_2);
        lblTitle.setForeground(DevTrackColors.TEXT_PRIMARY);

        JPanel metaLine = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        metaLine.setOpaque(false);
        metaLine.setBorder(new EmptyBorder(6, 0, 0, 0));

        String status = p.getStatus() != null ? p.getStatus() : "Planned";
        metaLine.add(new DTBadge(status));

        if (p.getCategory() != null && !p.getCategory().isBlank()) {
            metaLine.add(new DTBadge(p.getCategory()));
        }

        titleBox.add(lblTitle);
        titleBox.add(metaLine);
        headerPanel.add(titleBox, BorderLayout.CENTER);

        root.add(headerPanel, BorderLayout.NORTH);

        // --- Main Content Area (Scrollable Card) ---
        JPanel mainContent = new JPanel();
        mainContent.setLayout(new BoxLayout(mainContent, BoxLayout.Y_AXIS));
        mainContent.setOpaque(false);

        // Timeline Info Card
        DTCard timelineCard = new DTCard();
        timelineCard.setLayout(new GridLayout(1, 2, 16, 0));

        JPanel startBox = createDetailItem("START DATE", p.getStartDate() != null ? p.getStartDate().toString() : "Not specified");
        JPanel endBox = createDetailItem("END DATE", p.getEndDate() != null ? p.getEndDate().toString() : ("Completed".equalsIgnoreCase(p.getStatus()) ? "Present" : "Ongoing"));

        timelineCard.add(startBox);
        timelineCard.add(endBox);
        mainContent.add(timelineCard);
        mainContent.add(Box.createRigidArea(new Dimension(0, 16)));

        // Description Card
        DTCard descCard = new DTCard();
        descCard.setLayout(new BorderLayout(0, 8));

        JLabel lblDescTitle = new JLabel("DESCRIPTION");
        lblDescTitle.setFont(DevTrackFonts.CAPTION);
        lblDescTitle.setForeground(DevTrackColors.TEXT_MUTED);

        JTextArea txtDesc = new JTextArea(p.getDescription() != null && !p.getDescription().isBlank() ? p.getDescription() : "No detailed description provided.");
        txtDesc.setFont(DevTrackFonts.BODY);
        txtDesc.setForeground(DevTrackColors.TEXT_SECONDARY);
        txtDesc.setBackground(DevTrackColors.BG_CARD);
        txtDesc.setLineWrap(true);
        txtDesc.setWrapStyleWord(true);
        txtDesc.setEditable(false);
        txtDesc.setFocusable(false);

        descCard.add(lblDescTitle, BorderLayout.NORTH);
        descCard.add(txtDesc, BorderLayout.CENTER);
        mainContent.add(descCard);
        mainContent.add(Box.createRigidArea(new Dimension(0, 16)));

        // Skills / Tech Stack Card
        DTCard skillsCard = new DTCard();
        skillsCard.setLayout(new BorderLayout(0, 10));

        JLabel lblSkillsTitle = new JLabel("TECHNOLOGIES & SKILLS DEMONSTRATED");
        lblSkillsTitle.setFont(DevTrackFonts.CAPTION);
        lblSkillsTitle.setForeground(DevTrackColors.TEXT_MUTED);
        skillsCard.add(lblSkillsTitle, BorderLayout.NORTH);

        List<Skill> skills = projectDetails.getSkills();
        if (skills == null || skills.isEmpty()) {
            JLabel lblNoSkills = new JLabel("No specific skills tagged for this project.");
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

        // Links Card
        DTCard linksCard = new DTCard();
        linksCard.setLayout(new GridLayout(1, 2, 16, 0));

        JPanel githubBox = createLinkItem("GITHUB REPOSITORY", p.getGithubUrl());
        JPanel demoBox = createLinkItem("LIVE DEMO URL", p.getLiveDemoUrl());

        linksCard.add(githubBox);
        linksCard.add(demoBox);
        mainContent.add(linksCard);

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

        JButton btnDelete = new JButton("Delete Project");
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

        JButton btnEdit = new JButton("Edit Project");
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
}
