-- ============================================================================
-- DevTrack — Student Career Readiness Platform
-- Database Schema Script (3NF Normalized Architecture)
-- Target Database: MySQL 8.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS devtrack;
USE devtrack;

-- Disable foreign key checks for clean structure recreation
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS certification_skills;
DROP TABLE IF EXISTS certifications;
DROP TABLE IF EXISTS project_skills;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS student_career_goals;
DROP TABLE IF EXISTS student_skills;
DROP TABLE IF EXISTS role_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS career_roles;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS opportunity_skills;
DROP TABLE IF EXISTS opportunities;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS students;

DROP VIEW IF EXISTS vw_student_career_readiness;
DROP VIEW IF EXISTS vw_student_skill_gap;
DROP PROCEDURE IF EXISTS sp_calculate_student_readiness;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. CORE TABLES
-- ============================================================================

-- Students Table (User Authentication & Profile)
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    college VARCHAR(150) DEFAULT 'Sanjivani University',
    branch VARCHAR(100) DEFAULT 'AI & Data Science',
    year_of_study VARCHAR(20) DEFAULT '3',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Career Roles Table (Target Industry Roles)
CREATE TABLE career_roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Skills Inventory Table
CREATE TABLE skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Role Skills Junction (Skill requirements per career role with importance weight)
CREATE TABLE role_skills (
    role_id INT NOT NULL,
    skill_id INT NOT NULL,
    importance_weight INT DEFAULT 1,
    PRIMARY KEY (role_id, skill_id),
    FOREIGN KEY (role_id) REFERENCES career_roles(role_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Student Skills Table (Individual Student Skill Inventory & Status)
CREATE TABLE student_skills (
    student_id INT NOT NULL,
    skill_id INT NOT NULL,
    status ENUM('Not Started', 'Learning', 'Completed') NOT NULL DEFAULT 'Not Started',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, skill_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Student Career Goal Table (Selected Target Career Role)
CREATE TABLE student_career_goals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    role_id INT NOT NULL,
    set_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES career_roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Projects Table (Student Software Projects Vault)
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    github_url VARCHAR(255),
    live_demo_url VARCHAR(255),
    status ENUM('Planned', 'In Progress', 'Completed') DEFAULT 'In Progress',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Project Skills Junction Table
CREATE TABLE project_skills (
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Certifications Table (Student Verified Certifications Vault)
CREATE TABLE certifications (
    certification_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    certificate_name VARCHAR(150) NOT NULL,
    issuer VARCHAR(120) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(100),
    credential_url VARCHAR(255),
    certificate_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Certification Skills Junction Table
CREATE TABLE certification_skills (
    certification_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (certification_id, skill_id),
    FOREIGN KEY (certification_id) REFERENCES certifications(certification_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Companies Table (Legacy / Extended Opportunity Tracking)
CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL UNIQUE,
    website VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Opportunities Table
CREATE TABLE opportunities (
    opportunity_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    role_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    location VARCHAR(100),
    type ENUM('Full-time', 'Internship', 'Contract') DEFAULT 'Full-time',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES career_roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Opportunity Skills Junction Table
CREATE TABLE opportunity_skills (
    opportunity_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (opportunity_id, skill_id),
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(opportunity_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Applications Table
CREATE TABLE applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    opportunity_id INT NOT NULL,
    status ENUM('Applied', 'Interviewing', 'Offered', 'Rejected') DEFAULT 'Applied',
    applied_date DATE NOT NULL,
    notes TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(opportunity_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- 2. INDEXES FOR FAST QUERYING
-- ============================================================================
CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_student_username ON students(username);
CREATE INDEX idx_student_skills_student ON student_skills(student_id);
CREATE INDEX idx_projects_student ON projects(student_id);
CREATE INDEX idx_certifications_student ON certifications(student_id);

-- ============================================================================
-- 3. VIEWS
-- ============================================================================

-- View: Student Career Readiness Summary
CREATE OR REPLACE VIEW vw_student_career_readiness AS
SELECT 
    s.student_id,
    s.full_name,
    cr.role_name AS target_role,
    COUNT(DISTINCT rs.skill_id) AS total_required_skills,
    COUNT(DISTINCT CASE WHEN ss.status = 'Completed' THEN rs.skill_id END) AS completed_required_skills,
    COUNT(DISTINCT CASE WHEN ss.status = 'Learning' THEN rs.skill_id END) AS learning_required_skills,
    COUNT(DISTINCT CASE WHEN ss.status IS NULL OR ss.status = 'Not Started' THEN rs.skill_id END) AS missing_required_skills,
    ROUND(
        (COUNT(DISTINCT CASE WHEN ss.status = 'Completed' THEN rs.skill_id END) * 100.0) / 
        NULLIF(COUNT(DISTINCT rs.skill_id), 0), 0
    ) AS readiness_percentage
FROM students s
JOIN student_career_goals scg ON s.student_id = scg.student_id
JOIN career_roles cr ON scg.role_id = cr.role_id
JOIN role_skills rs ON cr.role_id = rs.role_id
LEFT JOIN student_skills ss ON s.student_id = ss.student_id AND rs.skill_id = ss.skill_id
GROUP BY s.student_id, s.full_name, cr.role_name;

-- View: Student Skill Gap Analysis
CREATE OR REPLACE VIEW vw_student_skill_gap AS
SELECT 
    scg.student_id,
    cr.role_name AS target_role,
    sk.skill_id,
    sk.skill_name,
    sk.category,
    rs.importance_weight,
    COALESCE(ss.status, 'Not Started') AS student_status
FROM student_career_goals scg
JOIN career_roles cr ON scg.role_id = cr.role_id
JOIN role_skills rs ON cr.role_id = rs.role_id
JOIN skills sk ON rs.skill_id = sk.skill_id
LEFT JOIN student_skills ss ON scg.student_id = ss.student_id AND rs.skill_id = ss.skill_id;

-- ============================================================================
-- 4. STORED PROCEDURE
-- ============================================================================

DELIMITER //

CREATE PROCEDURE sp_calculate_student_readiness(IN p_student_id INT, OUT p_readiness_pct INT)
BEGIN
    DECLARE v_total INT DEFAULT 0;
    DECLARE v_completed INT DEFAULT 0;
    
    SELECT 
        COUNT(DISTINCT rs.skill_id),
        COUNT(DISTINCT CASE WHEN ss.status = 'Completed' THEN rs.skill_id END)
    INTO v_total, v_completed
    FROM student_career_goals scg
    JOIN role_skills rs ON scg.role_id = rs.role_id
    LEFT JOIN student_skills ss ON scg.student_id = ss.student_id AND rs.skill_id = ss.skill_id
    WHERE scg.student_id = p_student_id;
    
    IF v_total = 0 THEN
        SET p_readiness_pct = 0;
    ELSE
        SET p_readiness_pct = ROUND((v_completed * 100.0) / v_total, 0);
    END IF;
END //

DELIMITER ;
