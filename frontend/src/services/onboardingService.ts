import {
  CareerRole,
  Skill,
  SkillStatus,
  CareerReadiness,
  OnboardingPayload,
  StudentProfile
} from '@/types/onboarding';

// Predefined catalog of career roles
export const CAREER_ROLES: CareerRole[] = [
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Design robust APIs, microservices, databases, and core server architecture.',
    iconName: 'Server',
    demand: 'High Demand',
    requiredSkillIds: ['java', 'sql', 'git', 'rest_api', 'spring_boot', 'docker']
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Build fast, responsive, and visually dynamic web interfaces and web applications.',
    iconName: 'Layout',
    demand: 'High Demand',
    requiredSkillIds: ['html_css', 'javascript', 'typescript', 'react', 'nextjs', 'tailwind']
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    description: 'Bridge frontend user experiences with backend system architecture and databases.',
    iconName: 'Layers',
    demand: 'Very High Demand',
    requiredSkillIds: ['javascript', 'react', 'nodejs', 'sql', 'rest_api', 'git']
  },
  {
    id: 'python',
    title: 'Python Developer',
    description: 'Build scalable Python backends, automation pipelines, and API services.',
    iconName: 'Code',
    demand: 'High Demand',
    requiredSkillIds: ['python', 'sql', 'git', 'django_fastapi', 'rest_api', 'dsa']
  },
  {
    id: 'data_analyst',
    title: 'Data Analyst',
    description: 'Extract business intelligence, transform data streams, and visualize trends.',
    iconName: 'BarChart3',
    demand: 'Growing Demand',
    requiredSkillIds: ['python', 'sql', 'excel', 'tableau', 'statistics', 'git']
  },
  {
    id: 'ai_ml',
    title: 'AI / ML Engineer',
    description: 'Train machine learning models, build neural nets, and deploy intelligent agents.',
    iconName: 'Brain',
    demand: 'Top Demand',
    requiredSkillIds: ['python', 'math_linear_algebra', 'pytorch_tf', 'data_preprocessing', 'sql', 'git']
  }
];

// Predefined catalog of skills
export const SKILLS_CATALOG: Skill[] = [
  { id: 'java', name: 'Java', category: 'Backend Language' },
  { id: 'sql', name: 'SQL & Relational DBs', category: 'Database' },
  { id: 'git', name: 'Git & Version Control', category: 'Tools' },
  { id: 'rest_api', name: 'REST API Design', category: 'Architecture' },
  { id: 'spring_boot', name: 'Spring Boot Framework', category: 'Backend Framework' },
  { id: 'docker', name: 'Docker & Containers', category: 'DevOps' },
  { id: 'html_css', name: 'HTML5 & Modern CSS3', category: 'Frontend' },
  { id: 'javascript', name: 'JavaScript (ES6+)', category: 'Language' },
  { id: 'typescript', name: 'TypeScript', category: 'Language' },
  { id: 'react', name: 'React.js', category: 'Frontend Framework' },
  { id: 'nextjs', name: 'Next.js (App Router)', category: 'Fullstack Framework' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Styling' },
  { id: 'nodejs', name: 'Node.js & Express', category: 'Backend Runtime' },
  { id: 'python', name: 'Python 3', category: 'Language' },
  { id: 'django_fastapi', name: 'Django / FastAPI', category: 'Backend Framework' },
  { id: 'dsa', name: 'Data Structures & Algorithms', category: 'Computer Science' },
  { id: 'excel', name: 'Advanced Excel', category: 'Analytics' },
  { id: 'tableau', name: 'Tableau / PowerBI', category: 'Visualization' },
  { id: 'statistics', name: 'Probability & Statistics', category: 'Analytics' },
  { id: 'math_linear_algebra', name: 'Linear Algebra & Calculus', category: 'Mathematics' },
  { id: 'pytorch_tf', name: 'PyTorch / TensorFlow', category: 'Machine Learning' },
  { id: 'data_preprocessing', name: 'Data Preprocessing & Pandas', category: 'Data Science' }
];

export const ONBOARDING_STORAGE_KEY = 'devtrack_onboarding_data';

const inMemoryStorage: Record<string, string> = {};
let inMemoryActiveUserIdentifier: string | null = null;

function getCurrentUserIdentifier(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = localStorage.getItem('devtrack_current_user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        return u.username || u.email || (u.studentId ? String(u.studentId) : null);
      } catch {
        // fallback
      }
    }
  }
  return inMemoryActiveUserIdentifier;
}

function getScopedKey(): string {
  const userId = getCurrentUserIdentifier();
  return userId ? `${ONBOARDING_STORAGE_KEY}_${userId}` : ONBOARDING_STORAGE_KEY;
}

export const onboardingService = {
  setActiveUserIdentifier(id: string | null) {
    inMemoryActiveUserIdentifier = id;
  },

  /**
   * Fetch available career roles
   */
  async getCareerRoles(): Promise<CareerRole[]> {
    return Promise.resolve(CAREER_ROLES);
  },

  /**
   * Fetch all skills
   */
  async getAllSkills(): Promise<Skill[]> {
    return Promise.resolve(SKILLS_CATALOG);
  },

  /**
   * Pure, deterministic career readiness calculation engine
   * readiness % = (completed required skills / total required skills) * 100
   */
  calculateReadiness(
    selectedRoleId: string,
    studentSkills: Record<string, SkillStatus>
  ): CareerReadiness {
    const role = CAREER_ROLES.find((r) => r.id === selectedRoleId);
    if (!role) {
      return {
        percentage: 0,
        totalRequired: 0,
        completedCount: 0,
        learningCount: 0,
        missingCount: 0,
        skillBreakdown: []
      };
    }

    const requiredSkillIds = role.requiredSkillIds;
    let completedCount = 0;
    let learningCount = 0;
    let missingCount = 0;

    const skillBreakdown = requiredSkillIds.map((skillId) => {
      const skill = SKILLS_CATALOG.find((s) => s.id === skillId) || {
        id: skillId,
        name: skillId,
        category: 'General'
      };

      const status: SkillStatus = studentSkills[skillId] || 'NOT_STARTED';

      if (status === 'COMPLETED') {
        completedCount++;
      } else if (status === 'LEARNING') {
        learningCount++;
      } else {
        missingCount++;
      }

      return {
        skill,
        status,
        isRequired: true
      };
    });

    const totalRequired = requiredSkillIds.length;
    const percentage = totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0;

    return {
      percentage,
      totalRequired,
      completedCount,
      learningCount,
      missingCount,
      skillBreakdown
    };
  },

  /**
   * Save onboarding payload locally and prepare contract for POST /api/onboarding
   */
  async submitOnboarding(payload: OnboardingPayload): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      const serialized = JSON.stringify(payload);
      const key = getScopedKey();
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, serialized);
        // Also update base key if no user is set to maintain compatibility
        if (key === ONBOARDING_STORAGE_KEY) {
          localStorage.setItem(ONBOARDING_STORAGE_KEY, serialized);
        }
      } else {
        inMemoryStorage[key] = serialized;
        if (key === ONBOARDING_STORAGE_KEY) {
          inMemoryStorage[ONBOARDING_STORAGE_KEY] = serialized;
        }
      }
      resolve({
        success: true,
        message: 'Profile and career goal setup complete!'
      });
    });
  },

  /**
   * Check if onboarding has been completed
   */
  getOnboardingData(): OnboardingPayload | null {
    const key = getScopedKey();
    let raw: string | null = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      raw = localStorage.getItem(key) || (key !== ONBOARDING_STORAGE_KEY ? localStorage.getItem(ONBOARDING_STORAGE_KEY) : null);
    } else {
      raw = inMemoryStorage[key] || (key !== ONBOARDING_STORAGE_KEY ? inMemoryStorage[ONBOARDING_STORAGE_KEY] : null) || null;
    }
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  hasCompletedOnboarding(): boolean {
    return !!this.getOnboardingData();
  },

  clearOnboarding(): void {
    const key = getScopedKey();
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } else {
      delete inMemoryStorage[key];
      delete inMemoryStorage[ONBOARDING_STORAGE_KEY];
    }
  }
};
