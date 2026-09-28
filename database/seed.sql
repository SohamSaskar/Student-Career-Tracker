-- ============================================================================
-- DevTrack — Student Career Readiness Platform
-- Database Seed Data Script
-- ============================================================================

USE devtrack;

-- Disable foreign key checks for seeding
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Seed Core Skills
INSERT INTO skills (skill_id, skill_name, category) VALUES
(1, 'Java', 'Languages'),
(2, 'Python', 'Languages'),
(3, 'JavaScript', 'Languages'),
(4, 'SQL', 'Databases'),
(5, 'HTML/CSS', 'Frontend'),
(6, 'Git', 'Tools'),
(7, 'React', 'Frontend'),
(8, 'DSA', 'Core CS'),
(9, 'OOP', 'Core CS'),
(10, 'REST API', 'Backend'),
(11, 'Spring Boot', 'Backend'),
(12, 'Docker', 'DevOps'),
(13, 'AWS', 'Cloud'),
(14, 'System Design', 'Architecture'),
(15, 'PostgreSQL', 'Databases'),
(16, 'Node.js', 'Backend'),
(17, 'TypeScript', 'Languages'),
(18, 'MongoDB', 'Databases'),
(19, 'Machine Learning', 'AI/DS'),
(20, 'Pandas', 'AI/DS')
ON DUPLICATE KEY UPDATE skill_name=VALUES(skill_name);

-- 2. Seed Career Roles
INSERT INTO career_roles (role_id, role_name, description) VALUES
(1, 'Backend Developer', 'Designs, builds, and maintains server-side web applications, databases, and microservice APIs.'),
(2, 'Full Stack Engineer', 'Handles end-to-end development of web applications, combining frontend interfaces with robust backend services.'),
(3, 'Data Engineer', 'Builds data pipelines, analytics infrastructure, and data warehouse architectures.'),
(4, 'Mobile App Developer', 'Develops native and cross-platform applications for iOS and Android mobile platforms.')
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name);

-- 3. Seed Role Skill Requirements (Weights 1 to 5)
INSERT INTO role_skills (role_id, skill_id, importance_weight) VALUES
-- Backend Developer Requirements
(1, 1, 5),  -- Java
(1, 4, 5),  -- SQL
(1, 6, 4),  -- Git
(1, 8, 4),  -- DSA
(1, 10, 5), -- REST API
(1, 11, 5), -- Spring Boot
(1, 12, 3), -- Docker
(1, 14, 4), -- System Design

-- Full Stack Engineer Requirements
(2, 3, 5),  -- JavaScript
(2, 5, 4),  -- HTML/CSS
(2, 7, 5),  -- React
(2, 10, 5), -- REST API
(2, 16, 4), -- Node.js
(2, 4, 4),  -- SQL
(2, 6, 4),  -- Git
(2, 17, 3), -- TypeScript

-- Data Engineer Requirements
(3, 2, 5),  -- Python
(3, 4, 5),  -- SQL
(3, 15, 4), -- PostgreSQL
(3, 6, 4),  -- Git
(3, 19, 3), -- Machine Learning
(3, 20, 4)  -- Pandas
ON DUPLICATE KEY UPDATE importance_weight=VALUES(importance_weight);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
