import React, { useState } from 'react';
import { ProjectItem, ProjectStatus, CreateProjectPayload } from '@/types/projects';
import { SKILLS_CATALOG } from '@/services/onboardingService';
import { Modal } from './Modal';
import { Button } from './Button';
import { Check } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateProjectPayload) => Promise<void>;
  editingProject?: ProjectItem | null;
}

export function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  editingProject,
}: ProjectFormModalProps) {
  const [title, setTitle] = useState(() => editingProject?.title || '');
  const [description, setDescription] = useState(() => editingProject?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(() => editingProject?.status || 'In Progress');
  const [githubUrl, setGithubUrl] = useState(() => editingProject?.githubUrl || '');
  const [liveUrl, setLiveUrl] = useState(() => editingProject?.liveUrl || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() => editingProject?.techStack || ['React', 'TypeScript']);

  const [errors, setErrors] = useState<{ title?: string; githubUrl?: string; liveUrl?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: { title?: string; githubUrl?: string; liveUrl?: string } = {};

    if (!title || title.trim() === '') {
      newErrors.title = 'Project name is required.';
    }

    if (githubUrl.trim() !== '') {
      const isGithubValid =
        githubUrl.startsWith('http://') ||
        githubUrl.startsWith('https://') ||
        githubUrl.startsWith('github.com');
      if (!isGithubValid) {
        newErrors.githubUrl = 'Please enter a valid GitHub URL (e.g., https://github.com/user/repo).';
      }
    }

    if (liveUrl.trim() !== '') {
      const isLiveValid =
        liveUrl.startsWith('http://') ||
        liveUrl.startsWith('https://') ||
        liveUrl.includes('.app') ||
        liveUrl.includes('.com');
      if (!isLiveValid) {
        newErrors.liveUrl = 'Please enter a valid Live Demo URL (e.g., https://myproject.app).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      // Formats URLs if missing protocol
      let formattedGithub = githubUrl.trim();
      if (formattedGithub && !formattedGithub.startsWith('http://') && !formattedGithub.startsWith('https://')) {
        formattedGithub = `https://${formattedGithub}`;
      }

      let formattedLive = liveUrl.trim();
      if (formattedLive && !formattedLive.startsWith('http://') && !formattedLive.startsWith('https://')) {
        formattedLive = `https://${formattedLive}`;
      }

      await onSave({
        title: title.trim(),
        description: description.trim(),
        status,
        techStack: selectedSkills,
        githubUrl: formattedGithub || undefined,
        liveUrl: formattedLive || undefined,
      });

      onClose();
    } catch {
      setErrors({ title: 'Failed to save project. Please check backend connection.' });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProject ? 'Edit Project' : 'Add New Project'}
      description="Maintain verified software engineering projects for your portfolio and career readiness score."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="navy"
            size="sm"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#2B333B] text-white hover:bg-[#1B2026]"
          >
            {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#14181C] block">
            Project Name <span className="text-[#8F2F2B]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., FuelPulse — Fleet Fuel Analytics System"
            className={`w-full px-3.5 py-2 text-xs font-medium bg-[#F1F3F4] text-[#14181C] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14181C] ${
              errors.title ? 'border-[#8F2F2B]' : 'border-[#6E7781]'
            }`}
          />
          {errors.title && <p className="text-[11px] font-semibold text-[#8F2F2B]">{errors.title}</p>}
        </div>

        {/* Status Select */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#14181C] block">Development Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className="w-full px-3.5 py-2 text-xs font-semibold bg-[#F1F3F4] text-[#14181C] border border-[#6E7781] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14181C] cursor-pointer"
          >
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Description Textarea */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#14181C] block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Summarize the core features, architecture, database design, and key engineering metrics of your project..."
            className="w-full px-3.5 py-2 text-xs font-medium bg-[#F1F3F4] text-[#14181C] border border-[#6E7781] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14181C]"
          />
        </div>

        {/* URLs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#14181C] block">GitHub Repository URL</label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className={`w-full px-3.5 py-2 text-xs font-medium bg-[#F1F3F4] text-[#14181C] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14181C] ${
                errors.githubUrl ? 'border-[#8F2F2B]' : 'border-[#6E7781]'
              }`}
            />
            {errors.githubUrl && <p className="text-[11px] font-semibold text-[#8F2F2B]">{errors.githubUrl}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#14181C] block">Live Demo URL</label>
            <input
              type="text"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://myproject.demo.app"
              className={`w-full px-3.5 py-2 text-xs font-medium bg-[#F1F3F4] text-[#14181C] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14181C] ${
                errors.liveUrl ? 'border-[#8F2F2B]' : 'border-[#6E7781]'
              }`}
            />
            {errors.liveUrl && <p className="text-[11px] font-semibold text-[#8F2F2B]">{errors.liveUrl}</p>}
          </div>
        </div>

        {/* Skills Tagging Selector */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-[#14181C] block">
            Associated Skills & Technologies ({selectedSkills.length} Selected)
          </label>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-[#F1F3F4] border border-[#6E7781] rounded-lg">
            {SKILLS_CATALOG.map((skill) => {
              const isSelected = selectedSkills.includes(skill.name);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.name)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all tactile-press ${
                    isSelected
                      ? 'bg-[#2B333B] text-white font-bold shadow-2xs'
                      : 'bg-[#FFFFFF] text-[#2F363D] hover:bg-[#ECEFF1] border border-[#6E7781]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{skill.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
}
