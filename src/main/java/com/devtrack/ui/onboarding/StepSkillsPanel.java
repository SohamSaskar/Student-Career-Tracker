package com.devtrack.ui.onboarding;

import com.devtrack.dao.SkillDAO;
import com.devtrack.model.Skill;
import com.devtrack.service.OnboardingService;
import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import java.awt.*;
import java.awt.event.*;
import java.util.*;
import java.util.List;

/**
 * Onboarding Step 3: Current Skills Inventory Panel.
 * Professional, polished career-platform UI for skill selection.
 */
public class StepSkillsPanel extends JPanel {

    public interface OnStepNavigationListener {
        void onNextStep();
        void onPrevStep();
    }

    private final OnStepNavigationListener navListener;
    private final SkillDAO skillDAO;
    private final OnboardingService onboardingService;

    private final Map<Integer, String> skillStatusMap = new HashMap<>();
    private final List<Skill> allSkills;
    private final List<Skill> filteredSkills;

    private final JTextField searchField;
    private final JPanel gridPanel;
    private final JPanel emptyStatePanel;
    private final JLabel summaryLabel;
    private final JLabel errorLabel;

    public StepSkillsPanel(OnStepNavigationListener navListener) {
        this.navListener = navListener;
        this.skillDAO = new SkillDAO();
        this.onboardingService = new OnboardingService();

        setLayout(new BorderLayout());
        setOpaque(false);
        setBorder(new EmptyBorder(20, 32, 20, 32));

        // Load Skills from MySQL
        this.allSkills = skillDAO.getAllSkills();
        this.filteredSkills = new ArrayList<>(allSkills);

        // Pre-fill existing skills for current student if available
        int studentId = SessionManager.getInstance().getCurrentStudentId();
        if (studentId > 0) {
            List<Skill> existingSkills = skillDAO.getStudentSkills(studentId);
            for (Skill s : existingSkills) {
                if (s.getStatus() != null) {
                    skillStatusMap.put(s.getSkillId(), s.getStatus());
                }
            }
        }

        // --- TOP SECTION (Header + Search + Section Title) ---
        JPanel topSection = new JPanel();
        topSection.setLayout(new BoxLayout(topSection, BoxLayout.Y_AXIS));
        topSection.setOpaque(false);

        // 1. Screen Title & Explanation
        JLabel title = new JLabel("Select Your Current Skills");
        title.setFont(DevTrackFonts.PAGE_TITLE);
        title.setForeground(DevTrackColors.TEXT_PRIMARY);
        title.setAlignmentX(Component.LEFT_ALIGNMENT);

        JLabel subtitle = new JLabel("Tell us what you already know. DevTrack will use this to understand your current career readiness.");
        subtitle.setFont(DevTrackFonts.BODY);
        subtitle.setForeground(DevTrackColors.TEXT_SECONDARY);
        subtitle.setAlignmentX(Component.LEFT_ALIGNMENT);

        errorLabel = new JLabel(" ");
        errorLabel.setFont(DevTrackFonts.CAPTION);
        errorLabel.setForeground(DevTrackColors.ERROR_TEXT);
        errorLabel.setAlignmentX(Component.LEFT_ALIGNMENT);

        topSection.add(title);
        topSection.add(Box.createVerticalStrut(4));
        topSection.add(subtitle);
        topSection.add(Box.createVerticalStrut(6));
        topSection.add(errorLabel);
        topSection.add(Box.createVerticalStrut(12));

        // 2. Search Bar
        JPanel searchContainer = createSearchContainer();
        searchContainer.setAlignmentX(Component.LEFT_ALIGNMENT);
        topSection.add(searchContainer);
        topSection.add(Box.createVerticalStrut(20));

        // 3. Section Subheader ("Your skills")
        JLabel sectionHeader = new JLabel("Your skills");
        sectionHeader.setFont(DevTrackFonts.HEADING_2);
        sectionHeader.setForeground(DevTrackColors.TEXT_PRIMARY);
        sectionHeader.setAlignmentX(Component.LEFT_ALIGNMENT);

        JLabel sectionSub = new JLabel("Select a skill and choose your current level.");
        sectionSub.setFont(DevTrackFonts.BODY);
        sectionSub.setForeground(DevTrackColors.TEXT_SECONDARY);
        sectionSub.setAlignmentX(Component.LEFT_ALIGNMENT);

        topSection.add(sectionHeader);
        topSection.add(Box.createVerticalStrut(2));
        topSection.add(sectionSub);
        topSection.add(Box.createVerticalStrut(14));

        add(topSection, BorderLayout.NORTH);

        // --- CENTER SECTION (2-Column Skill Grid & Empty State) ---
        gridPanel = new JPanel(new GridLayout(0, 2, 16, 16));
        gridPanel.setOpaque(false);
        gridPanel.setBorder(new EmptyBorder(4, 4, 16, 4));

        emptyStatePanel = createEmptyStatePanel();
        emptyStatePanel.setVisible(false);

        JPanel scrollContent = new JPanel(new BorderLayout());
        scrollContent.setOpaque(false);
        scrollContent.add(gridPanel, BorderLayout.NORTH);
        scrollContent.add(emptyStatePanel, BorderLayout.CENTER);

        JScrollPane scrollPane = new JScrollPane(scrollContent);
        scrollPane.setBorder(null);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.getVerticalScrollBar().setUnitIncrement(24);

        add(scrollPane, BorderLayout.CENTER);

        // --- BOTTOM SECTION (Summary Bar + Navigation Strip) ---
        JPanel bottomSection = new JPanel();
        bottomSection.setLayout(new BoxLayout(bottomSection, BoxLayout.Y_AXIS));
        bottomSection.setOpaque(false);
        bottomSection.setBorder(new EmptyBorder(12, 0, 0, 0));

        // Selected Summary Bar
        summaryLabel = new JLabel(" ");
        summaryLabel.setFont(DevTrackFonts.FORM_LABEL);
        summaryLabel.setForeground(DevTrackColors.TEXT_PRIMARY);
        summaryLabel.setAlignmentX(Component.LEFT_ALIGNMENT);

        JPanel summaryPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 0));
        summaryPanel.setOpaque(false);
        summaryPanel.add(summaryLabel);

        // Navigation Footer
        JPanel footer = new JPanel(new BorderLayout());
        footer.setOpaque(false);
        footer.setBorder(new EmptyBorder(12, 0, 0, 0));

        DTButton backBtn = new DTButton("← BACK", DTButton.ButtonType.SECONDARY);
        backBtn.setPreferredSize(new Dimension(140, 44));
        backBtn.addActionListener(e -> {
            if (navListener != null) navListener.onPrevStep();
        });

        DTButton continueBtn = new DTButton("CONTINUE TO ANALYSIS →", DTButton.ButtonType.PRIMARY);
        continueBtn.setPreferredSize(new Dimension(250, 44));
        continueBtn.addActionListener(e -> saveAndContinue());

        footer.add(backBtn, BorderLayout.WEST);
        footer.add(continueBtn, BorderLayout.EAST);

        bottomSection.add(summaryPanel);
        bottomSection.add(Box.createVerticalStrut(12));
        bottomSection.add(footer);

        add(bottomSection, BorderLayout.SOUTH);

        // Initial Grid Render & Summary Update
        searchField = (JTextField) searchContainer.getClientProperty("textField");
        renderGrid();
        updateSummary();
    }

    private JPanel createSearchContainer() {
        JPanel container = new JPanel(new BorderLayout(12, 0)) {
            private boolean isFocused = false;

            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                // Background Fills
                g2.setColor(DevTrackColors.BG_SURFACE);
                g2.fillRoundRect(1, 1, getWidth() - 3, getHeight() - 3, 6, 6);

                // Border (Focus Bottle Green #1B5240 vs Default #E4DED2)
                Color borderColor = isFocused ? DevTrackColors.BORDER_FOCUS : new Color(228, 222, 210);
                g2.setColor(borderColor);
                g2.setStroke(new BasicStroke(isFocused ? 2.0f : 1.5f));
                g2.drawRoundRect(1, 1, getWidth() - 3, getHeight() - 3, 6, 6);

                // Crisp Search Magnifier Icon
                g2.setColor(DevTrackColors.TEXT_MUTED);
                g2.setStroke(new BasicStroke(1.8f));
                g2.drawOval(14, 15, 12, 12);
                g2.drawLine(23, 24, 29, 30);

                g2.dispose();
                super.paintComponent(g);
            }

            public void setFocused(boolean focused) {
                this.isFocused = focused;
                repaint();
            }
        };

        container.setOpaque(false);
        container.setPreferredSize(new Dimension(800, 46));
        container.setMaximumSize(new Dimension(Integer.MAX_VALUE, 46));
        container.setBorder(new EmptyBorder(8, 38, 8, 14)); // Left padding for drawn magnifier icon

        JTextField input = new JTextField();
        input.setFont(DevTrackFonts.BODY);
        input.setForeground(DevTrackColors.TEXT_PRIMARY);
        input.setCaretColor(DevTrackColors.TEXT_PRIMARY);
        input.setBorder(null);
        input.setOpaque(false);

        // Search Placeholder Text Prompt
        input.setText("Search skills...");
        input.setForeground(DevTrackColors.TEXT_MUTED);

        input.addFocusListener(new FocusAdapter() {
            @Override
            public void focusGained(FocusEvent e) {
                container.repaint();
                if ("Search skills...".equals(input.getText())) {
                    input.setText("");
                    input.setForeground(DevTrackColors.TEXT_PRIMARY);
                }
                setContainerFocused(container, true);
            }

            @Override
            public void focusLost(FocusEvent e) {
                setContainerFocused(container, false);
                if (input.getText().trim().isEmpty()) {
                    input.setText("Search skills...");
                    input.setForeground(DevTrackColors.TEXT_MUTED);
                }
            }
        });

        input.getDocument().addDocumentListener(new DocumentListener() {
            @Override
            public void insertUpdate(DocumentEvent e) { filterSkills(); }
            @Override
            public void removeUpdate(DocumentEvent e) { filterSkills(); }
            @Override
            public void changedUpdate(DocumentEvent e) { filterSkills(); }

            private void filterSkills() {
                String query = input.getText().trim();
                if ("Search skills...".equalsIgnoreCase(query)) {
                    query = "";
                }
                filterSkillsByQuery(query);
            }
        });

        container.add(input, BorderLayout.CENTER);
        container.putClientProperty("textField", input);
        return container;
    }

    private void setContainerFocused(JPanel container, boolean focused) {
        try {
            java.lang.reflect.Method m = container.getClass().getMethod("setFocused", boolean.class);
            m.invoke(container, focused);
        } catch (Exception ignored) {}
    }

    private JPanel createEmptyStatePanel() {
        JPanel p = new JPanel();
        p.setLayout(new BoxLayout(p, BoxLayout.Y_AXIS));
        p.setOpaque(false);
        p.setBorder(new EmptyBorder(40, 20, 40, 20));

        JLabel mainLabel = new JLabel("No skills found");
        mainLabel.setFont(DevTrackFonts.HEADING_2);
        mainLabel.setForeground(DevTrackColors.TEXT_PRIMARY);
        mainLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel subLabel = new JLabel("Try searching for another skill.");
        subLabel.setFont(DevTrackFonts.BODY);
        subLabel.setForeground(DevTrackColors.TEXT_SECONDARY);
        subLabel.setAlignmentX(Component.CENTER_ALIGNMENT);

        p.add(mainLabel);
        p.add(Box.createVerticalStrut(6));
        p.add(subLabel);
        return p;
    }

    private void filterSkillsByQuery(String query) {
        filteredSkills.clear();
        if (query.isEmpty()) {
            filteredSkills.addAll(allSkills);
        } else {
            String q = query.toLowerCase();
            for (Skill s : allSkills) {
                String name = s.getSkillName() != null ? s.getSkillName().toLowerCase() : "";
                String cat = s.getCategory() != null ? s.getCategory().toLowerCase() : "";
                if (name.contains(q) || cat.contains(q)) {
                    filteredSkills.add(s);
                }
            }
        }
        renderGrid();
    }

    private void renderGrid() {
        gridPanel.removeAll();

        if (filteredSkills.isEmpty()) {
            gridPanel.setVisible(false);
            emptyStatePanel.setVisible(true);
        } else {
            emptyStatePanel.setVisible(false);
            gridPanel.setVisible(true);

            for (Skill skill : filteredSkills) {
                gridPanel.add(new SkillCardPanel(skill));
            }
        }

        gridPanel.revalidate();
        gridPanel.repaint();
    }

    private void updateSummary() {
        int completedCount = 0;
        int learningCount = 0;

        for (String status : skillStatusMap.values()) {
            if ("Completed".equalsIgnoreCase(status)) {
                completedCount++;
            } else if ("Learning".equalsIgnoreCase(status)) {
                learningCount++;
            }
        }

        int totalSelected = completedCount + learningCount;

        if (totalSelected == 0) {
            summaryLabel.setText("0 skills selected  ·  Select your current skills above");
            summaryLabel.setForeground(DevTrackColors.TEXT_MUTED);
        } else {
            summaryLabel.setText(String.format("%d skill%s selected  ·  %d Completed  ·  %d Learning",
                    totalSelected, totalSelected == 1 ? "" : "s", completedCount, learningCount));
            summaryLabel.setForeground(DevTrackColors.TEXT_PRIMARY);
        }
    }

    private void saveAndContinue() {
        int currentStudentId = SessionManager.getInstance().getCurrentStudentId();
        boolean saved = onboardingService.saveStudentSkills(currentStudentId, skillStatusMap);

        if (saved) {
            errorLabel.setText(" ");
            if (navListener != null) {
                navListener.onNextStep();
            }
        } else {
            errorLabel.setText("Unable to save skills. Please try again.");
        }
    }

    // =========================================================================
    // COMPACT SELECTABLE SKILL CARD COMPONENT
    // =========================================================================
    private class SkillCardPanel extends JPanel {
        private final Skill skill;
        private boolean isHovered = false;

        public SkillCardPanel(Skill skill) {
            this.skill = skill;
            setLayout(new BorderLayout(0, 8));
            setOpaque(false);
            setCursor(new Cursor(Cursor.HAND_CURSOR));
            setPreferredSize(new Dimension(340, 110));
            setBorder(new EmptyBorder(12, 14, 12, 14));

            // Top Content (Skill Name & Category Left-Aligned + Check Indicator Right)
            JPanel topRow = new JPanel(new BorderLayout(8, 0));
            topRow.setOpaque(false);

            JPanel infoPanel = new JPanel();
            infoPanel.setLayout(new BoxLayout(infoPanel, BoxLayout.Y_AXIS));
            infoPanel.setOpaque(false);

            JLabel nameLabel = new JLabel(skill.getSkillName());
            nameLabel.setFont(DevTrackFonts.FORM_LABEL);
            nameLabel.setForeground(DevTrackColors.TEXT_PRIMARY);
            nameLabel.setAlignmentX(Component.LEFT_ALIGNMENT);

            JLabel catLabel = new JLabel(skill.getCategory() != null ? skill.getCategory() : "General");
            catLabel.setFont(DevTrackFonts.CAPTION);
            catLabel.setForeground(DevTrackColors.TEXT_SECONDARY);
            catLabel.setAlignmentX(Component.LEFT_ALIGNMENT);

            infoPanel.add(nameLabel);
            infoPanel.add(Box.createVerticalStrut(2));
            infoPanel.add(catLabel);

            JLabel checkBadge = new JLabel("✓") {
                @Override
                protected void paintComponent(Graphics g) {
                    if (isSelected()) {
                        Graphics2D g2 = (Graphics2D) g.create();
                        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                        g2.setColor(DevTrackColors.ACCENT_PRIMARY);
                        g2.fillOval(0, 0, 20, 20);
                        g2.setColor(Color.WHITE);
                        g2.setFont(new Font("Arial", Font.BOLD, 12));
                        FontMetrics fm = g2.getFontMetrics();
                        int x = (20 - fm.stringWidth("✓")) / 2;
                        int y = ((20 - fm.getHeight()) / 2) + fm.getAscent();
                        g2.drawString("✓", x, y);
                        g2.dispose();
                    }
                }
            };
            checkBadge.setPreferredSize(new Dimension(20, 20));

            topRow.add(infoPanel, BorderLayout.WEST);
            topRow.add(checkBadge, BorderLayout.EAST);

            add(topRow, BorderLayout.CENTER);

            // Bottom: Segmented Status Control
            DTSegmentedControl statusControl = new DTSegmentedControl(skill);
            add(statusControl, BorderLayout.SOUTH);

            // Click Card Surface to Toggle Selection
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

                @Override
                public void mouseClicked(MouseEvent e) {
                    if (isSelected()) {
                        skillStatusMap.remove(skill.getSkillId());
                    } else {
                        skillStatusMap.put(skill.getSkillId(), "Completed");
                    }
                    updateSummary();
                    repaint();
                    statusControl.repaintSegments();
                }
            });
        }

        public boolean isSelected() {
            String status = skillStatusMap.get(skill.getSkillId());
            return "Completed".equalsIgnoreCase(status) || "Learning".equalsIgnoreCase(status);
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            int w = getWidth();
            int h = getHeight();
            boolean selected = isSelected();

            // Background Fill
            Color bg;
            Color border;

            if (selected) {
                bg = DevTrackColors.ACCENT_SUBTLE_BG; // #F2DED7 Rust Tint
                border = DevTrackColors.ACCENT_PRIMARY; // #8B3A2B Strong Rust Border
            } else if (isHovered) {
                bg = DevTrackColors.TABLE_ROW_HOVER; // #F3F0EA
                border = new Color(216, 207, 192); // #D8CFC0 Hover Border
            } else {
                bg = DevTrackColors.BG_SURFACE; // #FFFFFF Surface
                border = new Color(228, 222, 210); // #E4DED2 Visible 1.5px Border
            }

            g2.setColor(bg);
            g2.fillRoundRect(1, 1, w - 3, h - 3, 8, 8);

            g2.setColor(border);
            g2.setStroke(new BasicStroke(selected ? 2.0f : 1.5f));
            g2.drawRoundRect(1, 1, w - 3, h - 3, 8, 8);

            g2.dispose();
            super.paintComponent(g);
        }
    }

    // =========================================================================
    // SEGMENTED STATUS CONTROL COMPONENT
    // =========================================================================
    private class DTSegmentedControl extends JPanel {
        private final Skill skill;

        public DTSegmentedControl(Skill skill) {
            this.skill = skill;
            setLayout(new GridLayout(1, 3, 4, 0));
            setOpaque(false);
            setPreferredSize(new Dimension(300, 30));

            add(createSegment("Completed", new Color(18, 61, 44))); // Bottle Green #123D2C
            add(createSegment("Learning", DevTrackColors.ACCENT_PRIMARY)); // Rust #8B3A2B
            add(createSegment("Not Started", new Color(230, 224, 214))); // Neutral Light #E6E0D6

            repaintSegments();
        }

        private JPanel createSegment(String title, Color activeColor) {
            JPanel seg = new JPanel(new GridBagLayout()) {
                @Override
                protected void paintComponent(Graphics g) {
                    Graphics2D g2 = (Graphics2D) g.create();
                    g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                    String currentStatus = skillStatusMap.get(skill.getSkillId());
                    boolean isActive;

                    if ("Not Started".equalsIgnoreCase(title)) {
                        isActive = (currentStatus == null || "Not Started".equalsIgnoreCase(currentStatus));
                    } else {
                        isActive = title.equalsIgnoreCase(currentStatus);
                    }

                    if (isActive) {
                        if ("Not Started".equalsIgnoreCase(title)) {
                            g2.setColor(new Color(230, 224, 214)); // Soft neutral fill for unselected state
                        } else {
                            g2.setColor(activeColor);
                        }
                    } else {
                        g2.setColor(new Color(243, 240, 234)); // Light background fill
                    }
                    g2.fillRoundRect(0, 0, getWidth(), getHeight(), 4, 4);

                    g2.dispose();
                    super.paintComponent(g);
                }
            };

            seg.setOpaque(false);
            seg.setCursor(new Cursor(Cursor.HAND_CURSOR));

            JLabel lbl = new JLabel(title);
            lbl.setFont(DevTrackFonts.CAPTION);
            seg.add(lbl);

            seg.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    e.consume(); // Prevent bubbling up to parent card
                    if ("Not Started".equalsIgnoreCase(title)) {
                        skillStatusMap.remove(skill.getSkillId());
                    } else {
                        skillStatusMap.put(skill.getSkillId(), title);
                    }
                    updateSummary();
                    StepSkillsPanel.this.repaint();
                    repaintSegments();
                }
            });

            return seg;
        }

        public void repaintSegments() {
            String currentStatus = skillStatusMap.get(skill.getSkillId());
            for (Component comp : getComponents()) {
                if (comp instanceof JPanel) {
                    JPanel seg = (JPanel) comp;
                    for (Component c : seg.getComponents()) {
                        if (c instanceof JLabel) {
                            JLabel lbl = (JLabel) c;
                            String title = lbl.getText();
                            boolean isActive;
                            if ("Not Started".equalsIgnoreCase(title)) {
                                isActive = (currentStatus == null || "Not Started".equalsIgnoreCase(currentStatus));
                            } else {
                                isActive = title.equalsIgnoreCase(currentStatus);
                            }

                            if ("Not Started".equalsIgnoreCase(title)) {
                                lbl.setForeground(isActive ? DevTrackColors.TEXT_PRIMARY : DevTrackColors.TEXT_MUTED);
                                lbl.setFont(isActive ? DevTrackFonts.FORM_LABEL : DevTrackFonts.CAPTION);
                            } else {
                                lbl.setForeground(isActive ? Color.WHITE : DevTrackColors.TEXT_SECONDARY);
                                lbl.setFont(isActive ? DevTrackFonts.FORM_LABEL : DevTrackFonts.CAPTION);
                            }
                        }
                    }
                    seg.repaint();
                }
            }
        }
    }
}
