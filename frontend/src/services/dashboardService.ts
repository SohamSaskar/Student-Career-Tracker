import { DashboardData, DashboardProject, DashboardCertification, DashboardActivity } from '@/types/dashboard';
import { onboardingService, CAREER_ROLES } from './onboardingService';
import { projectService } from './projectService';
import { certificationService } from './certificationService';
import { SkillStatus } from '@/types/onboarding';


const USER_STORAGE_KEY = 'devtrack_current_user';

let inMemoryUserStorage: string | null = null;

export const dashboardService = {
  /**
   * Retrieves the active authenticated student session or defaults to the onboarded profile
   */
  getCurrentUser() {
    let raw: string | null = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      raw = localStorage.getItem(USER_STORAGE_KEY);
    } else {
      raw = inMemoryUserStorage;
    }
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: { fullName: string; email: string; college?: string; branch?: string; yearOfStudy?: string } | null) {
    if (user === null) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      inMemoryUserStorage = null;
      return;
    }

    const str = JSON.stringify(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(USER_STORAGE_KEY, str);
    }
    inMemoryUserStorage = str;
  },

  /**
   * Fetches real, calculated dashboard data for the active student
   */
  async getDashboardData(): Promise<DashboardData> {
    // Simulate lightweight API latency
    await new Promise((resolve) => setTimeout(resolve, 350));

    const currentUser = this.getCurrentUser();
    const onboardingData = onboardingService.getOnboardingData();

    // Determine Career Role
    const roleId = onboardingData?.careerRoleId || 'backend';
    const careerGoal = CAREER_ROLES.find((r) => r.id === roleId) || CAREER_ROLES[0];

    // Determine Student Skills
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
      // Default initial skills state if onboarding not filled
      studentSkillsMap = {
        java: 'COMPLETED',
        sql: 'COMPLETED',
        git: 'LEARNING',
        rest_api: 'NOT_STARTED',
        spring_boot: 'NOT_STARTED',
        docker: 'NOT_STARTED',
      };
    }

    // Calculate deterministic readiness score
    const readiness = onboardingService.calculateReadiness(careerGoal.id, studentSkillsMap);

    // Identify Next Focus Skills (Missing or Learning required skills)
    const nextFocusSkills = readiness.skillBreakdown
      .filter((item) => item.status === 'LEARNING' || item.status === 'NOT_STARTED')
      .map((item) => ({
        id: item.skill.id,
        name: item.skill.name,
        category: item.skill.category,
        status: item.status,
      }));

    // Fetch projects for student
    const projects = this.getProjects();

    // Fetch certifications for student
    const certs = this.getCertifications();

    // Build recent activities
    const activities: DashboardActivity[] = [
      {
        id: 'act-1',
        title: `Set target role to ${careerGoal.title}`,
        timestamp: 'Today',
        type: 'goal',
      },
      {
        id: 'act-2',
        title: `Updated skill readiness score to ${readiness.percentage}%`,
        timestamp: 'Yesterday',
        type: 'skill',
      },
    ];

    if (projects.length > 0) {
      activities.push({
        id: 'act-3',
        title: `Added project: ${projects[0].title}`,
        timestamp: '2 days ago',
        type: 'project',
      });
    }

    if (certs.length > 0) {
      activities.push({
        id: 'act-4',
        title: `Verified certificate: ${certs[0].name}`,
        timestamp: '3 days ago',
        type: 'certification',
      });
    }

    return {
      studentName: currentUser?.fullName || onboardingData?.profile?.fullName || 'Student',
      college: currentUser?.college || onboardingData?.profile?.college || 'Sanjivani University',
      branch: currentUser?.branch || onboardingData?.profile?.branch || 'AI & Data Science',
      yearOfStudy: currentUser?.yearOfStudy || onboardingData?.profile?.year || '2nd Year',
      careerGoal,
      readinessPercentage: readiness.percentage,
      completedSkillCount: readiness.completedCount,
      learningSkillCount: readiness.learningCount,
      missingSkillCount: readiness.missingCount,
      totalRequiredSkills: readiness.totalRequired,
      nextFocusSkills,
      recentProjects: projects,
      recentCertifications: certs,
      recentActivities: activities,
    };
  },

  getProjects(): DashboardProject[] {
    const raw = projectService.storageFallback();

    if (!raw) {
      const defaultProjects: DashboardProject[] = [
        {
          id: 'proj-1',
          title: 'FuelPulse — Fuel Tracking System',
          description: 'Java 21 Swing & MySQL application for tracking fleet fuel metrics.',
          techStack: ['Java 21', 'MySQL', 'JDBC', 'PDFBox'],
          status: 'Completed',
          githubUrl: 'https://github.com/student/fuelpulse',
          updatedAt: '2 days ago',
        },
      ];
      return defaultProjects;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  getCertifications(): DashboardCertification[] {
    const raw = certificationService.storageFallback();

    if (!raw) {
      const defaultCerts: DashboardCertification[] = [
        {
          id: 'cert-1',
          name: 'Oracle Certified Professional: Java SE 21',
          issuer: 'Oracle Corporation',
          issueDate: 'Aug 2025',
          fileName: 'cert_oracle_java21.pdf',
          isVerified: true,
        },
      ];
      return defaultCerts;
    }
    try {
      const parsed = JSON.parse(raw);
      return parsed.map((c: {
        id: string;
        name?: string;
        certificateName?: string;
        issuer?: string;
        issueDate?: string;
        fileName?: string;
        certificateFile?: string;
        isVerified?: boolean;
        thumbnailUrl?: string;
      }) => ({
        id: c.id,
        name: c.name || c.certificateName || 'Certificate',
        issuer: c.issuer || 'Issuing Organization',
        issueDate: c.issueDate || 'Verified',
        fileName: c.fileName || c.certificateFile || 'certificate.pdf',
        isVerified: c.isVerified ?? true,
        thumbnailUrl: c.thumbnailUrl,
      }));
    } catch {
      return [];
    }
  },
};
