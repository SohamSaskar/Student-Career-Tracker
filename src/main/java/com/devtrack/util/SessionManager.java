package com.devtrack.util;

import com.devtrack.model.Student;

/**
 * Global Session Manager for DevTrack Application.
 * Manages the current authenticated student session across screens.
 */
public class SessionManager {

    private static SessionManager instance;

    private Student currentStudent;

    private SessionManager() {}

    public static synchronized SessionManager getInstance() {
        if (instance == null) {
            instance = new SessionManager();
        }
        return instance;
    }

    /**
     * Starts session for authenticated student.
     */
    public synchronized void login(Student student) {
        this.currentStudent = student;
    }

    /**
     * Clears current authenticated session on logout.
     */
    public synchronized void logout() {
        this.currentStudent = null;
    }

    /**
     * Returns true if a valid user session is currently active.
     */
    public synchronized boolean isLoggedIn() {
        return currentStudent != null;
    }

    /**
     * Returns currently authenticated Student object or null if not logged in.
     */
    public synchronized Student getCurrentStudent() {
        return currentStudent;
    }

    /**
     * Returns current student_id or 1 as fallback if session is not initialized.
     */
    public synchronized int getCurrentStudentId() {
        return currentStudent != null ? currentStudent.getStudentId() : -1;
    }
}
