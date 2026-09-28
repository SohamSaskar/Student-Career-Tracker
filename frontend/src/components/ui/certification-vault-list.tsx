'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Award, ExternalLink } from 'lucide-react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { InfoCard } from '@/components/ui/info-card';

export interface CertificationItem {
  id: string | number;
  name: string;
  issuer: string;
  issueDate?: string;
  fileName?: string;
  isVerified?: boolean;
  thumbnailUrl?: string;
}

export interface CertificationVaultListProps {
  certifications: CertificationItem[];
}

export function CertificationVaultList({ certifications }: CertificationVaultListProps) {
  return (
    <CardSpotlight className="p-5 md:p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF] rounded-xl h-full flex flex-col justify-between shadow-2xs overflow-hidden">
      <div>
        {/* Header with Ledger Count and Action Link */}
        <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#30343A]" />
            <h2 className="text-xs font-bold text-[#59616A] uppercase tracking-wider">
              Certifications
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#ECEFF1] text-[#30343A] border border-[#CDD3D8]">
              {certifications.length} Credentials
            </span>
          </div>
          <Link
            href="/certifications"
            className="text-xs font-bold text-[#52788A] hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#30343A] rounded px-1"
          >
            Open Vault
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Ledger Rows */}
        {certifications.length === 0 ? (
          <div className="py-8 text-center bg-[#F5F6F7] border border-[#CDD3D8] rounded-lg p-4">
            <ShieldCheck className="w-6 h-6 text-[#7A838C] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#30343A]">No verified credentials uploaded yet</p>
            <p className="text-[11px] text-[#7A838C] mt-1">Upload industry certificates to boost career readiness score.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {certifications.slice(0, 4).map((cert, index) => {
              const thumbnail = cert.thumbnailUrl || '/images/cert-oracle.jpg';

              return (
                <InfoCard
                  key={cert.id || index}
                  className="p-3 flex items-center justify-between gap-3 bg-[#F5F6F7] hover:bg-[#ECEFF1] transition-all"
                  glowColor="rgba(47, 101, 128, 0.2)"
                >
                  {/* Thumbnail + Title Left */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-10 rounded border border-[#CDD3D8] overflow-hidden shrink-0 bg-[#FFFFFF]">
                      <Image
                        src={thumbnail}
                        alt={`Certificate thumbnail preview for ${cert.name}`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[#30343A] truncate">
                        {cert.name}
                      </h3>
                      <p className="text-[11px] text-[#59616A] truncate">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  {/* Date Right */}
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono font-semibold text-[#59616A] block">
                      {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Verified'}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E3F1EA] text-[#3D7C63] border border-[#CDD3D8]">
                      Verified
                    </span>
                  </div>
                </InfoCard>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-[#CDD3D8] mt-4 text-right">
        <span className="text-[11px] text-[#7A838C]">
          Cryptographically verified certificate ledger
        </span>
      </div>
    </CardSpotlight>
  );
}

