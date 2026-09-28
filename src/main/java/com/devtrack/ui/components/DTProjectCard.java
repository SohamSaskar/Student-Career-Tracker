package com.devtrack.ui.components;

import com.devtrack.model.Project;
import com.devtrack.model.ProjectDetails;
import com.devtrack.ui.dialogs.DTConfirmDialog;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.net.URI;

/**
 * Custom horizontal Project Card component matching DevTrack Warm Porcelain aesthetic.
 * Adheres to Section 2 exact layout: Left side (Title, Description, GitHub URL),
 * Right side vertically-centered action buttons ([ GitHub ] [ Delete ]).
 */
public class DTProjectCard extends JPanel {

    public interface ProjectCardActionListener {
        void onDeleteProject(Project project);
        void onOpenGithubUrl(String url);
    }

    private final ProjectDetails projectDetails;
    private final ProjectCardActionListener listener;
    private boolean isHovered = false;

    public DTProjectCard(ProjectDetails projectDetails, ProjectCardActionListener listener) {
        this.projectDetails = projectDetails;
        this.listener = listener;

        setLayout(new BorderLayout(16, 0));
        setOpaque(false);
        setBorder(new EmptyBorder(20, 24, 20, 24));
        setPreferredSize(new Dimension(800, 140));
        setMinimumSize(new Dimension(400, 130));
        setMaximumSize(new Dimension(Integer.MAX_VALUE, 160));

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
        Project p = projectDetails.getProject();

        // --- Left Side: Project Information ---
        JPanel leftPanel = new JPanel();
        leftPanel.setLayout(new BoxLayout(leftPanel, BoxLayout.Y_AXIS));
        leftPanel.setOpaque(false);

        // 1. Project Name (18px Bold #101318)
        String titleStr = (p.getProjectName() != null && !p.getProjectName().isBlank()) ? p.getProjectName() : p.getTitle();
        if (titleStr == null || titleStr.isBlank()) titleStr = "Untitled Project";

        JLabel lblTitle = new JLabel(titleStr);
        lblTitle.setFont(DevTrackFonts.HEADING_3);
        lblTitle.setForeground(new Color(16, 19, 24)); // #101318
        lblTitle.setAlignmentX(Component.LEFT_ALIGNMENT);

        // 2. Description (14px Regular #4B505A)
        String descStr = p.getDescription() != null ? p.getDescription().trim() : "";
        if (descStr.length() > 140) {
            descStr = descStr.substring(0, 137) + "...";
        }
        if (descStr.isBlank()) {
            descStr = "No project description provided.";
        }

        JLabel lblDesc = new JLabel("<html><body style='width: 480px; text-align: left;'>" + escapeHtml(descStr) + "</body></html>");
        lblDesc.setFont(DevTrackFonts.BODY);
        lblDesc.setForeground(new Color(75, 80, 90)); // #4B505A
        lblDesc.setAlignmentX(Component.LEFT_ALIGNMENT);

        // 3. GitHub URL (13px #868C96)
        String githubUrl = p.getGithubUrl() != null ? p.getGithubUrl().trim() : "";
        String displayUrl = githubUrl.isBlank() ? "No GitHub repository linked" : githubUrl;
        if (displayUrl.startsWith("https://")) {
            displayUrl = displayUrl.substring(8);
        } else if (displayUrl.startsWith("http://")) {
            displayUrl = displayUrl.substring(7);
        }

        JLabel lblGithub = new JLabel(displayUrl);
        lblGithub.setFont(DevTrackFonts.CAPTION);
        lblGithub.setForeground(new Color(134, 140, 150)); // #868C96
        lblGithub.setAlignmentX(Component.LEFT_ALIGNMENT);
        lblGithub.setToolTipText(githubUrl.isBlank() ? null : githubUrl);

        leftPanel.add(lblTitle);
        leftPanel.add(Box.createRigidArea(new Dimension(0, 6)));
        leftPanel.add(lblDesc);
        leftPanel.add(Box.createRigidArea(new Dimension(0, 8)));
        leftPanel.add(lblGithub);

        add(leftPanel, BorderLayout.CENTER);

        // --- Right Side: Vertically Centered Action Buttons ([ GitHub ] [ Delete ]) ---
        JPanel rightPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightPanel.setOpaque(false);

        DTButton btnGithub = new DTButton("GitHub", DTButton.ButtonType.GITHUB);
        btnGithub.setPreferredSize(new Dimension(100, 44));
        btnGithub.setEnabled(!githubUrl.isBlank());
        btnGithub.addActionListener(e -> {
            if (listener != null) {
                listener.onOpenGithubUrl(githubUrl);
            }
        });

        DTButton btnDelete = new DTButton("Delete", DTButton.ButtonType.DESTRUCTIVE);
        btnDelete.setPreferredSize(new Dimension(95, 44));
        btnDelete.addActionListener(e -> {
            if (listener != null) {
                listener.onDeleteProject(p);
            }
        });

        rightPanel.add(btnGithub);
        rightPanel.add(btnDelete);

        // Wrap rightPanel in a GridBagLayout container to enforce vertical centering
        JPanel eastWrapper = new JPanel(new GridBagLayout());
        eastWrapper.setOpaque(false);
        eastWrapper.add(rightPanel);

        add(eastWrapper, BorderLayout.EAST);
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;");
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();

        // Card Fill #EAEDF1
        g2.setColor(new Color(234, 237, 241));
        g2.fillRoundRect(1, 1, w - 3, h - 3, 10, 10);

        // 1.5px Border (#E4DED2 default, #D8CFC0 hover)
        Color borderColor = isHovered ? new Color(216, 207, 192) : new Color(228, 222, 210);
        g2.setColor(borderColor);
        g2.setStroke(new BasicStroke(1.5f));
        g2.drawRoundRect(1, 1, w - 3, h - 3, 10, 10);

        g2.dispose();
        super.paintComponent(g);
    }
}
