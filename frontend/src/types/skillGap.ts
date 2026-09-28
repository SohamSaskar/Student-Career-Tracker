import { CareerRole, SkillStatus } from './onboarding';

export type ImportanceLevel = 'High' | 'Medium' | 'Low';

export interface SkillGapItem {
  id: string;
  name: string;
  category: string;
  status: SkillStatus;
  importance: ImportanceLevel;
  reason?: string;
  isRequired: boolean;
}

export interface SkillGapData {
  careerGoal: CareerRole | null;
  readinessPercentage: number;
  totalRequired: number;
  completedCount: number;
  learningCount: number;
  missingCount: number;
  skills: SkillGapItem[];
  priorityFocus: SkillGapItem[];
  categories: string[];
}
