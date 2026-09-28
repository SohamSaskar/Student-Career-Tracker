import { RoadmapData, RoadmapSkillItem, ImportanceLevel } from '@/types/roadmap';
import { onboardingService, CAREER_ROLES, SKILLS_CATALOG } from './onboardingService';
import { SkillStatus, OnboardingPayload } from '@/types/onboarding';

export const roadmapService = {
  /**
   * Fetches learning roadmap data for the authenticated student
   */
  async getRoadmapData(): Promise<RoadmapData> {
    // Simulate lightweight API latency
    await new Promise((resolve) => setTimeout(resolve, 250));

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
        nextFocusSkills: [],
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
        nextFocusSkills: [],
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
      // Default initial skills state
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
    const requiredSkillIds = careerGoal.requiredSkillIds;
    const categoriesSet = new Set<string>();

    const skills: RoadmapSkillItem[] = requiredSkillIds.map((skillId, index) => {
      const skillDef = SKILLS_CATALOG.find((s) => s.id === skillId) || {
        id: skillId,
        name: skillId,
        category: 'General',
      };

      const status: SkillStatus = studentSkillsMap[skillId] || 'NOT_STARTED';
      categoriesSet.add(skillDef.category);

      // Determine importance level deterministically matching role skills schema
      let importance: ImportanceLevel = 'Medium';
      if (index < 2) {
        importance = 'High';
      } else if (index >= requiredSkillIds.length - 2) {
        importance = 'Low';
      }

      let reason: string | undefined = undefined;
      if (status === 'NOT_STARTED') {
        reason = `Core milestone required for ${careerGoal.title} proficiency.`;
      } else if (status === 'LEARNING') {
        reason = `Currently in progress. Complete exercises to increase readiness.`;
      } else {
        reason = `Completed milestone required for ${careerGoal.title}.`;
      }

      return {
        id: skillDef.id,
        name: skillDef.name,
        category: skillDef.category,
        status,
        importance,
        reason,
        isRequired: true,
        order: index + 1,
      };
    });

    // Determine next focus skills (uncompleted skills sorted by High -> Medium -> Low importance)
    const nextFocusSkills = skills
      .filter((s) => s.status === 'NOT_STARTED' || s.status === 'LEARNING')
      .sort((a, b) => {
        const impOrder: Record<ImportanceLevel, number> = { High: 0, Medium: 1, Low: 2 };
        return impOrder[a.importance] - impOrder[b.importance];
      })
      .slice(0, 3);

    return {
      careerGoal,
      readinessPercentage: readiness.percentage,
      totalRequired: readiness.totalRequired,
      completedCount: readiness.completedCount,
      learningCount: readiness.learningCount,
      missingCount: readiness.missingCount,
      skills,
      nextFocusSkills,
      categories: Array.from(categoriesSet),
    };
  },

  /**
   * Persists updated skill status and synchronizes cross-page state immediately
   */
  async updateSkillStatus(skillId: string, newStatus: SkillStatus): Promise<RoadmapData> {
    const onboardingData = onboardingService.getOnboardingData();

    let studentSkillsMap: Record<string, SkillStatus> = {};
    if (onboardingData?.studentSkills) {
      if (Array.isArray(onboardingData.studentSkills)) {
        onboardingData.studentSkills.forEach((item: { skillId: string; status: SkillStatus }) => {
          studentSkillsMap[item.skillId] = item.status;
        });
      } else {
        studentSkillsMap = { ...(onboardingData.studentSkills as Record<string, SkillStatus>) };
      }
    } else {
      studentSkillsMap = {
        java: 'COMPLETED',
        sql: 'COMPLETED',
        git: 'LEARNING',
        rest_api: 'NOT_STARTED',
        spring_boot: 'NOT_STARTED',
        docker: 'NOT_STARTED',
      };
    }

    // Update target skill status
    studentSkillsMap[skillId] = newStatus;

    // Persist updated onboarding payload
    const updatedPayload = {
      ...(onboardingData || {
        careerRoleId: 'backend',
        profile: {
          fullName: 'Student',
          college: 'Sanjivani University',
          branch: 'AI & Data Science',
          year: '2nd Year',
        },
      }),
      studentSkills: studentSkillsMap,
    };

    await onboardingService.submitOnboarding(updatedPayload as OnboardingPayload);

    // Return freshly calculated roadmap data
    return this.getRoadmapData();
  },
};
