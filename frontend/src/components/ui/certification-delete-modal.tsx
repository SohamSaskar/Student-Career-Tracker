import React, { useState } from 'react';
import { CertificationItem } from '@/types/certifications';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface CertificationDeleteModalProps {
  certification: CertificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function CertificationDeleteModal({
  certification,
  isOpen,
  onClose,
  onConfirm,
}: CertificationDeleteModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!certification) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onConfirm(certification.id);
      onClose();
    } catch {
      // Error handled in parent toast
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Certificate?"
      description="This action cannot be undone. The credential and its associated skills verification will be removed from your portfolio."
      size="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-[#B85C58] text-white hover:bg-[#8F2F2B]"
          >
            {deleting ? 'Deleting...' : 'Delete Certificate'}
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3 p-3.5 bg-[#F8E3E2] border border-[#B85C58] rounded-xl text-[#8F2F2B]">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <div className="text-xs">
          <p className="font-extrabold">{certification.certificateName}</p>
          <p className="font-medium text-[#8F2F2B]">Issued by {certification.issuer}</p>
        </div>
      </div>
    </Modal>
  );
}
