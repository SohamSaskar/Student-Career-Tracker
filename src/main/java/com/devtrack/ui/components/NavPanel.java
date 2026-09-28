package com.devtrack.ui.components;

import com.devtrack.dao.StudentDAO;
import com.devtrack.model.Student;
import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;
import com.devtrack.util.SessionManager;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Refined Top Horizontal Navigation Bar Component for DevTrack.
 * Features:
 * - Pure #FFFFFF background with 1px #E4DED2 bottom border
 * - DEVTRACK brand wordmark in 700 bold Primary Navy (#0D1B33)
 * - Refined navigation items with subtle #DCE0E6 hover state
 * - Active state indicator: Primary Navy (#0D1B33) text + 3px bottom indicator line
 * - Authenticated session student user badge
 * - Restrained Logout button with subtle red hover emphasis
 */
public class NavPanel extends JPanel {

    public interface OnTabSelectedListener {
        void onTabSelected(String tabName);
    }

    public interface OnLogoutListener {
        void onLogout();
    }

    private String activeTab = "Dashboard";
    private final String[] navItems = {
        "Dashboard",
        "Skill Gap",
        "Recommended Skills",
        "Learning Roadmap",
        "Project Vault",
        "Certification Vault",
        "Career",
        "Skills",
        "Profile"
    };

    private final JPanel itemsContainer;
    private OnTabSelectedListener listener;
    private OnLogoutListener logoutListener;

    public NavPanel(OnTabSelectedListener listener) {
        this(listener, null);
    }

    public NavPanel(OnTabSelectedListener listener, OnLogoutListener logoutListener) {
        this.listener = listener;
        this.logoutListener = logoutListener;

        setLayout(new BorderLayout());
        setBackground(Color.WHITE);
        setPreferredSize(new Dimension(1240, 64));
        setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, new Color(228, 222, 210))); // #E4DED2 1px border

        // Left Brand Wordmark
        JPanel brandPanel = new JPanel(new GridBagLayout());
        brandPanel.setOpaque(false);
        brandPanel.setBorder(new EmptyBorder(0, 24, 0, 16));

        JLabel logoLabel = new JLabel("DEVTRACK");
        logoLabel.setFont(new Font(DevTrackFonts.FONT_FAMILY, Font.BOLD, 18));
        logoLabel.setForeground(new Color(13, 27, 51)); // #0D1B33 Primary Navy
        brandPanel.add(logoLabel);

        add(brandPanel, BorderLayout.WEST);

        // Right Navigation Links, User Badge, and Logout Button
        itemsContainer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 4, 12));
        itemsContainer.setOpaque(false);
        itemsContainer.setBorder(new EmptyBorder(0, 0, 0, 24));

        refreshNav();

        add(itemsContainer, BorderLayout.EAST);
    }

    public void setOnLogoutListener(OnLogoutListener logoutListener) {
        this.logoutListener = logoutListener;
    }

    public void setActiveTab(String tabName) {
        this.activeTab = tabName;
        refreshNav();
    }

    private JComponent createNavItem(String title) {
        NavItemButton btn = new NavItemButton(title, title.equals(activeTab));
        btn.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                activeTab = title;
                refreshNav();
                if (listener != null) {
                    listener.onTabSelected(title);
                }
            }
        });
        return btn;
    }

    private Component createUserBadge() {
        String studentName = "";
        try {
            int studentId = SessionManager.getInstance().getCurrentStudentId();
            if (studentId > 0) {
                Student s = new StudentDAO().getStudentById(studentId);
                if (s != null && s.getName() != null && !s.getName().isBlank()) {
                    studentName = s.getName().trim().split("\\s+")[0];
                }
            }
        } catch (Exception ex) {
            studentName = "";
        }

        if (studentName.isBlank()) {
            return Box.createHorizontalStrut(0);
        }

        JPanel userPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 6, 0));
        userPanel.setOpaque(false);
        userPanel.setBorder(new EmptyBorder(6, 12, 6, 12));

        JLabel lblDot = new JLabel("●");
        lblDot.setFont(new Font(DevTrackFonts.FONT_FAMILY, Font.PLAIN, 10));
        lblDot.setForeground(new Color(18, 61, 44)); // Bottle green dot #123D2C

        JLabel lblUser = new JLabel(studentName);
        lblUser.setFont(new Font(DevTrackFonts.FONT_FAMILY, Font.BOLD, 14));
        lblUser.setForeground(new Color(16, 19, 24)); // #101318

        userPanel.add(lblDot);
        userPanel.add(lblUser);

        return userPanel;
    }

    private JComponent createLogoutButton() {
        LogoutButton btn = new LogoutButton("Logout");
        btn.addActionListener(e -> {
            if (logoutListener != null) {
                logoutListener.onLogout();
            }
        });
        return btn;
    }

    private void refreshNav() {
        itemsContainer.removeAll();
        for (String item : navItems) {
            itemsContainer.add(createNavItem(item));
        }

        Component userBadge = createUserBadge();
        itemsContainer.add(Box.createHorizontalStrut(8));
        itemsContainer.add(userBadge);
        itemsContainer.add(Box.createHorizontalStrut(4));
        itemsContainer.add(createLogoutButton());

        itemsContainer.revalidate();
        itemsContainer.repaint();
    }

    /**
     * Refined Nav Item Button with subtle hover and 3px Navy bottom active indicator line.
     */
    private class NavItemButton extends JButton {
        private final boolean isActive;
        private boolean isHovered = false;

        public NavItemButton(String text, boolean isActive) {
            super(text);
            this.isActive = isActive;
            setFocusPainted(false);
            setBorderPainted(false);
            setContentAreaFilled(false);
            setFont(new Font(DevTrackFonts.FONT_FAMILY, isActive ? Font.BOLD : Font.PLAIN, 14));
            setForeground(isActive ? new Color(13, 27, 51) : new Color(75, 80, 90)); // #0D1B33 vs #4B505A
            setCursor(new Cursor(Cursor.HAND_CURSOR));
            setBorder(new EmptyBorder(8, 12, 8, 12));

            addMouseListener(new MouseAdapter() {
                @Override
                public void mouseEntered(MouseEvent e) {
                    isHovered = true;
                    if (!isActive) {
                        setForeground(new Color(16, 19, 24)); // #101318 on hover
                    }
                    repaint();
                }

                @Override
                public void mouseExited(MouseEvent e) {
                    isHovered = false;
                    if (!isActive) {
                        setForeground(new Color(75, 80, 90)); // #4B505A default
                    }
                    repaint();
                }
            });
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

            int w = getWidth();
            int h = getHeight();

            if (isActive) {
                // Active: Primary Navy 3px bottom indicator line aligned with item
                g2.setColor(new Color(13, 27, 51)); // #0D1B33 Primary Navy
                g2.fillRoundRect(6, h - 3, w - 12, 3, 2, 2);
            } else if (isHovered) {
                // Hover: Subtle neutral fill #DCE0E6
                g2.setColor(new Color(220, 224, 230)); // #DCE0E6
                g2.fillRoundRect(2, 4, w - 4, h - 8, 6, 6);
            }

            super.paintComponent(g2);
            g2.dispose();
        }
    }

    /**
     * Refined Secondary Logout Button with subtle red hover emphasis.
     */
    private class LogoutButton extends JButton {
        private boolean isHovered = false;

        public LogoutButton(String text) {
            super(text);
            setFocusPainted(false);
            setBorderPainted(false);
            setContentAreaFilled(false);
            setFont(new Font(DevTrackFonts.FONT_FAMILY, Font.PLAIN, 14));
            setForeground(new Color(75, 80, 90)); // #4B505A default
            setCursor(new Cursor(Cursor.HAND_CURSOR));
            setBorder(new EmptyBorder(8, 12, 8, 12));

            addMouseListener(new MouseAdapter() {
                @Override
                public void mouseEntered(MouseEvent e) {
                    isHovered = true;
                    setForeground(new Color(179, 38, 30)); // Red #B3261E on hover
                    repaint();
                }

                @Override
                public void mouseExited(MouseEvent e) {
                    isHovered = false;
                    setForeground(new Color(75, 80, 90)); // Secondary text default
                    repaint();
                }
            });
        }

        @Override
        protected void paintComponent(Graphics g) {
            Graphics2D g2 = (Graphics2D) g.create();
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            if (isHovered) {
                g2.setColor(new Color(252, 232, 230)); // Soft red hover fill #FCE8E6
                g2.fillRoundRect(2, 4, getWidth() - 4, getHeight() - 8, 6, 6);
            }

            super.paintComponent(g2);
            g2.dispose();
        }
    }
}
