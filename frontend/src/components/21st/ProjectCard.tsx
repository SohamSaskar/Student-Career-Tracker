'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';
import { FolderGit2, ExternalLink, Eye, Pencil, Trash2, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectItem } from '@/types/projects';

export interface ProjectCard21stProps {
  project: ProjectItem;
  onView?: (project: ProjectItem) => void;
  onEdit?: (project: ProjectItem) => void;
  onDelete?: (project: ProjectItem) => void;
  className?: string;
}

/**
 * 21st.dev Project Card Component
 * Sourced from 21st.dev card registry
 * Features:
 * - Geometric abstract visual fallback header
 * - Mouse spotlight reflection
 * - Accessible action triggers (View, Edit, Delete)
 * - Semantic status badges
 */
export function ProjectCard21st({
  project,
  onView,
  onEdit,
  onDelete,
  className,
}: ProjectCard21stProps) {
  const [imageError, setImageError] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    mouseX.set(e.nativeEvent.offsetX);
    mouseY.set(e.nativeEvent.offsetY);
  }

  const isCompleted = project.status === 'Completed';
  const isInProgress = project.status === 'In Progress';

  const statusBadgeStyle = isCompleted
    ? 'bg-[#E3F1EA] text-[#3D7C63] border-[#CDD3D8]'
    : isInProgress
    ? 'bg-[#F8EBD5] text-[#B07A32] border-[#CDD3D8]'
    : 'bg-[#ECEFF1] text-[#59616A] border-[#CDD3D8]';

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'group/projectcard relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#CDD3D8] bg-[#FFFFFF] transition-all duration-200 hover:-translate-y-1 hover:border-[#AAB3BB] hover:shadow-md',
        className
      )}
    >
      {/* 21st.dev subtle mouse-tracking spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/projectcard:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              220px circle at ${mouseX}px ${mouseY}px,
              rgba(91, 100, 112, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* MEDIA / ABSTRACT VISUAL HEADER */}
        <div className="relative w-full h-40 bg-[#ECEFF1] border-b border-[#CDD3D8] overflow-hidden flex items-center justify-center">
          {project.imageSrc && !imageError ? (
            <Image
              src={project.imageSrc}
              alt={`Visual demonstration of ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover/projectcard:scale-[1.03] transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Tasteful abstract technical blueprint graphic */
            <div className="relative w-full h-full bg-linear-to-br from-[#ECEFF1] via-[#F1F3F4] to-[#E4E8EC] flex items-center justify-center p-4">
              <svg
                className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id={`tech-grid-${project.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#5B6470" strokeWidth="0.75" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#tech-grid-${project.id})`} />
              </svg>

              <div className="relative flex flex-col items-center justify-center text-center space-y-1 z-10">
                <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] border border-[#CDD3D8] shadow-2xs flex items-center justify-center text-[#5B6470] group-hover/projectcard:text-[#30343A] transition-colors">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#7A838C] uppercase tracking-wider">
                  Technical Project
                </span>
              </div>
            </div>
          )}

          {/* Status Badge overlay */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs',
                statusBadgeStyle
              )}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-[#30343A] tracking-tight leading-snug line-clamp-1 group-hover/projectcard:text-[#4E5763] transition-colors">
              {project.title}
            </h3>

            <p className="text-xs text-[#59616A] leading-relaxed line-clamp-2">
              {project.description || 'Verified software engineering project linked with skill tags.'}
            </p>
          </div>

          {/* TECH STACK CHIPS */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F1F3F4] text-[#30343A] border border-[#CDD3D8] rounded"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-[#7A838C]">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* CARD FOOTER */}
        <div className="px-4 py-3 bg-[#F4F5F6] border-t border-[#CDD3D8] flex items-center justify-between gap-2 text-xs">
          {/* External links */}
          <div className="flex items-center gap-2.5">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#59616A] hover:text-[#30343A] hover:underline focus-visible:ring-2 focus-visible:ring-[#30343A] rounded px-1"
                aria-label={`View GitHub repository for ${project.title}`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            ) : (
              <span className="text-[#929AA2] text-[11px]">No repo</span>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[#52788A] hover:underline focus-visible:ring-2 focus-visible:ring-[#30343A] rounded px-1"
                aria-label={`View live demo for ${project.title}`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Demo</span>
              </a>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {onView && (
              <button
                type="button"
                onClick={() => onView(project)}
                aria-label={`View details for ${project.title}`}
                className="p-1.5 text-[#59616A] hover:text-[#30343A] hover:bg-[#ECEFF1] rounded transition-colors focus-visible:ring-2 focus-visible:ring-[#30343A]"
                title="View Details"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(project)}
                aria-label={`Edit ${project.title}`}
                className="p-1.5 text-[#59616A] hover:text-[#30343A] hover:bg-[#ECEFF1] rounded transition-colors focus-visible:ring-2 focus-visible:ring-[#30343A]"
                title="Edit Project"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(project)}
                aria-label={`Delete ${project.title}`}
                className="p-1.5 text-[#B85C58] hover:text-[#B85C58] hover:bg-[#F8E3E2] rounded transition-colors focus-visible:ring-2 focus-visible:ring-[#B85C58]"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
