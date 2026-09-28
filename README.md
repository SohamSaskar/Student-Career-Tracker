# DevTrack — Student Career Readiness Platform

DevTrack is a data-driven **Student Career Readiness Platform** designed for computer science and engineering students to systematically track, analyze, and accelerate their career preparation toward target software engineering roles.

## Core Features
- **Interactive Onboarding & Goal Mapping**: Select target career roles and baseline skill inventories.
- **Student Overview & Readiness Audit**: Real-time readiness percentage scoring and gap analysis.
- **Priority Recommendations & Roadmaps**: Algorithmic skill recommendations and milestone tracking.
- **Project & Certification Vaults**: Verified portfolio project CRUD and document/image upload manager.
- **Multi-Tenant User Isolation**: Session-authenticated privacy and BCrypt password security.

## Technology Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, 21st.dev components.
- **Backend**: Java 21, Spring Boot REST Architecture, JDBC PreparedStatements, MindRot BCrypt, Apache PDFBox.
- **Database**: MySQL 8.0 (3NF Normalized Schema, Views, Stored Procedures).

## Quick Setup

### 1. Database Setup
Import the SQL schema and seed data into MySQL:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Development Server
```bash
cd frontend
npm install
npm run dev
```

### 3. Detailed Documentation
For detailed architecture, database design, application flow, security controls, project structure, and test reports, please refer to:

👉 **[PROJECT.md](PROJECT.md)**
