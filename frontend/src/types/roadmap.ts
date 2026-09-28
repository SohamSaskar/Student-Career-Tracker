import { CareerRole, SkillStatus } from './onboarding';

export type ImportanceLevel = 'High' | 'Medium' | 'Low';
export type RoadmapFilterStatus = 'ALL' | 'NOT_STARTED' | 'LEARNING' | 'COMPLETED';

export interface RoadmapSkillItem {
  id: string;
  name: string;
  category: string;
  status: SkillStatus;
  importance: ImportanceLevel;
  reason?: string;
  isRequired: boolean;
  order: number;
}

export interface RoadmapData {
  careerGoal: CareerRole | null;
  readinessPercentage: number;
  totalRequired: number;
  completedCount: number;
  learningCount: number;
  missingCount: number;
  skills: RoadmapSkillItem[];
  nextFocusSkills: RoadmapSkillItem[];
  categories: string[];
}
