'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ShieldCheck } from 'lucide-react';

export interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DevTrack Platform Privacy Policy"
      description="How student profile, academic, and progress data is handled and isolated."
      footer={
        <Button variant="navy" size="sm" onClick={onClose}>
          Close Policy
        </Button>
      }
    >
      <div className="space-y-4 text-xs text-dt-secondary leading-relaxed">
        <div className="p-3 bg-dt-card border border-dt-border rounded-lg flex items-center gap-2.5 text-dt-primary">
          <ShieldCheck className="w-5 h-5 text-dt-navy flex-shrink-0" />
          <span className="font-semibold text-xs">Strict Student Data Isolation</span>
        </div>

        <div className="space-y-1">
          <h4 className="font-bold text-dt-primary text-xs">1. Data Storage & Multi-Tenancy</h4>
          <p>
            DevTrack stores student academic background, career goals, skill inventories, portfolio project links, and certification files in an isolated MySQL database with multi-tenant student session isolation.
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="font-bold text-dt-primary text-xs">2. Authentication Security</h4>
          <p>
            Passwords are encrypted using BCrypt hashing algorithms before database storage. No plain-text credentials or API secrets are stored on the frontend client.
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="font-bold text-dt-primary text-xs">3. Local File Uploads</h4>
          <p>
            Uploaded certification PDF documents and image files are stored in relative application storage (`uploads/certificates/`) tied specifically to the authenticated student ID.
          </p>
        </div>
      </div>
    </Modal>
  );
}
