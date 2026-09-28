import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReadinessProjectSummary, ReadinessCertSummary } from '@/types/readiness';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { FolderGit2, Award, ExternalLink, ShieldCheck } from 'lucide-react';

interface ReadinessVaultSummaryProps {
  projectSummary: ReadinessProjectSummary;
  certificationSummary: ReadinessCertSummary;
}

export function ReadinessVaultSummary({
  projectSummary,
  certificationSummary,
}: ReadinessVaultSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Projects Summary Card */}
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <CardSpotlight className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-2xl p-6 shadow-xs hover:shadow-md space-y-4 flex flex-col justify-between transition-all group text-[#30343A]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F4] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ECEFF1] border border-[#CDD3D8] flex items-center justify-center text-[#30343A] group-hover:scale-105 transition-transform">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#30343A]">Project Portfolio Vault</h3>
                  <p className="text-xs text-[#7A838C]">Verified software projects</p>
                </div>
              </div>

              <Link
                href="/projects"
                className="text-xs font-bold text-[#52788A] hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#30343A] rounded px-2 py-1 bg-[#F5F6F7] border border-[#CDD3D8]"
              >
                <span>Open Vault</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#F4F5F6] border border-[#CDD3D8] rounded-xl text-center">
                <span className="text-[10px] font-mono font-bold text-[#7A838C] uppercase tracking-wider block mb-0.5">
                  Total Projects
                </span>
                <span className="text-2xl font-black text-[#30343A] font-mono">{projectSummary.totalProjects}</span>
              </div>
              <div className="p-3.5 bg-[#E3F1EA] border border-[#CDD3D8] rounded-xl text-center">
                <span className="text-[10px] font-mono font-bold text-[#3D7C63] uppercase tracking-wider block mb-0.5">
                  Completed
                </span>
                <span className="text-2xl font-black text-[#30343A] font-mono">{projectSummary.completedProjects}</span>
              </div>
            </div>

            {projectSummary.recentProjectTitle && (
              <p className="text-xs text-[#59616A] truncate pt-1">
                <span className="font-bold">Recent Project:</span> {projectSummary.recentProjectTitle}
              </p>
            )}
          </div>
        </CardSpotlight>
      </motion.div>

      {/* Certifications Summary Card */}
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <CardSpotlight className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-2xl p-6 shadow-xs hover:shadow-md space-y-4 flex flex-col justify-between transition-all group text-[#30343A]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F3F4] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ECEFF1] border border-[#CDD3D8] flex items-center justify-center text-[#30343A] group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#30343A]">Certification Vault</h3>
                  <p className="text-xs text-[#7A838C]">Verified credentials & licenses</p>
                </div>
              </div>

              <Link
                href="/certifications"
                className="text-xs font-bold text-[#52788A] hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#30343A] rounded px-2 py-1 bg-[#F5F6F7] border border-[#CDD3D8]"
              >
                <span>Open Vault</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#F4F5F6] border border-[#CDD3D8] rounded-xl text-center">
                <span className="text-[10px] font-mono font-bold text-[#7A838C] uppercase tracking-wider block mb-0.5">
                  Total Credentials
                </span>
                <span className="text-2xl font-black text-[#30343A] font-mono">{certificationSummary.totalCertifications}</span>
              </div>
              <div className="p-3.5 bg-[#E3F1EA] border border-[#CDD3D8] rounded-xl text-center">
                <span className="text-[10px] font-mono font-bold text-[#3D7C63] uppercase tracking-wider block mb-0.5">
                  Verified
                </span>
                <span className="text-2xl font-black text-[#30343A] font-mono flex items-center justify-center gap-1">
                  <ShieldCheck className="w-5 h-5 text-[#3D7C63]" />
                  {certificationSummary.verifiedCertifications}
                </span>
              </div>
            </div>

            {certificationSummary.recentCertName && (
              <p className="text-xs text-[#59616A] truncate pt-1">
                <span className="font-bold">Recent Credential:</span> {certificationSummary.recentCertName}
              </p>
            )}
          </div>
        </CardSpotlight>
      </motion.div>
    </div>
  );
}


