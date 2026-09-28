package com.devtrack.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * File Storage Utility for DevTrack Application.
 * Handles safe file uploads, relative path storage, format validation,
 * unique filename generation, and directory initialization.
 */
public class FileStorageUtil {

    private static final String UPLOADS_DIR = "uploads";
    private static final String CERTIFICATES_SUBDIR = "certificates";
    private static final String PROJECTS_SUBDIR = "projects";

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "png", "jpg", "jpeg");
    private static final long MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

    public static class FileUploadResult {
        private final boolean success;
        private final String relativePath;
        private final String message;

        public FileUploadResult(boolean success, String relativePath, String message) {
            this.success = success;
            this.relativePath = relativePath;
            this.message = message;
        }

        public boolean isSuccess() { return success; }
        public String getRelativePath() { return relativePath; }
        public String getMessage() { return message; }
    }

    /**
     * Initializes upload directories if they do not exist.
     */
    public static void initDirectories() {
        try {
            Path certPath = Paths.get(UPLOADS_DIR, CERTIFICATES_SUBDIR);
            Path projPath = Paths.get(UPLOADS_DIR, PROJECTS_SUBDIR);

            if (!Files.exists(certPath)) {
                Files.createDirectories(certPath);
            }
            if (!Files.exists(projPath)) {
                Files.createDirectories(projPath);
            }
        } catch (IOException e) {
            System.err.println("Warning: Failed to create upload directories: " + e.getMessage());
        }
    }

    /**
     * Validates and stores a certificate document or image file.
     * Returns a safe relative path for database storage.
     */
    public static FileUploadResult saveCertificateFile(File sourceFile) {
        return saveFile(sourceFile, CERTIFICATES_SUBDIR, "cert");
    }

    /**
     * Validates and stores a project attachment file.
     */
    public static FileUploadResult saveProjectFile(File sourceFile) {
        return saveFile(sourceFile, PROJECTS_SUBDIR, "proj");
    }

    private static FileUploadResult saveFile(File sourceFile, String subDir, String prefix) {
        if (sourceFile == null || !sourceFile.exists() || !sourceFile.isFile()) {
            return new FileUploadResult(false, null, "Selected file does not exist or is invalid.");
        }

        if (sourceFile.length() > MAX_FILE_SIZE_BYTES) {
            return new FileUploadResult(false, null, "File exceeds maximum size limit of 25MB.");
        }

        String origName = sourceFile.getName();
        String ext = getFileExtension(origName).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            return new FileUploadResult(false, null, "Unsupported file type. Please upload PDF, PNG, JPG, or JPEG.");
        }

        initDirectories();

        String uniqueName = prefix + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + "." + ext;
        Path targetPath = Paths.get(UPLOADS_DIR, subDir, uniqueName);

        try {
            Files.copy(sourceFile.toPath(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            String relativePath = Paths.get(UPLOADS_DIR, subDir, uniqueName).toString().replace("\\", "/");
            return new FileUploadResult(true, relativePath, "File saved successfully.");
        } catch (IOException ex) {
            return new FileUploadResult(false, null, "Failed to copy file: " + ex.getMessage());
        }
    }

    /**
     * Resolves a stored relative path to an absolute File object.
     */
    public static File resolveFile(String relativePath) {
        if (relativePath == null || relativePath.isBlank()) return null;
        File file = new File(relativePath);
        if (file.exists()) return file;

        // Try resolving against working directory
        File localFile = new File(System.getProperty("user.dir"), relativePath);
        if (localFile.exists()) return localFile;

        return null;
    }

    public static String getFileExtension(String filename) {
        if (filename == null) return "";
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex >= 0 && dotIndex < filename.length() - 1) ? filename.substring(dotIndex + 1) : "";
    }
}
