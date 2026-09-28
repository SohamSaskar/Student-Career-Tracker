import React from 'react';
import { ProjectItem } from '@/types/projects';
import { Modal } from './Modal';
import { Button } from './Button';
import { FolderGit2, ExternalLink, Calendar, Code } from 'lucide-react';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
  onEdit: (project: ProjectItem) => void;
}

export function ProjectDetailModal({
  isOpen,
  onClose,
  project,
  onEdit,
}: ProjectDetailModalProps) {
  if (!project) return null;

  const isCompleted = project.status === 'Completed';
  const isInProgress = project.status === 'In Progress';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.title}
      description="Detailed project specification and skill alignment details."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Overview
          </Button>
          <Button
            variant="navy"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(project);
            }}
            className="bg-[#2B333B] text-white hover:bg-[#1B2026]"
          >
            Edit Project
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Status Strip & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F1F3F4] border border-[#6E7781] rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4A535C]">Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
                isCompleted
                  ? 'bg-[#E3F1EA] text-[#17573F] border-[#CDD3D8]'
                  : isInProgress
                  ? 'bg-[#F8EBD5] text-[#6F4708] border-[#CDD3D8]'
                  : 'bg-[#ECEFF1] text-[#4A535C] border-[#6E7781]'
              }`}
            >
              {project.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-[#4A535C]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Created: {project.createdAt}
            </span>
            <span>•</span>
            <span>Updated: {project.updatedAt}</span>
          </div>
        </div>

        {/* Full Description */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-[#4A535C] uppercase tracking-wider">
            Project Overview & Architecture
          </h4>
          <p className="text-sm text-[#14181C] leading-relaxed whitespace-pre-line bg-[#FFFFFF] p-4 border border-[#6E7781] rounded-lg">
            {project.description || 'No detailed description provided for this project.'}
          </p>
        </div>

        {/* Tagged Skills */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Code className="w-4 h-4 text-[#14181C]" />
              <h4 className="text-xs font-bold text-[#4A535C] uppercase tracking-wider">
                Associated Skills & Technologies
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 bg-[#F1F3F4] border border-[#6E7781] rounded-lg">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-[#FFFFFF] text-[#14181C] border border-[#6E7781] rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Repository & Demo External Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-[#FFFFFF] border border-[#6E7781] rounded-lg space-y-1">
            <span className="text-[11px] font-bold text-[#4A535C] uppercase tracking-wider block">
              GitHub Repository
            </span>
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14181C] hover:text-[#1F5570] hover:underline focus-visible:ring-2 focus-visible:ring-[#14181C] rounded"
              >
                <FolderGit2 className="w-4 h-4 text-[#14181C]" />
                <span className="truncate">{project.githubUrl}</span>
              </a>
            ) : (
              <span className="text-xs text-[#7A838C]">Repository URL not provided</span>
            )}
          </div>

          <div className="p-3 bg-[#FFFFFF] border border-[#6E7781] rounded-lg space-y-1">
            <span className="text-[11px] font-bold text-[#4A535C] uppercase tracking-wider block">
              Live Demo Application
            </span>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F5570] hover:underline focus-visible:ring-2 focus-visible:ring-[#14181C] rounded"
              >
                <ExternalLink className="w-4 h-4 text-[#1F5570]" />
                <span className="truncate">{project.liveUrl}</span>
              </a>
            ) : (
              <span className="text-xs text-[#7A838C]">Live demo URL not provided</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
