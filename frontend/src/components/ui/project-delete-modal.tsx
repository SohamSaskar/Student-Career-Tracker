import React from 'react';
import { ProjectItem } from '@/types/projects';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ProjectDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  project: ProjectItem | null;
  deleting: boolean;
}

export function ProjectDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  project,
  deleting,
}: ProjectDeleteModalProps) {
  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Project?"
      description="This action cannot be undone."
      size="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            disabled={deleting}
            className="bg-[#8F2F2B] text-white hover:bg-[#6F2320]"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3 p-3 bg-[#F8E3E2] border border-[#CDD3D8] rounded-lg text-xs text-[#8F2F2B]">
        <AlertTriangle className="w-5 h-5 text-[#8F2F2B] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Permanently delete project &quot;{project.title}&quot;?</p>
          <p className="mt-1 text-[#8F2F2B]/90">
            This will remove the project from your Project Vault and update your Dashboard Recent Projects stack.
          </p>
        </div>
      </div>
    </Modal>
  );
}
