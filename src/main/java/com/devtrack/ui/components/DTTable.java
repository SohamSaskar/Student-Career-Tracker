package com.devtrack.ui.components;

import com.devtrack.ui.theme.DevTrackColors;
import com.devtrack.ui.theme.DevTrackFonts;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.JTableHeader;
import javax.swing.table.TableModel;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

/**
 * Custom DTTable component matching DevTrack Light/Slate aesthetic.
 */
public class DTTable extends JTable {

    private int hoverRow = -1;

    public DTTable() {
        super();
        initStyle();
    }

    public DTTable(TableModel model) {
        super(model);
        initStyle();
    }

    private void initStyle() {
        setFont(DevTrackFonts.BODY);
        setRowHeight(40);
        setShowGrid(true);
        setGridColor(DevTrackColors.BORDER_TABLE);
        setBackground(DevTrackColors.TABLE_ROW_DEFAULT);
        setForeground(DevTrackColors.TEXT_PRIMARY);
        setSelectionBackground(DevTrackColors.ACCENT_SUBTLE_BG);
        setSelectionForeground(DevTrackColors.ACCENT_PRIMARY);
        setFillsViewportHeight(true);

        // Header Styling
        JTableHeader header = getTableHeader();
        header.setFont(DevTrackFonts.FORM_LABEL);
        header.setBackground(DevTrackColors.TABLE_HEADER_BG);
        header.setForeground(DevTrackColors.TEXT_HEADINGS);
        header.setPreferredSize(new Dimension(100, 42));
        header.setBorder(BorderFactory.createMatteBorder(0, 0, 2, 0, DevTrackColors.BORDER_DEFAULT));

        // Cell Renderer with Alternating Row Colors and Hover State
        setDefaultRenderer(Object.class, new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
                JLabel lbl = (JLabel) super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                lbl.setFont(DevTrackFonts.BODY);
                lbl.setBorder(new EmptyBorder(6, 14, 6, 14));

                if (isSelected) {
                    lbl.setBackground(DevTrackColors.ACCENT_SUBTLE_BG);
                    lbl.setForeground(DevTrackColors.ACCENT_PRIMARY);
                } else if (row == hoverRow) {
                    lbl.setBackground(DevTrackColors.TABLE_ROW_HOVER);
                    lbl.setForeground(DevTrackColors.TEXT_PRIMARY);
                } else if (row % 2 == 1) {
                    lbl.setBackground(DevTrackColors.TABLE_ROW_STRIPE); // #F7F7F8 Light Stripe
                    lbl.setForeground(DevTrackColors.TEXT_PRIMARY);
                } else {
                    lbl.setBackground(DevTrackColors.TABLE_ROW_DEFAULT); // #FFFFFF Light Normal
                    lbl.setForeground(DevTrackColors.TEXT_PRIMARY);
                }
                return lbl;
            }
        });

        addMouseMotionListener(new MouseAdapter() {
            @Override
            public void mouseMoved(MouseEvent e) {
                int row = rowAtPoint(e.getPoint());
                if (row != hoverRow) {
                    hoverRow = row;
                    repaint();
                }
            }
        });

        addMouseListener(new MouseAdapter() {
            @Override
            public void mouseExited(MouseEvent e) {
                hoverRow = -1;
                repaint();
            }
        });
    }
}
