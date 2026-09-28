package com.devtrack.service;

import com.devtrack.dao.StudentDAO;
import com.devtrack.model.Student;
import com.devtrack.util.BCrypt;
import com.devtrack.util.SessionManager;

/**
 * Authentication Service handling Login, Signup, Validation, and Password Security.
 */
public class AuthService {

    private final StudentDAO studentDAO;

    public AuthService() {
        this.studentDAO = new StudentDAO();
    }

    public AuthService(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }

    public static class AuthResult {
        private final boolean success;
        private final String message;
        private final Student student;

        public AuthResult(boolean success, String message, Student student) {
            this.success = success;
            this.message = message;
            this.student = student;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public Student getStudent() { return student; }
    }

    /**
     * Authenticates student with username and password.
     */
    public AuthResult login(String username, String password) {
        if (isEmpty(username) || isEmpty(password)) {
            return new AuthResult(false, "Username or password is incorrect.", null);
        }

        String normalizedUsername = username.trim().toLowerCase();
        Student student = studentDAO.getStudentByUsername(normalizedUsername);

        if (student == null) {
            return new AuthResult(false, "Username or password is incorrect.", null);
        }

        if (student.getPasswordHash() == null || student.getPasswordHash().trim().isEmpty()) {
            return new AuthResult(false, "Username or password is incorrect.", null);
        }

        boolean validPassword = BCrypt.checkpw(password, student.getPasswordHash());

        if (validPassword) {
            SessionManager.getInstance().login(student);
            return new AuthResult(true, "Login successful", student);
        } else {
            return new AuthResult(false, "Username or password is incorrect.", null);
        }
    }

    /**
     * Registers a new student account after thorough validation.
     */
    public AuthResult signup(String name, String username, String email, String password, String confirmPassword,
                             String college, String branch, String yearStr) {

        if (isEmpty(name) || isEmpty(username) || isEmpty(email) || isEmpty(password) || isEmpty(confirmPassword) ||
            isEmpty(college) || isEmpty(branch) || isEmpty(yearStr)) {
            return new AuthResult(false, "Please fill in all required fields.", null);
        }

        String trimmedUsername = username.trim();
        String normalizedEmail = email.trim().toLowerCase();

        // Username format check: letters, numbers, underscores only
        if (!trimmedUsername.matches("^[a-zA-Z0-9_]+$")) {
            return new AuthResult(false, "Username can contain letters, numbers, and underscores only.", null);
        }

        if (trimmedUsername.length() < 3 || trimmedUsername.length() > 50) {
            return new AuthResult(false, "Username must be between 3 and 50 characters long.", null);
        }

        // Duplicate Username check
        if (studentDAO.usernameExists(trimmedUsername)) {
            return new AuthResult(false, "Username is already taken.", null);
        }

        // Email format check
        if (!normalizedEmail.contains("@") || !normalizedEmail.contains(".") || normalizedEmail.length() < 5) {
            return new AuthResult(false, "Please enter a valid email address.", null);
        }

        // Duplicate Email check
        if (studentDAO.emailExists(normalizedEmail)) {
            return new AuthResult(false, "An account with this email already exists.", null);
        }

        // Password length check
        if (password.length() < 8) {
            return new AuthResult(false, "Password must be at least 8 characters long.", null);
        }

        // Confirm Password match check
        if (!password.equals(confirmPassword)) {
            return new AuthResult(false, "Passwords do not match.", null);
        }

        // Academic year integer validation
        int year;
        try {
            year = Integer.parseInt(yearStr.trim());
            if (year < 1 || year > 6) {
                return new AuthResult(false, "Please enter a valid academic year (1-6).", null);
            }
        } catch (NumberFormatException e) {
            return new AuthResult(false, "Please enter a valid academic year (1-6).", null);
        }

        // Hash password with BCrypt
        String passwordHash = BCrypt.hashpw(password, BCrypt.gensalt());

        // Create student model
        Student newStudent = new Student(0, name.trim(), trimmedUsername.toLowerCase(), normalizedEmail, passwordHash, college.trim(), branch.trim(), year, null);

        int newStudentId = studentDAO.createStudent(newStudent, passwordHash);

        if (newStudentId > 0) {
            SessionManager.getInstance().login(newStudent);
            return new AuthResult(true, "Account created successfully.", newStudent);
        } else {
            return new AuthResult(false, "Unable to complete the request. Please try again.", null);
        }
    }

    /**
     * Legacy signup overload for backward compatibility during migration/testing.
     */
    public AuthResult signup(String name, String email, String password, String confirmPassword,
                             String college, String branch, String yearStr) {
        String baseUsername = name != null ? name.toLowerCase().replaceAll("[^a-z0-9_]", "_") : "user";
        if (baseUsername.length() < 3) baseUsername = baseUsername + "123";
        String candidate = baseUsername;
        int counter = 2;
        while (studentDAO.usernameExists(candidate)) {
            candidate = baseUsername + counter;
            counter++;
        }
        return signup(name, candidate, email, password, confirmPassword, college, branch, yearStr);
    }

    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
