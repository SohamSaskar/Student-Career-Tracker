import { RecommendationsData, RecommendedSkillItem, PriorityLevel, ImportanceLevel } from '@/types/recommendations';
import { onboardingService, CAREER_ROLES, SKILLS_CATALOG } from './onboardingService';
import { SkillStatus } from '@/types/onboarding';

export const recommendationService = {
  /**
   * Fetches skill recommendations for the authenticated student
   */
  async getRecommendationsData(): Promise<RecommendationsData> {
    // Simulate lightweight API latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const onboardingData = onboardingService.getOnboardingData();

    if (!onboardingData || !onboardingData.careerRoleId) {
      return {
        careerGoal: null,
        nextFocus: null,
        recommendations: [],
        summary: {
          totalRecommended: 0,
          missingCount: 0,
          learningCount: 0,
          completedCount: 0,
          priorityBreakdown: { highCount: 0, mediumCount: 0, lowCount: 0 },
        },
        categories: [],
      };
    }

    const roleId = onboardingData.careerRoleId;
    const careerGoal = CAREER_ROLES.find((r) => r.id === roleId) || null;

    if (!careerGoal) {
      return {
        careerGoal: null,
        nextFocus: null,
        recommendations: [],
        summary: {
          totalRecommended: 0,
          missingCount: 0,
          learningCount: 0,
          completedCount: 0,
          priorityBreakdown: { highCount: 0, mediumCount: 0, lowCount: 0 },
        },
        categories: [],
      };
    }

    // Determine student skills map
    let studentSkillsMap: Record<string, SkillStatus> = {};
    if (onboardingData.studentSkills) {
      if (Array.isArray(onboardingData.studentSkills)) {
        onboardingData.studentSkills.forEach((item: { skillId: string; status: SkillStatus }) => {
          studentSkillsMap[item.skillId] = item.status;
        });
      } else {
        studentSkillsMap = onboardingData.studentSkills as Record<string, SkillStatus>;
      }
    } else {
      // Default fallback initial skills if empty
      studentSkillsMap = {
        java: 'COMPLETED',
        sql: 'COMPLETED',
        git: 'LEARNING',
        rest_api: 'NOT_STARTED',
        spring_boot: 'NOT_STARTED',
        docker: 'NOT_STARTED',
      };
    }

    const requiredSkillIds = careerGoal.requiredSkillIds;
    const categoriesSet = new Set<string>();

    let rankCounter = 1;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;

    let missingCount = 0;
    let learningCount = 0;
    let completedCount = 0;

    const recommendations: RecommendedSkillItem[] = requiredSkillIds.map((skillId, index) => {
      const skillDef = SKILLS_CATALOG.find((s) => s.id === skillId) || {
        id: skillId,
        name: skillId,
        category: 'General',
      };

      const status: SkillStatus = studentSkillsMap[skillId] || 'NOT_STARTED';

      if (status === 'COMPLETED') completedCount++;
      else if (status === 'LEARNING') learningCount++;
      else missingCount++;

      categoriesSet.add(skillDef.category);

      // Determine priority level & importance
      let priority: PriorityLevel = 'Medium';
      let importance: ImportanceLevel = 'Medium';

      if (index < 2) {
        priority = 'High';
        importance = 'High';
        highCount++;
      } else if (index >= requiredSkillIds.length - 2) {
        priority = 'Low';
        importance = 'Low';
        lowCount++;
      } else {
        mediumCount++;
      }

      // Generate explainable reason matching role requirements & status
      let reason = '';
      if (status === 'NOT_STARTED') {
        reason = `Essential missing skill required for ${careerGoal.title} core role matrix.`;
      } else if (status === 'LEARNING') {
        reason = `In progress: complete this module to boost role readiness score.`;
      } else {
        reason = `Verified core skill completed for ${careerGoal.title}.`;
      }

      const item: RecommendedSkillItem = {
        id: skillDef.id,
        rank: rankCounter++,
        name: skillDef.name,
        category: skillDef.category,
        status,
        priority,
        importance,
        reason,
        isRequired: true,
      };

      return item;
    });

    // Next Focus is the highest priority uncompleted skill (matching Dashboard Next Focus)
    const nextFocus = recommendations.find((s) => s.status === 'NOT_STARTED' || s.status === 'LEARNING') || null;

    return {
      careerGoal,
      nextFocus,
      recommendations,
      summary: {
        totalRecommended: recommendations.length,
        missingCount,
        learningCount,
        completedCount,
        priorityBreakdown: {
          highCount,
          mediumCount,
          lowCount,
        },
      },
      categories: Array.from(categoriesSet),
    };
  },
};
