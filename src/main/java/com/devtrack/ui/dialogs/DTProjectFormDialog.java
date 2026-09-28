package com.devtrack.ui.dialogs;

import com.devtrack.model.Project;
import com.devtrack.model.ProjectDetails;
import com.devtrack.service.ProjectService;
import com.devtrack.ui.components.DTButton;
import com.devtrack.ui.components.DTTextField;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.ArrayList;

/**
 * Compact Add / Edit Project modal form dialog matching Section 4 exact specifications.
 * Asks strictly for Project Name, Description, and GitHub URL without exposing Tech Stack or extra fields.
 */
public class DTProjectFormDialog extends JDialog {

    public interface OnProjectSavedListener {
        void onProjectSaved();
    }

    private final int studentId;
    private final ProjectDetails existingProjectDetails;
    private final ProjectService projectService;
    private final OnProjectSavedListener savedListener;

    private DTTextField nameField;
    private JTextArea descArea;
    private DTTextField githubField;

    public DTProjectFormDialog(Frame owner, int studentId, ProjectDetails existingProjectDetails, OnProjectSavedListener savedListener) {
        super(owner, existingProjectDetails == null ? "Add Project" : "Edit Project", true);
        this.studentId = studentId;
        this.existingProjectDetails = existingProjectDetails;
        this.projectService = new ProjectService();
        this.savedListener = savedListener;

        setSize(520, 480);
        setResizable(false);
        setLocationRelativeTo(owner);

        initUI();
    }

    public DTProjectFormDialog(Window parentWindow, ProjectDetails existingProjectDetails, OnProjectSavedListener savedListener) {
        this(parentWindow instanceof Frame ? (Frame) parentWindow : (Frame) SwingUtilities.getWindowAncestor(parentWindow),
             SessionManager.getInstance().getCurrentStudentId(),
             existingProjectDetails,
             savedListener);
    }

    private void initUI() {
        JPanel mainPanel = new JPanel(new BorderLayout(0, 16));
        mainPanel.setBackground(DevTrackColors.BG_SURFACE);
        mainPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(228, 222, 210), 1),
                new EmptyBorder(24, 28, 24, 28)
        ));

        Project existing = existingProjectDetails != null ? existingProjectDetails.getProject() : null;

        // 1. Header Title & Subtitle
        JPanel headerPanel = new JPanel();
        headerPanel.setLayout(new BoxLayout(headerPanel, BoxLayout.Y_AXIS));
        headerPanel.setOpaque(false);

        JLabel titleLabel = new JLabel(existing == null ? "Add Project" : "Edit Project");
        titleLabel.setFont(DevTrackFonts.HEADING_2);
        titleLabel.setForeground(new Color(34, 30, 26)); // #221E1A
        titleLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        titleLabel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 26));

        JLabel subLabel = new JLabel(existing == null ? "Add a project to your portfolio." : "Update project portfolio details.");
        subLabel.setFont(DevTrackFonts.BODY_SECONDARY);
        subLabel.setForeground(new Color(92, 85, 76)); // #5C554C
        subLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        subLabel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 22));

        headerPanel.add(titleLabel);
        headerPanel.add(Box.createRigidArea(new Dimension(0, 4)));
        headerPanel.add(subLabel);

        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // 2. Form Fields Container
        JPanel formContainer = new JPanel();
        formContainer.setLayout(new BoxLayout(formContainer, BoxLayout.Y_AXIS));
        formContainer.setOpaque(false);

        // Project Name
        nameField = new DTTextField(existing != null ? (existing.getProjectName() != null ? existing.getProjectName() : existing.getTitle()) : "", 30);
        nameField.setPlaceholder("e.g., FuelPulse / Messenger");
        formContainer.add(createFormField("Project Name *", nameField));
        formContainer.add(Box.createVerticalStrut(12));

        // Description
        descArea = new JTextArea(existing != null && existing.getDescription() != null ? existing.getDescription() : "", 3, 30);
        descArea.setFont(DevTrackFonts.BODY);
        descArea.setBackground(new Color(239, 235, 227)); // #EFEBE3
        descArea.setForeground(new Color(34, 30, 26));
        descArea.setCaretColor(new Color(34, 30, 26));
        descArea.setLineWrap(true);
        descArea.setWrapStyleWord(true);
        descArea.setBorder(new EmptyBorder(8, 10, 8, 10));

        JScrollPane descScroll = new JScrollPane(descArea);
        descScroll.setPreferredSize(new Dimension(460, 90));
        descScroll.setMinimumSize(new Dimension(460, 90));
        descScroll.setBorder(BorderFactory.createLineBorder(new Color(228, 222, 210), 1));
        descScroll.setOpaque(false);
        descScroll.getViewport().setOpaque(false);

        formContainer.add(createFormField("Description *", descScroll));
        formContainer.add(Box.createVerticalStrut(12));

        // GitHub URL
        githubField = new DTTextField(existing != null && existing.getGithubUrl() != null ? existing.getGithubUrl() : "", 30);
        githubField.setPlaceholder("https://github.com/username/repository (optional)");
        formContainer.add(createFormField("GitHub URL (optional)", githubField));

        JScrollPane formScroll = new JScrollPane(formContainer);
        formScroll.setBorder(null);
        formScroll.setOpaque(false);
        formScroll.getViewport().setOpaque(false);
        formScroll.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);

        mainPanel.add(formScroll, BorderLayout.CENTER);

        // Inline Validation Error Label
        JLabel errorLabel = new JLabel("");
        errorLabel.setFont(DevTrackFonts.CAPTION);
        errorLabel.setForeground(new Color(122, 42, 31)); // Error color #7A2A1F
        errorLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        errorLabel.setVisible(false);

        // 3. Footer Action Buttons ([ Cancel ] [ Add Project ])
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        footer.setOpaque(false);

        DTButton btnCancel = new DTButton("Cancel", DTButton.ButtonType.SECONDARY);
        btnCancel.setPreferredSize(new Dimension(100, 38));
        btnCancel.addActionListener(e -> dispose());

        DTButton btnSave = new DTButton(existing == null ? "Add Project" : "Save Project", DTButton.ButtonType.PRIMARY);
        btnSave.setPreferredSize(new Dimension(140, 38));
        btnSave.addActionListener(e -> saveProject(errorLabel));

        footer.add(btnCancel);
        footer.add(btnSave);

        JPanel southPanel = new JPanel();
        southPanel.setLayout(new BoxLayout(southPanel, BoxLayout.Y_AXIS));
        southPanel.setOpaque(false);
        southPanel.add(errorLabel);
        southPanel.add(Box.createVerticalStrut(8));
        southPanel.add(footer);

        mainPanel.add(southPanel, BorderLayout.SOUTH);

        // ESC Key Listener to cancel
        getRootPane().registerKeyboardAction(e -> dispose(), KeyStroke.getKeyStroke(KeyEvent.VK_ESCAPE, 0), JComponent.WHEN_IN_FOCUSED_WINDOW);

        // ENTER Key Listener on name & github fields to submit
        KeyAdapter enterSubmitter = new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                    saveProject(errorLabel);
                }
            }
        };
        nameField.addKeyListener(enterSubmitter);
        githubField.addKeyListener(enterSubmitter);

        setContentPane(mainPanel);
    }

    private JPanel createFormField(String labelText, JComponent inputComponent) {
        JPanel p = new JPanel(new BorderLayout(0, 4));
        p.setOpaque(false);
        p.setAlignmentX(Component.LEFT_ALIGNMENT);

        JLabel lbl = new JLabel(labelText);
        lbl.setFont(DevTrackFonts.CAPTION);
        lbl.setForeground(new Color(92, 85, 76)); // #5C554C
        lbl.setPreferredSize(new Dimension(300, 20));
        lbl.setMaximumSize(new Dimension(Integer.MAX_VALUE, 20));

        p.add(lbl, BorderLayout.NORTH);
        p.add(inputComponent, BorderLayout.CENTER);

        int targetH = 24 + inputComponent.getPreferredSize().height;
        p.setPreferredSize(new Dimension(p.getPreferredSize().width, targetH));
        p.setMaximumSize(new Dimension(Integer.MAX_VALUE, targetH));

        return p;
    }

    private void saveProject(JLabel errorLabel) {
        errorLabel.setVisible(false);
        String name = nameField.getText().trim();
        String desc = descArea.getText().trim();
        String github = githubField.getText().trim();

        if (name.isEmpty()) {
            errorLabel.setText("Project Name is required.");
            errorLabel.setVisible(true);
            return;
        }

        if (desc.isEmpty()) {
            errorLabel.setText("Description is required.");
            errorLabel.setVisible(true);
            return;
        }

        if (!github.isEmpty() && !github.toLowerCase().startsWith("http://") && !github.toLowerCase().startsWith("https://")) {
            github = "https://" + github;
        }

        ProjectService.ProjectResult res;
        if (existingProjectDetails == null) {
            res = projectService.createProject(studentId, name, desc, github, null, "Completed", null, null, new ArrayList<>());
        } else {
            int projectId = existingProjectDetails.getProject().getProjectId();
            res = projectService.updateProject(studentId, projectId, name, desc, github, null, "Completed", null, null, new ArrayList<>());
        }

        if (res.isSuccess()) {
            dispose();
            if (savedListener != null) {
                savedListener.onProjectSaved();
            }
        } else {
            errorLabel.setText(res.getMessage());
            errorLabel.setVisible(true);
        }
    }
}
