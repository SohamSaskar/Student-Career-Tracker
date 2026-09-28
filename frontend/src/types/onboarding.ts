export type SkillStatus = 'NOT_STARTED' | 'LEARNING' | 'COMPLETED';

export interface StudentProfile {
  fullName?: string;
  college: string;
  branch: string;
  year: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface CareerRole {
  id: string;
  title: string;
  description: string;
  iconName: string;
  demand: string;
  requiredSkillIds: string[];
}

export interface StudentSkill {
  skillId: string;
  status: SkillStatus;
}

export interface OnboardingState {
  step: 1 | 2 | 3 | 4;
  profile: StudentProfile;
  careerGoal: CareerRole | null;
  studentSkills: Record<string, SkillStatus>;
  isCompleted: boolean;
}

export interface SkillBreakdownItem {
  skill: Skill;
  status: SkillStatus;
  isRequired: boolean;
}

export interface CareerReadiness {
  percentage: number;
  totalRequired: number;
  completedCount: number;
  learningCount: number;
  missingCount: number;
  skillBreakdown: SkillBreakdownItem[];
}

export interface OnboardingPayload {
  username?: string;
  profile: StudentProfile;
  careerRoleId: string;
  studentSkills: Array<{ skillId: string; status: SkillStatus }> | Record<string, SkillStatus>;
  readinessPercentage?: number;
}
