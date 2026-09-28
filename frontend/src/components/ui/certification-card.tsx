import React, { useState } from 'react';
import Image from 'next/image';
import { CertificationItem } from '@/types/certifications';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { Button } from './Button';
import { ShieldCheck, Eye, Pencil, Trash2, Calendar, Award, AlertCircle } from 'lucide-react';

interface CertificationCardProps {
  certification: CertificationItem;
  onView: (cert: CertificationItem) => void;
  onEdit: (cert: CertificationItem) => void;
  onDelete: (cert: CertificationItem) => void;
}

export function CertificationCard({
  certification,
  onView,
  onEdit,
  onDelete,
}: CertificationCardProps) {
  const [imageError, setImageError] = useState(false);

  // Expiry calculation
  const getExpiryStatus = () => {
    if (!certification.expiryDate) return { label: 'Verified', variant: 'success' };
    const today = new Date();
    const expiry = new Date(certification.expiryDate);

    if (expiry < today) {
      return { label: 'Expired', variant: 'danger' };
    }

    const next60Days = new Date();
    next60Days.setDate(today.getDate() + 60);
    if (expiry <= next60Days) {
      return { label: 'Expiring Soon', variant: 'warning' };
    }

    return { label: 'Verified', variant: 'success' };
  };

  const status = getExpiryStatus();

  return (
    <CardSpotlight className="p-0 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF] rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* ACTUAL CERTIFICATE PREVIEW AREA */}
        <div className="relative w-full h-44 bg-[#ECEFF1] border-b border-[#CDD3D8] flex items-center justify-center p-2.5 overflow-hidden">
          {certification.thumbnailUrl && !imageError ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={certification.thumbnailUrl}
                alt={`Actual visual preview for certificate ${certification.certificateName}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain rounded border border-[#CDD3D8] shadow-2xs group-hover:scale-[1.01] transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            /* Fallback for missing or corrupt files */
            <div className="w-full h-full rounded border border-dashed border-[#B9C1C8] bg-[#F1F3F4] flex flex-col items-center justify-center text-center p-4 space-y-1.5">
              <AlertCircle className="w-6 h-6 text-[#7A838C]" />
              <p className="text-xs font-bold text-[#30343A]">Certificate preview unavailable</p>
              <p className="text-[11px] text-[#7A838C]">Document missing or unreadable</p>
            </div>
          )}

          {/* Verification Badge Overlay */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide border shadow-2xs ${
                status.variant === 'success'
                  ? 'bg-[#E3F1EA] text-[#3D7C63] border-[#3D7C63]'
                  : status.variant === 'warning'
                  ? 'bg-[#F8EBD5] text-[#B07A32] border-[#B07A32]'
                  : 'bg-[#F8E3E2] text-[#B85C58] border-[#B85C58]'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{status.label}</span>
            </span>
          </div>
        </div>

        {/* Certificate Metadata */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-[#30343A] leading-snug line-clamp-2 group-hover:text-[#4E5763] transition-colors">
              {certification.certificateName}
            </h3>
            <p className="text-xs font-bold text-[#59616A] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#5B6470] shrink-0" />
              <span className="truncate">{certification.issuer}</span>
            </p>
          </div>

          {/* Dates & Credential ID */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-semibold text-[#7A838C] gap-2 pt-1 border-t border-[#F1F3F4]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#5B6470]" />
              {certification.issueDate
                ? new Date(certification.issueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Issued'}
            </span>

            {certification.credentialId && (
              <span className="font-mono text-[10px] bg-[#ECEFF1] text-[#30343A] px-1.5 py-0.5 rounded border border-[#CDD3D8]">
                ID: {certification.credentialId}
              </span>
            )}
          </div>

          {/* Associated Skills */}
          {certification.skills && certification.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {certification.skills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] font-bold bg-[#F1F3F4] text-[#30343A] border border-[#CDD3D8] rounded"
                >
                  {skill}
                </span>
              ))}
              {certification.skills.length > 4 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-[#7A838C]">
                  +{certification.skills.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 py-3 bg-[#F4F5F6] border-t border-[#CDD3D8] flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(certification)}
          className="flex-1 text-xs font-bold text-[#30343A] hover:bg-[#ECEFF1] border-[#CDD3D8] tactile-press"
        >
          <Eye className="w-3.5 h-3.5 mr-1 text-[#5B6470]" /> View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(certification)}
          className="flex-1 text-xs font-bold text-[#30343A] hover:bg-[#ECEFF1] border-[#CDD3D8] tactile-press"
        >
          <Pencil className="w-3.5 h-3.5 mr-1 text-[#5B6470]" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(certification)}
          className="text-xs font-bold text-[#B85C58] hover:bg-[#F8E3E2] border-[#CDD3D8] hover:border-[#B85C58] tactile-press"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </CardSpotlight>
  );
}
