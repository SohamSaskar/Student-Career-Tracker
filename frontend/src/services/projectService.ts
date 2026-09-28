import { ProjectItem, CreateProjectPayload, UpdateProjectPayload } from '@/types/projects';

export const PROJECTS_STORAGE_KEY = 'devtrack_student_projects';

const inMemoryStorage: Record<string, string> = {};
let inMemoryActiveProjectUserKey: string | null = null;

function getCurrentProjectUserIdentifier(): string | null {
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
  return inMemoryActiveProjectUserKey;
}

function getScopedProjectKey(): string {
  const userId = getCurrentProjectUserIdentifier();
  return userId ? `${PROJECTS_STORAGE_KEY}_${userId}` : PROJECTS_STORAGE_KEY;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'FuelPulse — Fuel Tracking System',
    description: 'Java 21 Swing & MySQL application for tracking fleet fuel metrics, calculating consumption rates, and generating automated PDF reports.',
    techStack: ['Java 21', 'MySQL', 'JDBC', 'PDFBox'],
    status: 'Completed',
    githubUrl: 'https://github.com/student/fuelpulse',
    liveUrl: 'https://fuelpulse.demo.app',
    imageSrc: '/images/project-fuelpulse.jpg',
    createdAt: 'Sep 2025',
    updatedAt: '2 days ago',
  },
  {
    id: 'proj-2',
    title: 'DevTrack Student Platform',
    description: 'Student career readiness platform mapping skill gaps, recommended learning paths, evidence vaults, and readiness metrics.',
    techStack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Spring Boot'],
    status: 'In Progress',
    githubUrl: 'https://github.com/student/devtrack',
    liveUrl: 'https://devtrack.student.app',
    createdAt: 'Aug 2025',
    updatedAt: 'Yesterday',
  },
];

export const projectService = {
  setActiveUserIdentifier(id: string | null) {
    inMemoryActiveProjectUserKey = id;
  },

  storageFallback(): string | null {
    const key = getScopedProjectKey();
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key) || (key !== PROJECTS_STORAGE_KEY ? localStorage.getItem(PROJECTS_STORAGE_KEY) : null);
    }
    return inMemoryStorage[key] || (key !== PROJECTS_STORAGE_KEY ? inMemoryStorage[PROJECTS_STORAGE_KEY] : null) || null;
  },

  /**
   * Fetches all projects for the authenticated student session
   */
  async getProjects(): Promise<ProjectItem[]> {
    // Simulate lightweight API latency
    await new Promise((resolve) => setTimeout(resolve, 250));

    const raw: string | null = this.storageFallback();
    const key = getScopedProjectKey();

    if (!raw) {
      const serialized = JSON.stringify(DEFAULT_PROJECTS);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, serialized);
        if (key === PROJECTS_STORAGE_KEY) localStorage.setItem(PROJECTS_STORAGE_KEY, serialized);
      } else {
        inMemoryStorage[key] = serialized;
        if (key === PROJECTS_STORAGE_KEY) inMemoryStorage[PROJECTS_STORAGE_KEY] = serialized;
      }
      return DEFAULT_PROJECTS;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PROJECTS;
    }
  },

  /**
   * Fetches details of a specific project by ID
   */
  async getProjectById(id: string): Promise<ProjectItem | null> {
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id) || null;
  },

  /**
   * Creates a new project and persists it to the authenticated student's vault
   */
  async createProject(payload: CreateProjectPayload): Promise<ProjectItem> {
    if (!payload.title || payload.title.trim() === '') {
      throw new Error('Project name is required.');
    }

    const projects = await this.getProjects();

    const currentDateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: payload.title.trim(),
      description: payload.description ? payload.description.trim() : '',
      techStack: payload.techStack || [],
      status: payload.status || 'Planned',
      githubUrl: payload.githubUrl ? payload.githubUrl.trim() : undefined,
      liveUrl: payload.liveUrl ? payload.liveUrl.trim() : undefined,
      imageSrc: payload.imageSrc || '/images/project-fuelpulse.jpg',
      createdAt: currentDateStr,
      updatedAt: 'Just now',
    };

    const updatedList = [newProject, ...projects];
    const serialized = JSON.stringify(updatedList);
    const key = getScopedProjectKey();

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, serialized);
      if (key === PROJECTS_STORAGE_KEY) localStorage.setItem(PROJECTS_STORAGE_KEY, serialized);
    } else {
      inMemoryStorage[key] = serialized;
      if (key === PROJECTS_STORAGE_KEY) inMemoryStorage[PROJECTS_STORAGE_KEY] = serialized;
    }

    return newProject;
  },

  /**
   * Updates an existing project in place
   */
  async updateProject(id: string, payload: UpdateProjectPayload): Promise<ProjectItem> {
    const projects = await this.getProjects();
    const index = projects.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Project not found.');
    }

    if (payload.title !== undefined && payload.title.trim() === '') {
      throw new Error('Project name cannot be empty.');
    }

    const target = projects[index];
    const updatedProject: ProjectItem = {
      ...target,
      title: payload.title !== undefined ? payload.title.trim() : target.title,
      description: payload.description !== undefined ? payload.description.trim() : target.description,
      techStack: payload.techStack !== undefined ? payload.techStack : target.techStack,
      status: payload.status !== undefined ? payload.status : target.status,
      githubUrl: payload.githubUrl !== undefined ? payload.githubUrl.trim() : target.githubUrl,
      liveUrl: payload.liveUrl !== undefined ? payload.liveUrl.trim() : target.liveUrl,
      imageSrc: payload.imageSrc !== undefined ? payload.imageSrc : target.imageSrc,
      updatedAt: 'Just now',
    };

    projects[index] = updatedProject;
    const serialized = JSON.stringify(projects);
    const key = getScopedProjectKey();

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, serialized);
      if (key === PROJECTS_STORAGE_KEY) localStorage.setItem(PROJECTS_STORAGE_KEY, serialized);
    } else {
      inMemoryStorage[key] = serialized;
      if (key === PROJECTS_STORAGE_KEY) inMemoryStorage[PROJECTS_STORAGE_KEY] = serialized;
    }

    return updatedProject;
  },

  /**
   * Deletes a project by ID from the authenticated student's vault
   */
  async deleteProject(id: string): Promise<boolean> {
    const projects = await this.getProjects();
    const updatedList = projects.filter((p) => p.id !== id);

    const serialized = JSON.stringify(updatedList);
    const key = getScopedProjectKey();

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, serialized);
      if (key === PROJECTS_STORAGE_KEY) localStorage.setItem(PROJECTS_STORAGE_KEY, serialized);
    } else {
      inMemoryStorage[key] = serialized;
      if (key === PROJECTS_STORAGE_KEY) inMemoryStorage[PROJECTS_STORAGE_KEY] = serialized;
    }

    return true;
  },
};
