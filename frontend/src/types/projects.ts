export type ProjectStatus = 'Planned' | 'In Progress' | 'Completed';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
  imageSrc?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
  imageSrc?: string;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  techStack?: string[];
  status?: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
  imageSrc?: string;
}

export type ProjectFilterStatus = 'ALL' | 'Planned' | 'In Progress' | 'Completed';
