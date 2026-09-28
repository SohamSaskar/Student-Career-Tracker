import React from 'react';
import Image from 'next/image';
import { CertificationItem } from '@/types/certifications';
import { Modal } from './Modal';
import { Button } from './Button';
import { ShieldCheck, ExternalLink, Calendar, Award, FileText, Download } from 'lucide-react';

interface CertificationDetailModalProps {
  certification: CertificationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificationDetailModal({
  certification,
  isOpen,
  onClose,
}: CertificationDetailModalProps) {
  if (!certification) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={certification.certificateName}
      description={`Issued by ${certification.issuer}`}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          {certification.credentialUrl ? (
            <a
              href={certification.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#52788A] bg-[#E1EEF3] hover:bg-[#ECEFF1] border border-[#CDD3D8] transition-colors"
            >
              <span>Verify Credential Online</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-xs text-[#7A838C]">No external verification link</span>
          )}

          <div className="flex items-center gap-2">
            {certification.fileDataUrl && (
              <a
                href={certification.fileDataUrl}
                download={certification.certificateFile || 'certificate_document'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#30343A] bg-[#ECEFF1] hover:bg-[#F1F3F4] border border-[#CDD3D8] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#5B6470]" />
                <span>Download File</span>
              </a>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* LARGER VISUAL PREVIEW OF THE ACTUAL CERTIFICATE */}
        <div className="relative w-full h-80 sm:h-96 bg-[#ECEFF1] border border-[#CDD3D8] rounded-xl flex items-center justify-center p-3 overflow-hidden shadow-2xs">
          {certification.thumbnailUrl ? (
            <Image
              src={certification.thumbnailUrl}
              alt={`Full size preview for ${certification.certificateName}`}
              fill
              sizes="(max-width: 1200px) 100vw, 800px"
              className="object-contain rounded"
            />
          ) : (
            <div className="text-center p-6 space-y-2">
              <FileText className="w-10 h-10 text-[#7A838C] mx-auto" />
              <p className="text-sm font-bold text-[#30343A]">Document preview unavailable</p>
            </div>
          )}

          {/* Verification Badge Overlay */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E3F1EA] text-[#3D7C63] border border-[#3D7C63] shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Credential</span>
            </span>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F4F5F6] p-4 border border-[#CDD3D8] rounded-xl">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#7A838C] uppercase tracking-wider block">Issuing Body</span>
            <p className="text-xs font-extrabold text-[#30343A] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#5B6470]" />
              {certification.issuer}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#7A838C] uppercase tracking-wider block">Issue & Expiry</span>
            <p className="text-xs font-semibold text-[#30343A] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#5B6470]" />
              {certification.issueDate
                ? new Date(certification.issueDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Verified'}
              {certification.expiryDate && (
                <span className="text-[#7A838C]">
                  {' '}
                  (Expires:{' '}
                  {new Date(certification.expiryDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                  )
                </span>
              )}
            </p>
          </div>

          {certification.credentialId && (
            <div className="space-y-1 sm:col-span-2 border-t border-[#CDD3D8] pt-2">
              <span className="text-[11px] font-bold text-[#7A838C] uppercase tracking-wider block">Credential / License Identifier</span>
              <p className="text-xs font-mono font-bold text-[#30343A] bg-[#ECEFF1] px-2.5 py-1 rounded border border-[#CDD3D8] inline-block">
                {certification.credentialId}
              </p>
            </div>
          )}
        </div>

        {/* Skills Associated */}
        {certification.skills && certification.skills.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#30343A] block">Verified Skills & Competencies</span>
            <div className="flex flex-wrap gap-1.5">
              {certification.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-bold bg-[#ECEFF1] text-[#30343A] border border-[#CDD3D8] rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
