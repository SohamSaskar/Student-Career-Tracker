import { CareerRole, SkillStatus } from './onboarding';

export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type ImportanceLevel = 'High' | 'Medium' | 'Low';

export interface RecommendedSkillItem {
  id: string;
  rank: number;
  name: string;
  category: string;
  status: SkillStatus;
  priority: PriorityLevel;
  importance: ImportanceLevel;
  reason: string;
  isRequired: boolean;
}

export interface RecommendationSummary {
  totalRecommended: number;
  missingCount: number;
  learningCount: number;
  completedCount: number;
  priorityBreakdown: {
    highCount: number;
    mediumCount: number;
    lowCount: number;
  };
}

export interface RecommendationsData {
  careerGoal: CareerRole | null;
  nextFocus: RecommendedSkillItem | null;
  recommendations: RecommendedSkillItem[];
  summary: RecommendationSummary;
  categories: string[];
}
