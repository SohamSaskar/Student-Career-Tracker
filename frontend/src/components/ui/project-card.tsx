import React from 'react';
import { ProjectItem } from '@/types/projects';
import { ProjectCard21st } from '@/components/21st/ProjectCard';

export interface ProjectCardProps {
  project: ProjectItem;
  onView: (project: ProjectItem) => void;
  onEdit: (project: ProjectItem) => void;
  onDelete: (project: ProjectItem) => void;
}

/**
 * ProjectCard Wrapper
 * Renders the actual 21st.dev ProjectCard21st component
 * Preserves all original props, actions, and DevTrack data
 */
export function ProjectCard({ project, onView, onEdit, onDelete }: ProjectCardProps) {
  return (
    <ProjectCard21st
      project={project}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
