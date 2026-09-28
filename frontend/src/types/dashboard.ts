import { CareerRole, SkillStatus } from './onboarding';

export interface DashboardProject {
  id: string;
  title: string;
  description?: string;
  techStack: string[];
  status: 'Completed' | 'In Progress' | 'Planned';
  githubUrl?: string;
  updatedAt: string;
}

export interface DashboardCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  fileName?: string;
  isVerified: boolean;
}

export interface DashboardActivity {
  id: string;
  title: string;
  timestamp: string;
  type: 'skill' | 'project' | 'certification' | 'goal';
}

export interface DashboardData {
  studentName: string;
  college: string;
  branch: string;
  yearOfStudy: string;
  careerGoal: CareerRole;
  readinessPercentage: number;
  completedSkillCount: number;
  learningSkillCount: number;
  missingSkillCount: number;
  totalRequiredSkills: number;
  nextFocusSkills: Array<{
    id: string;
    name: string;
    category: string;
    status: SkillStatus;
  }>;
  recentProjects: DashboardProject[];
  recentCertifications: DashboardCertification[];
  recentActivities: DashboardActivity[];
}
