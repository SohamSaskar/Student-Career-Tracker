# DevTrack — Student Career Readiness Platform

## 1. Overview
**DevTrack** is a data-driven Student Career Readiness Platform designed for computer science and engineering students. It systematically evaluates, tracks, and accelerates student preparation toward target software engineering roles through readiness scoring, skill gap identification, priority recommendations, learning roadmaps, and portfolio/certification management.

## 2. Features
- **Authentication**: Student signup and login with BCrypt password hashing and persistent session management.
- **Student Profile**: Academic details, branch, college, and target career goal configuration.
- **Career Goal**: Dynamic goal selection mapped directly to normalized database requirements.
- **Skill Tracking**: Inventory management classifying skills into Not Started, Learning, and Completed.
- **Skill Gap Analysis**: Automated gap analysis identifying missing skills required for target roles.
- **Recommendations**: Priority-weighted skill recommendations ordered by role demand and importance.
- **Learning Roadmap**: Milestone tracking categorized into Next Up, In Progress, and Completed stages.
- **Project Vault**: Full CRUD portfolio manager for code projects with tech stack tags and links.
- **Certification Vault**: Secure credential manager supporting document previews and upload validation.
- **Career Readiness**: Real-time mathematical scoring evaluating completion percentage against role requirements.

## 3. Technology
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, 21st.dev components.
- **Backend**: Java 21, Spring Boot REST Architecture, JDBC PreparedStatements, MindRot BCrypt, Apache PDFBox.
- **Database**: MySQL 8.0 (3NF Normalized Schema, Views, Stored Procedures).

## 4. Architecture
```text
Next.js / React / TypeScript (Frontend Web UI Layer)
            ↓ REST API / Services
Spring Boot REST API & Business Services Layer
            ↓ DAO / JDBC Layer
Database Access Objects (PreparedStatement & Transactions)
            ↓ MySQL Driver (mysql-connector-j)
MySQL 8.0 Database (devtrack 3NF Schema)
```

## 5. Database
Key 3NF normalized tables in `devtrack` database:
- `students`: Core user authentication credentials, BCrypt hashes, and academic metadata (`PK: student_id`, `UNIQUE: username, email`).
- `career_roles`: Industry engineering role profiles (`PK: role_id`).
- `skills`: Categorized skill taxonomy (`PK: skill_id`).
- `role_skills`: Role-to-skill mappings with importance weights 1–5 (`FK: role_id, skill_id`).
- `student_skills`: Student skill status tracking (`FK: student_id, skill_id`).
- `student_career_goals`: Active target goal for each student (`FK: student_id, role_id`).
- `projects` & `project_skills`: Student portfolio project metadata and linked skills (`FK: project_id, student_id`).
- `certifications` & `certification_skills`: Verified credentials and linked skills (`FK: certification_id, student_id`).

Included database objects:
- **Views**: `vw_student_career_readiness`, `vw_student_skill_gap`.
- **Stored Procedures**: `sp_calculate_student_readiness`.
- **Constraints**: Foreign keys with `ON DELETE CASCADE`, unique indexes on email and username.

## 6. Application Flow
```text
Landing Page (/)
       ↓
Signup / Login (/signup, /login)
       ↓
Onboarding Wizard (/onboarding)
       ↓
Career Goal & Skill Baseline
       ↓
Student Overview (/overview)
       ↓
Skill Gap / Recommendations / Roadmap
       ↓
Projects Vault / Certification Vault
       ↓
Career Readiness Audit
```

## 7. Security
- **BCrypt Password Hashing**: Passwords stored exclusively as BCrypt salted hashes (`BCrypt.hashpw`). Plaintext passwords are never stored or logged.
- **Prepared Statements**: 100% of DAO queries use parameterized `PreparedStatement` interfaces to prevent SQL injection.
- **User Data Isolation**: Queries filter strictly by `student_id = ?` derived from the authenticated session context.
- **Backend Authorization**: Session token verification on every protected endpoint.
- **Input Validation**: Backend validation for strings, emails, dates, URLs, and numeric IDs.
- **Secure File Upload Validation**: Extension allowlists (`pdf`, `png`, `jpg`, `jpeg`), 25MB file size caps, and UUID filename sanitization.
- **Environment-based Secrets**: Credentials loaded via environment variables or gitignored `db.properties`.

## 8. Setup
1. **MySQL Database**: Ensure MySQL 8.0+ is running.
2. **Database Import**:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```
3. **Backend Configuration**: Copy `db.properties.example` to `db.properties` and set local MySQL credentials.
4. **Backend Start / Test**:
   ```bash
   javac -cp "lib/*" -d target/classes (Get-ChildItem -Recurse -Filter *.java src/main/java).FullName
   ```
5. **Frontend Start**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 9. Testing
```text
E2E Master Suite: PASS (12/12)
Frontend Build: PASS
Backend Tests: PASS
TypeScript Typecheck: PASS
Responsive Testing: PASS
Security Checks: PASS
```

## 10. Project Structure
```text
DevTrack/
├── frontend/                     # Next.js App Router Web Application
├── src/                          # Java Services, DAO Layer, Models, Utilities
│   ├── main/java/com/devtrack/   # Core Application Source Code
│   └── test/java/com/devtrack/   # Master E2E Test Suite
├── database/                     # MySQL Schema (schema.sql) & Seed Data (seed.sql)
├── lib/                          # Backend JDBC & PDFBox Libraries
├── uploads/                      # Relative File Upload Directory
│   └── .gitkeep
├── .env.example                  # Environment Variables Template
├── db.properties.example          # Database Properties Template
├── .gitignore                    # Git Exclusion Rules
├── README.md                     # Short Overview Documentation
└── PROJECT.md                    # Single Master Documentation File
```

## 11. Limitations
- Requires local or remote MySQL 8.0+ instance for backend data persistence.
- PDF thumbnail generation requires Apache PDFBox library runtime.

## 12. Contributors
- **DevTrack Core Engineering Team**: Full-Stack Architecture, Database Design, Security Hardening, Frontend UI & E2E Testing.

## 13. Viva Preparation
- **Project Purpose**: Data-driven student career readiness tracking platform that bridges the gap between academic CS curricula and industry software engineering job requirements.
- **Architecture**: 3-tier enterprise architecture (Next.js 16 / React 19 Frontend -> Spring Boot REST API & Business Services -> JDBC DAO Layer -> MySQL 8.0 Database).
- **Database**: 3rd Normal Form (3NF) relational database (`devtrack`) featuring normalized core entities (`students`, `career_roles`, `skills`, `projects`, `certifications`), junction tables (`role_skills`, `student_skills`, `project_skills`, `certification_skills`), cascading foreign keys, performance indexes, database views (`vw_student_career_readiness`), and stored procedures (`sp_calculate_student_readiness`).
- **Normalization**: Eliminates data redundancy through 3NF schema design. Role skill requirements and student skill inventories are stored in junction tables with weight indicators rather than flat repetitive columns.
- **Authentication**: Secure student authentication supporting username or email login with MindRot BCrypt (`BCrypt.hashpw`) salted password hashing. Plaintext passwords are never stored or logged.
- **Authorization & Data Isolation**: Strict session-based multi-tenant data isolation. Backend service and DAO queries enforce `WHERE student_id = ?` derived directly from authenticated session tokens, preventing unauthorized cross-tenant data access.
- **Skill-Gap Logic**: Evaluates role-required skills against the student's active inventory. Categorizes skills into Completed (mastered), Learning (active), and Missing (gaps required for target role).
- **Readiness Calculation**: Mathematical formula evaluated in real-time:
  $$\text{Readiness \%} = \left( \frac{\text{Completed Required Skills}}{\text{Total Required Skills for Target Role}} \right) \times 100$$
- **Security Controls**: BCrypt password hashing, 100% parameterized SQL queries (`PreparedStatement`), file upload type allowlists (PDF/PNG/JPG/JPEG), 25MB file caps, UUID filename sanitization, zero hardcoded credentials, and gitignored configuration files.
- **Major Technologies**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, 21st.dev components, Java 21, Spring Boot, MySQL 8.0, Apache PDFBox, MindRot BCrypt.

