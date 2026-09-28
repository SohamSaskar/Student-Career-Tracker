import { CareerReadinessPageData, RequiredSkillItem } from '@/types/readiness';
import { onboardingService, CAREER_ROLES, SKILLS_CATALOG } from './onboardingService';
import { dashboardService } from './dashboardService';
import { projectService } from './projectService';
import { certificationService } from './certificationService';
import { SkillStatus } from '@/types/onboarding';
import { ImportanceLevel } from '@/types/skillGap';

export const readinessService = {
  /**
   * Fetches real, calculated career readiness data for the active student session
   */
  async getReadinessData(): Promise<CareerReadinessPageData> {
    // Simulate lightweight API latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const currentUser = dashboardService.getCurrentUser();
    const onboardingData = onboardingService.getOnboardingData();

    const studentName = currentUser?.fullName || onboardingData?.profile?.fullName || 'Student';
    const college = currentUser?.college || onboardingData?.profile?.college || 'Sanjivani University';
    const branch = currentUser?.branch || onboardingData?.profile?.branch || 'AI & Data Science';
    const yearOfStudy = currentUser?.yearOfStudy || onboardingData?.profile?.year || '3rd Year';

    // 1. Identify Selected Career Goal
    const roleId = onboardingData?.careerRoleId || 'backend';
    const careerGoal = CAREER_ROLES.find((r) => r.id === roleId) || CAREER_ROLES[0];

    // 2. Determine Student Skills Map
    let studentSkillsMap: Record<string, SkillStatus> = {};
    if (onboardingData?.studentSkills) {
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

    // 3. Single Authoritative Readiness Calculation
    const readiness = onboardingService.calculateReadiness(roleId, studentSkillsMap);

    // 4. Build Required Skills Breakdown
    const requiredSkillIds = careerGoal.requiredSkillIds;

    const requiredSkills: RequiredSkillItem[] = requiredSkillIds.map((skillId, index) => {
      const skillDef = SKILLS_CATALOG.find((s) => s.id === skillId) || {
        id: skillId,
        name: skillId,
        category: 'General',
      };

      const status: SkillStatus = studentSkillsMap[skillId] || 'NOT_STARTED';

      let importance: ImportanceLevel = 'Medium';
      if (index < 2) {
        importance = 'High';
      } else if (index >= requiredSkillIds.length - 2) {
        importance = 'Low';
      }

      let reason: string | undefined = undefined;
      if (status === 'NOT_STARTED') {
        reason = `High-priority core skill requirement for ${careerGoal.title} role.`;
      } else if (status === 'LEARNING') {
        reason = `Currently in progress. Complete learning topics to increase readiness score.`;
      } else {
        reason = `Verified competency in portfolio.`;
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

    // 5. Priority Focus (Missing or Learning skills ordered by High -> Medium -> Low importance)
    const priorityFocus = requiredSkills
      .filter((s) => s.status === 'NOT_STARTED' || s.status === 'LEARNING')
      .sort((a, b) => {
        const order: Record<ImportanceLevel, number> = { High: 0, Medium: 1, Low: 2 };
        return order[a.importance] - order[b.importance];
      });

    // 6. Fetch Projects & Certifications Summaries
    const rawProjects = projectService.getProjects();
    const projects = Array.isArray(rawProjects) ? rawProjects : [];
    const completedProjects = projects.filter((p) => p && p.status === 'Completed').length;

    const rawCerts = certificationService.getCertifications();
    const certs = Array.isArray(rawCerts) ? rawCerts : [];
    const verifiedCerts = certs.filter((c) => c && c.isVerified).length;

    return {
      studentName,
      college,
      branch,
      yearOfStudy,
      careerGoal,
      readinessPercentage: readiness.percentage,
      totalRequired: readiness.totalRequired,
      completedCount: readiness.completedCount,
      learningCount: readiness.learningCount,
      missingCount: readiness.missingCount,
      requiredSkills,
      priorityFocus,
      projectSummary: {
        totalProjects: projects.length,
        completedProjects,
        recentProjectTitle: projects.length > 0 ? projects[0].title : undefined,
      },
      certificationSummary: {
        totalCertifications: certs.length,
        verifiedCertifications: verifiedCerts,
        recentCertName: certs.length > 0 ? certs[0].certificateName : undefined,
      },
    };
  },
};
