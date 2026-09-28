import { SkillGapData, SkillGapItem, ImportanceLevel } from '@/types/skillGap';
import { onboardingService, CAREER_ROLES, SKILLS_CATALOG } from './onboardingService';
import { SkillStatus } from '@/types/onboarding';

export const skillGapService = {
  /**
   * Fetches skill gap analysis for the authenticated student
   */
  async getSkillGapData(): Promise<SkillGapData> {
    // Simulate lightweight API latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const onboardingData = onboardingService.getOnboardingData();

    if (!onboardingData || !onboardingData.careerRoleId) {
      return {
        careerGoal: null,
        readinessPercentage: 0,
        totalRequired: 0,
        completedCount: 0,
        learningCount: 0,
        missingCount: 0,
        skills: [],
        priorityFocus: [],
        categories: [],
      };
    }

    const roleId = onboardingData.careerRoleId;
    const careerGoal = CAREER_ROLES.find((r) => r.id === roleId) || null;

    if (!careerGoal) {
      return {
        careerGoal: null,
        readinessPercentage: 0,
        totalRequired: 0,
        completedCount: 0,
        learningCount: 0,
        missingCount: 0,
        skills: [],
        priorityFocus: [],
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

    const readiness = onboardingService.calculateReadiness(roleId, studentSkillsMap);

    // Build skill items for the role
    const requiredSkillIds = careerGoal.requiredSkillIds;
    const categoriesSet = new Set<string>();

    const skills: SkillGapItem[] = requiredSkillIds.map((skillId, index) => {
      const skillDef = SKILLS_CATALOG.find((s) => s.id === skillId) || {
        id: skillId,
        name: skillId,
        category: 'General',
      };

      const status: SkillStatus = studentSkillsMap[skillId] || 'NOT_STARTED';

      categoriesSet.add(skillDef.category);

      // Determine importance level deterministically
      let importance: ImportanceLevel = 'Medium';
      if (index < 2) {
        importance = 'High';
      } else if (index >= requiredSkillIds.length - 2) {
        importance = 'Low';
      }

      let reason = undefined;
      if (status === 'NOT_STARTED') {
        reason = `High-impact skill gap for ${careerGoal.title} role.`;
      } else if (status === 'LEARNING') {
        reason = `In progress: complete remaining topics to unlock readiness score.`;
      }

      return {
        id: skillDef.id,
        name: skillDef.name,
        category: skillDef.category,
        status,
        importance,
        reason,
        isRequired: true,
      };
    });

    // Top priority focus (Missing or Learning skills sorted by High -> Medium -> Low importance)
    const priorityFocus = skills
      .filter((s) => s.status === 'NOT_STARTED' || s.status === 'LEARNING')
      .sort((a, b) => {
        const impOrder: Record<ImportanceLevel, number> = { High: 0, Medium: 1, Low: 2 };
        return impOrder[a.importance] - impOrder[b.importance];
      });

    return {
      careerGoal,
      readinessPercentage: readiness.percentage,
      totalRequired: readiness.totalRequired,
      completedCount: readiness.completedCount,
      learningCount: readiness.learningCount,
      missingCount: readiness.missingCount,
      skills,
      priorityFocus,
      categories: Array.from(categoriesSet),
    };
  },
};
