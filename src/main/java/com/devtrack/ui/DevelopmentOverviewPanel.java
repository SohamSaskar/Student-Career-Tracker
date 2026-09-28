package com.devtrack.ui;

import com.devtrack.ui.components.AnimatedProgressBar;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionAdapter;

/**
 * DEVELOPMENT OVERVIEW PANEL
 * Features permanent crisp dark border (#323537, 1.5f width), ~50% light mid-tone background (#E4E8E2),
 * green completed node hover / red incomplete node hover, dark red connecting line highlights,
 * and centered breakdown status text.
 */
public class DevelopmentOverviewPanel extends JPanel {

    public static class DevSkill {
        public String name;
        public String status; // "Completed", "Learning"
        public String detail;

        public DevSkill(String name, String status, String detail) {
            this.name = name;
            this.status = status;
            this.detail = detail;
        }
    }

    private final DevSkill[] skills;
    private final AnimatedProgressBar progressBar;
    private int hoveredIndex = -1;

    public DevelopmentOverviewPanel(AnimatedProgressBar progressBar) {
        this(progressBar, null, null, 0.68);
    }

    public DevelopmentOverviewPanel(AnimatedProgressBar progressBar, com.devtrack.model.CareerRole role, java.util.List<com.devtrack.model.Skill> roleSkills, double progressRatio) {
        this.progressBar = progressBar;

        if (roleSkills != null && !roleSkills.isEmpty()) {
            this.skills = new DevSkill[roleSkills.size()];
            for (int i = 0; i < roleSkills.size(); i++) {
                com.devtrack.model.Skill s = roleSkills.get(i);
                this.skills[i] = new DevSkill(s.getSkillName(), s.getStatus(), s.getDetail());
            }
        } else {
            this.skills = new DevSkill[] {
                    new DevSkill("Java", "Completed", "Core Java, OOP, Collections Framework"),
                    new DevSkill("SQL", "Completed", "MySQL Relational Schema, Joins & Queries"),
                    new DevSkill("Git", "Completed", "Version Control, Branching & Pull Requests"),
                    new DevSkill("DSA", "Completed", "Arrays, Trees, Graphs & Algorithms"),
                    new DevSkill("REST API", "Completed", "HTTP Methods, JSON, API Endpoint Design"),
                    new DevSkill("Spring Boot", "Learning", "MVC, Dependency Injection & Spring Data JPA")
            };
        }

        String roleTitle = (role != null && role.getRoleName() != null)
                ? role.getRoleName().toUpperCase()
                : "BACKEND DEVELOPMENT";

        int percVal = (int) Math.round(progressRatio * 100);

        setLayout(new BorderLayout());
        setOpaque(false);
        setBorder(new EmptyBorder(22, 28, 22, 28));

        // Top Header Row
        JPanel topHeader = new JPanel(new BorderLayout());
        topHeader.setOpaque(false);

        JLabel titleLabel = new JLabel(roleTitle);
        titleLabel.setFont(Theme.FONT_SECTION_TITLE);
        titleLabel.setForeground(Theme.PRIMARY_DARK);

        JLabel percLabel = new JLabel(percVal + "% Progress");
        percLabel.setFont(Theme.FONT_LABEL_BOLD);
        percLabel.setForeground(Theme.ACCENT_PRIMARY);

        topHeader.add(titleLabel, BorderLayout.WEST);
        topHeader.add(percLabel, BorderLayout.EAST);

        // Center Container
        JPanel centerContainer = new JPanel();
        centerContainer.setLayout(new BoxLayout(centerContainer, BoxLayout.Y_AXIS));
        centerContainer.setOpaque(false);
        centerContainer.setBorder(new EmptyBorder(14, 0, 0, 0));

        centerContainer.add(progressBar);
        centerContainer.add(Box.createVerticalStrut(18));

        // Centered detail status display line
        JLabel statusDetail = new JLabel("Hover over a skill node to view topic breakdown.");
        statusDetail.setFont(Theme.FONT_SMALL);
        statusDetail.setForeground(Theme.TEXT_SECONDARY);
        statusDetail.setHorizontalAlignment(SwingConstants.CENTER);
        statusDetail.setAlignmentX(Component.CENTER_ALIGNMENT);

        ProgressionCanvas canvas = new ProgressionCanvas(statusDetail);
        canvas.setPreferredSize(new Dimension(1120, 64));
        canvas.setAlignmentX(Component.CENTER_ALIGNMENT);

        centerContainer.add(canvas);
        centerContainer.add(Box.createVerticalStrut(8));

        // Centered Wrapper for Status Detail Text
        JPanel detailWrapper = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 0));
        detailWrapper.setOpaque(false);
        detailWrapper.add(statusDetail);

        centerContainer.add(detailWrapper);

        add(topHeader, BorderLayout.NORTH);
        add(centerContainer, BorderLayout.CENTER);
    }

    private class ProgressionCanvas extends JComponent {
        private final JLabel statusDetail;

        public ProgressionCanvas(JLabel statusDetail) {
            this.statusDetail = statusDetail;

            addMouseMotionListener(new MouseMotionAdapter() {
                @Override
                public void mouseMoved(MouseEvent e) {
                    int oldHover = hoveredIndex;
                    hoveredIndex = findNodeAt(e.getPoint());

                    if (hoveredIndex != oldHover) {
                        if (hoveredIndex != -1) {
                            DevSkill s = skills[hoveredIndex];
                            statusDetail.setText(s.name + " [" + s.status + "]: " + s.detail);
                            if (s.status.equals("Completed")) {
                                statusDetail.setForeground(Theme.ACCENT_SUCCESS);
                            } else {
                                statusDetail.setForeground(Theme.RED_NODE_BORDER);
                            }
                        } else {
                            statusDetail.setText("Hover over a skill node to view topic breakdown.");
                            statusDetail.setForeground(Theme.TEXT_SECONDARY);
                        }
                        repaint();
                    }
                }
            });

            addMouseListener(new MouseAdapter() {
                @Override
                public void mouseExited(MouseEvent e) {
                    hoveredIndex = -1;
                    statusDetail.setText("Hover over a skill node to view topic breakdown.");
                    statusDetail.setForeground(Theme.TEXT_SECONDARY);
                    repaint();
                }
            });
        }

        private int findNodeAt(Point p) {
            int w = getWidth();
            int h = getHeight();
            int n = skills.length;
            int paddingX = 50;
            int spacing = (w - (paddingX * 2)) / (n - 1);
            int cy = h / 2 - 4;

            for (int i = 0; i < n; i++) {
                int cx = paddingX + (i * spacing);
                Rectangle bounds = new Rectangle(cx - 45, cy - 16, 90, 32);
                if (bounds.contains(p)) {
                    return i;
                }
            }
            return -1;
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            int w = getWidth();
            int h = getHeight();
            int n = skills.length;
            int paddingX = 50;
            int spacing = (w - (paddingX * 2)) / (n - 1);
            int cy = h / 2 - 4;

            // 1. Draw Connecting Lines
            for (int i = 0; i < n - 1; i++) {
                int x1 = paddingX + (i * spacing);
                int x2 = paddingX + ((i + 1) * spacing);

                boolean lineHighlight = (hoveredIndex == i || hoveredIndex == i + 1);

                g2.setStroke(new BasicStroke(lineHighlight ? 2.5f : 1.5f));
                if (lineHighlight) {
                    g2.setColor(Theme.ACCENT_LINE_RED);
                } else if (skills[i].status.equals("Completed") && skills[i + 1].status.equals("Completed")) {
                    g2.setColor(Theme.ACCENT_SUCCESS);
                } else {
                    g2.setColor(Theme.BORDER_COLOR);
                }

                g2.drawLine(x1 + 45, cy, x2 - 45, cy);
            }

            // 2. Draw Skill Nodes
            for (int i = 0; i < n; i++) {
                DevSkill s = skills[i];
                int cx = paddingX + (i * spacing);
                boolean isHovered = (hoveredIndex == i);

                int nodeWidth = 90;
                int nodeHeight = 30;
                int nx = cx - (nodeWidth / 2);
                int ny = cy - (nodeHeight / 2);

                if (isHovered) {
                    if (s.status.equals("Completed")) {
                        g2.setColor(Theme.SUCCESS_HOVER_BG);
                    } else {
                        g2.setColor(Theme.RED_NODE_BG);
                    }
                } else if (s.status.equals("Completed")) {
                    g2.setColor(Theme.SUCCESS_TINT);
                } else if (s.status.equals("Learning")) {
                    g2.setColor(Theme.ACCENT_TINT);
                } else {
                    g2.setColor(Theme.LIGHT_SURFACE);
                }
                g2.fillRoundRect(nx, ny, nodeWidth, nodeHeight, 6, 6);

                if (isHovered) {
                    if (s.status.equals("Completed")) {
                        g2.setColor(Theme.ACCENT_SUCCESS);
                    } else {
                        g2.setColor(Theme.RED_NODE_BORDER);
                    }
                    g2.setStroke(new BasicStroke(2.0f));
                } else if (s.status.equals("Completed")) {
                    g2.setColor(Theme.ACCENT_SUCCESS);
                    g2.setStroke(new BasicStroke(1.0f));
                } else if (s.status.equals("Learning")) {
                    g2.setColor(Theme.ACCENT_PRIMARY);
                    g2.setStroke(new BasicStroke(1.0f));
                } else {
                    g2.setColor(Theme.BORDER_COLOR);
                    g2.setStroke(new BasicStroke(1.0f));
                }
                g2.drawRoundRect(nx, ny, nodeWidth, nodeHeight, 6, 6);

                g2.setFont(Theme.FONT_BODY_MEDIUM);
                if (isHovered) {
                    if (s.status.equals("Completed")) {
                        g2.setColor(Theme.ACCENT_SUCCESS);
                    } else {
                        g2.setColor(Theme.RED_NODE_BORDER);
                    }
                } else if (s.status.equals("Completed")) {
                    g2.setColor(Theme.ACCENT_SUCCESS);
                } else if (s.status.equals("Learning")) {
                    g2.setColor(Theme.ACCENT_PRIMARY);
                } else {
                    g2.setColor(Theme.TEXT_SECONDARY);
                }

                FontMetrics fm = g2.getFontMetrics();
                int textX = cx - (fm.stringWidth(s.name) / 2);
                int textY = cy + (fm.getAscent() / 2) - 2;

                g2.drawString(s.name, textX, textY);
            }

            g2.dispose();
        }
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        g2.setColor(Theme.PANEL_MID_LIGHT);
        g2.fillRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 8, 8);

        g2.setColor(Theme.PANEL_MID_BORDER);
        g2.setStroke(new BasicStroke(1.5f));
        g2.drawRoundRect(1, 1, getWidth() - 3, getHeight() - 3, 8, 8);

        g2.dispose();
        super.paintComponent(g);
    }
}
