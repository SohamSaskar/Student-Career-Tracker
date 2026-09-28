import { CareerRole, SkillStatus } from './onboarding';
import { ImportanceLevel } from './skillGap';

export interface RequiredSkillItem {
  id: string;
  name: string;
  category: string;
  status: SkillStatus;
  importance: ImportanceLevel;
  reason?: string;
  isRequired: boolean;
}

export interface ReadinessProjectSummary {
  totalProjects: number;
  completedProjects: number;
  recentProjectTitle?: string;
}

export interface ReadinessCertSummary {
  totalCertifications: number;
  verifiedCertifications: number;
  recentCertName?: string;
}

export interface CareerReadinessPageData {
  studentName: string;
  college: string;
  branch: string;
  yearOfStudy: string;
  careerGoal: CareerRole | null;
  readinessPercentage: number;
  totalRequired: number;
  completedCount: number;
  learningCount: number;
  missingCount: number;
  requiredSkills: RequiredSkillItem[];
  priorityFocus: RequiredSkillItem[];
  projectSummary: ReadinessProjectSummary;
  certificationSummary: ReadinessCertSummary;
}
