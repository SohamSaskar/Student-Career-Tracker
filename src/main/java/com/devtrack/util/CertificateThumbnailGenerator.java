package com.devtrack.util;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Robust utility for generating and caching high-quality, aspect-ratio-preserved thumbnails
 * for Certificate image files (JPG, JPEG, PNG) and PDF files (1st page rendering via PDFBox).
 *
 * Automatically detects and dynamically loads PDFBox from lib/ if missing from system -cp,
 * ensuring PDF thumbnails render 100% seamlessly without requiring special launcher flags or causing EDT crashes.
 */
public class CertificateThumbnailGenerator {

    private static final Map<String, ImageIcon> THUMBNAIL_CACHE = new ConcurrentHashMap<>();
    private static Boolean pdfBoxAvailable = null;
    private static ClassLoader pdfBoxClassLoader = null;

    /**
     * Obtains a ClassLoader capable of loading PDFBox classes.
     * Checks current System ClassLoader first, falling back to dynamic URLClassLoader over lib/pdfbox*.jar.
     */
    private static synchronized ClassLoader getPdfBoxClassLoader() {
        if (pdfBoxClassLoader != null) return pdfBoxClassLoader;
        ClassLoader parent = CertificateThumbnailGenerator.class.getClassLoader();

        try {
            Class.forName("org.apache.pdfbox.pdmodel.PDDocument", false, parent);
            pdfBoxClassLoader = parent;
            return pdfBoxClassLoader;
        } catch (Throwable ignored) {}

        // Dynamic fallback: locate pdfbox JAR inside lib/ directory
        try {
            File libDir = new File("lib");
            if (libDir.exists() && libDir.isDirectory()) {
                File[] jars = libDir.listFiles((dir, name) -> name.toLowerCase().contains("pdfbox") && name.toLowerCase().endsWith(".jar"));
                if (jars != null && jars.length > 0) {
                    URL[] urls = new URL[jars.length];
                    for (int i = 0; i < jars.length; i++) {
                        urls[i] = jars[i].toURI().toURL();
                    }
                    pdfBoxClassLoader = new URLClassLoader(urls, parent);
                    return pdfBoxClassLoader;
                }
            }
        } catch (Throwable ignored) {}

        pdfBoxClassLoader = parent;
        return pdfBoxClassLoader;
    }

    /**
     * Checks whether PDFBox library is available on runtime classpath or lib/ directory.
     */
    public static boolean isPdfBoxAvailable() {
        if (pdfBoxAvailable == null) {
            try {
                ClassLoader cl = getPdfBoxClassLoader();
                Class.forName("org.apache.pdfbox.pdmodel.PDDocument", false, cl);
                pdfBoxAvailable = true;
            } catch (Throwable t) {
                pdfBoxAvailable = false;
            }
        }
        return pdfBoxAvailable;
    }

    /**
     * Retrieves or generates a scaled thumbnail ImageIcon fitting within maxWidth x maxHeight.
     * Preserves original aspect ratio without stretching or cropping.
     */
    public static ImageIcon getThumbnail(String filePath, int maxWidth, int maxHeight) {
        if (filePath == null || filePath.isBlank()) {
            return createPlaceholderIcon("NO FILE", maxWidth, maxHeight);
        }

        try {
            File file = FileStorageUtil.resolveFile(filePath);
            if (file == null || !file.exists() || !file.isFile()) {
                return createPlaceholderIcon("FILE UNAVAILABLE", maxWidth, maxHeight);
            }

            String cacheKey = file.getAbsolutePath() + "_" + file.lastModified() + "_" + file.length() + "_" + maxWidth + "x" + maxHeight;
            if (THUMBNAIL_CACHE.containsKey(cacheKey)) {
                return THUMBNAIL_CACHE.get(cacheKey);
            }

            ImageIcon icon = generateThumbnail(file, maxWidth, maxHeight);
            if (icon != null) {
                THUMBNAIL_CACHE.put(cacheKey, icon);
            }
            return icon;
        } catch (Throwable t) {
            return createPlaceholderIcon("PREVIEW ERROR", maxWidth, maxHeight);
        }
    }

    private static ImageIcon generateThumbnail(File file, int maxWidth, int maxHeight) {
        String ext = FileStorageUtil.getFileExtension(file.getName()).toLowerCase();

        try {
            BufferedImage srcImage = null;

            if (ext.equals("pdf")) {
                srcImage = renderPdfFirstPageSafe(file);
            } else if (ext.equals("png") || ext.equals("jpg") || ext.equals("jpeg")) {
                srcImage = ImageIO.read(file);
            }

            if (srcImage == null) {
                return createPlaceholderIcon(ext.toUpperCase(), maxWidth, maxHeight);
            }

            BufferedImage cardCanvas = createCardCanvas(srcImage, maxWidth, maxHeight);
            return new ImageIcon(cardCanvas);

        } catch (Throwable t) {
            return createPlaceholderIcon(ext.toUpperCase(), maxWidth, maxHeight);
        }
    }

    /**
     * Safely renders the first page of a PDF file using PDFBox via dynamic ClassLoader reflection.
     */
    private static BufferedImage renderPdfFirstPageSafe(File pdfFile) {
        if (!isPdfBoxAvailable()) {
            return null;
        }

        try {
            ClassLoader cl = getPdfBoxClassLoader();
            Class<?> docClass = Class.forName("org.apache.pdfbox.pdmodel.PDDocument", true, cl);
            Method loadMethod = docClass.getMethod("load", File.class);
            Object document = loadMethod.invoke(null, pdfFile);

            if (document != null) {
                try {
                    Method getPagesMethod = docClass.getMethod("getNumberOfPages");
                    int numPages = (Integer) getPagesMethod.invoke(document);

                    if (numPages > 0) {
                        Class<?> rendererClass = Class.forName("org.apache.pdfbox.rendering.PDFRenderer", true, cl);
                        Object renderer = rendererClass.getConstructor(docClass).newInstance(document);
                        Method renderDpiMethod = rendererClass.getMethod("renderImageWithDPI", int.class, float.class);

                        // Render first page at 96 DPI
                        return (BufferedImage) renderDpiMethod.invoke(renderer, 0, 96f);
                    }
                } finally {
                    Method closeMethod = docClass.getMethod("close");
                    closeMethod.invoke(document);
                }
            }
        } catch (Throwable t) {
            // Silently fallback to placeholder icon if rendering fails
        }
        return null;
    }

    private static BufferedImage createCardCanvas(BufferedImage srcImage, int targetWidth, int targetHeight) {
        int srcW = srcImage.getWidth();
        int srcH = srcImage.getHeight();

        double widthRatio = (double) targetWidth / srcW;
        double heightRatio = (double) targetHeight / srcH;
        double ratio = Math.min(widthRatio, heightRatio);

        int scaledW = (int) Math.round(srcW * ratio);
        int scaledH = (int) Math.round(srcH * ratio);

        scaledW = Math.max(1, Math.min(scaledW, targetWidth));
        scaledH = Math.max(1, Math.min(scaledH, targetHeight));

        BufferedImage canvas = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = canvas.createGraphics();

        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);

        // Fill warm neutral framed container background (#E5DFD3) - 100% full frame width & height
        g2.setColor(new Color(229, 223, 211));
        g2.fillRect(0, 0, targetWidth, targetHeight);

        // Draw centered scaled image
        int x = (targetWidth - scaledW) / 2;
        int y = (targetHeight - scaledH) / 2;
        g2.drawImage(srcImage, x, y, scaledW, scaledH, null);

        // Draw 1.5px border matching #E4DED2
        g2.setColor(new Color(228, 222, 210));
        g2.setStroke(new BasicStroke(1.5f));
        g2.drawRect(0, 0, targetWidth - 1, targetHeight - 1);

        g2.dispose();
        return canvas;
    }

    public static ImageIcon createPlaceholderIcon(String label, int targetWidth, int targetHeight) {
        BufferedImage canvas = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = canvas.createGraphics();

        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Warm neutral thumbnail container (#E5DFD3) - 100% full frame width & height
        g2.setColor(new Color(229, 223, 211));
        g2.fillRect(0, 0, targetWidth, targetHeight);

        // Border #E4DED2
        g2.setColor(new Color(228, 222, 210));
        g2.setStroke(new BasicStroke(1.5f));
        g2.drawRect(0, 0, targetWidth - 1, targetHeight - 1);

        // Document sheet representation
        int docW = 34;
        int docH = 42;
        int docX = (targetWidth - docW) / 2;
        int docY = (targetHeight - docH) / 2 - 8;

        g2.setColor(new Color(243, 240, 234)); // #F3F0EA
        g2.fillRect(docX, docY, docW, docH);
        g2.setColor(new Color(143, 135, 121)); // #8F8779
        g2.setStroke(new BasicStroke(1.0f));
        g2.drawRect(docX, docY, docW, docH);

        // Document lines
        g2.setColor(new Color(196, 188, 174));
        g2.drawLine(docX + 6, docY + 10, docX + docW - 6, docY + 10);
        g2.drawLine(docX + 6, docY + 18, docX + docW - 6, docY + 18);
        g2.drawLine(docX + 6, docY + 26, docX + docW - 12, docY + 26);

        // Label text below document
        g2.setFont(new Font("Segoe UI", Font.BOLD, 10));
        g2.setColor(new Color(139, 58, 43)); // Rust accent #8B3A2B
        FontMetrics fm = g2.getFontMetrics();
        int textW = fm.stringWidth(label);
        g2.drawString(label, (targetWidth - textW) / 2, targetHeight - 10);

        g2.dispose();
        return new ImageIcon(canvas);
    }
}
