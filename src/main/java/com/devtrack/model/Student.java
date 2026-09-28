package com.devtrack.model;

import java.sql.Timestamp;

/**
 * Model representing a Student entity from MySQL 'students' table.
 */
public class Student {
    private int studentId;
    private String name;
    private String username;
    private String email;
    private String passwordHash;
    private String college;
    private String branch;
    private int year;
    private Timestamp createdAt;

    public Student() {}

    public Student(int studentId, String name, String email, String college, String branch, int year, Timestamp createdAt) {
        this(studentId, name, null, email, null, college, branch, year, createdAt);
    }

    public Student(int studentId, String name, String email, String passwordHash, String college, String branch, int year, Timestamp createdAt) {
        this(studentId, name, null, email, passwordHash, college, branch, year, createdAt);
    }

    public Student(int studentId, String name, String username, String email, String passwordHash, String college, String branch, int year, Timestamp createdAt) {
        this.studentId = studentId;
        this.name = name;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.college = college;
        this.branch = branch;
        this.year = year;
        this.createdAt = createdAt;
    }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstName() {
        if (name == null || name.trim().isEmpty()) return "Student";
        return name.trim().split("\\s+")[0];
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
