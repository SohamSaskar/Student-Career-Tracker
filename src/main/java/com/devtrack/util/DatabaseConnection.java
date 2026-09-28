package com.devtrack.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Reusable JDBC Utility to manage MySQL connections for DevTrack.
 * Securely supports environment variables, system properties, and local gitignored db.properties file.
 */
public class DatabaseConnection {

    private static final String DEFAULT_URL = "jdbc:mysql://localhost:3306/devtrack?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASSWORD = "";

    private static final Properties props = new Properties();

    static {
        // Register MySQL JDBC Driver
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("ERROR: MySQL JDBC Driver not found in classpath.");
        }

        // Load gitignored local db.properties file if present in project root
        File propFile = new File("db.properties");
        if (propFile.exists()) {
            try (InputStream input = new FileInputStream(propFile)) {
                props.load(input);
            } catch (Exception e) {
                // Silently fallback if unable to read file
            }
        }
    }

    /**
     * Establishes and returns a new JDBC connection to the 'devtrack' database.
     * Order of precedence for credentials:
     * 1. Environment variables (MYSQL_USER, MYSQL_PASSWORD or DB_USER, DB_PASSWORD)
     * 2. JVM System properties (-Ddb.user, -Ddb.password)
     * 3. Local gitignored db.properties file (db.user, db.password)
     * 4. Default fallbacks
     */
    public static Connection getConnection() throws SQLException {
        String url = getEnvOrProp("DB_URL", "db.url", DEFAULT_URL);
        
        String user = getEnvOrProp("MYSQL_USER", "db.user", null);
        if (user == null || user.isEmpty()) {
            user = getEnvOrProp("DB_USER", "db.user", DEFAULT_USER);
        }

        String password = getEnvOrProp("MYSQL_PASSWORD", "db.password", null);
        if (password == null) {
            password = getEnvOrProp("DB_PASSWORD", "db.password", DEFAULT_PASSWORD);
        }

        return DriverManager.getConnection(url, user, password);
    }

    private static String getEnvOrProp(String envName, String propName, String defaultValue) {
        String envVal = System.getenv(envName);
        if (envVal != null && !envVal.isEmpty()) {
            return envVal;
        }
        String sysProp = System.getProperty(propName);
        if (sysProp != null && !sysProp.isEmpty()) {
            return sysProp;
        }
        String fileProp = props.getProperty(propName);
        if (fileProp != null) {
            return fileProp;
        }
        return defaultValue;
    }
}
