'use client';

import React from 'react';
import { InfoCard } from '@/components/ui/info-card';
import { PrebuiltCard } from '@/components/ui/prebuilt-card';
import { Badge } from '@/components/ui/Badge';
import { FadeInOnScroll } from '@/components/motion/FadeInOnScroll';
import { Award, FileText, ShieldCheck, FolderGit2, Code2 } from 'lucide-react';

export function VaultSection() {
  const featuredCards = [
    {
      title: 'FuelPulse — Fuel Tracking & Analytics',
      description: 'Fleet metrics tracking app with real-time fuel efficiency analytics, PDF report generation, and JDBC integration.',
      category: 'Java 21 • Enterprise',
      date: 'Aug 2025',
      readTime: 'Backend Verified',
      imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      href: '/projects',
      tags: ['Java 21', 'MySQL', 'JDBC', 'PDFBox'],
      author: { name: 'Verified Repository' },
    },
    {
      title: 'DevTrack — Career Readiness Engine',
      description: 'Full-stack platform featuring skill gap analysis, interactive roadmaps, 3NF schema, and multi-tenant authentication.',
      category: 'Next.js • Fullstack',
      date: 'Jan 2026',
      readTime: 'Active Project',
      imageSrc: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      href: '/projects',
      tags: ['Next.js', 'TypeScript', 'Tailwind', 'MySQL'],
      author: { name: 'Verified Repository' },
    },
  ];

  const certs = [
    {
      name: 'Oracle Certified Professional: Java SE 21',
      issuer: 'Oracle Corporation',
      date: 'Aug 2025',
      file: 'cert_oracle_java21.pdf',
    },
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: 'Jan 2026',
      file: 'cert_aws_ccp.pdf',
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-5 space-y-4 pt-2">
            <FadeInOnScroll durationMs={400}>
              <span className="font-mono text-xs font-bold text-[#858C94] uppercase tracking-wider block mb-1">
                03 / EVIDENCE VAULTS
              </span>
              <h2 className="text-3xl sm:text-[36px] md:text-[42px] font-extrabold text-[#34383D] tracking-[-0.025em] leading-[1.08]">
                Keep the proof of your progress in one place.
              </h2>
              <p className="text-sm sm:text-base font-normal text-[#626971] leading-[1.6] pt-1">
                Showcase verified software projects and industry credentials with direct GitHub repositories and credential evidence.
              </p>
            </FadeInOnScroll>
          </div>

          {/* Right Workspace Preview with PrebuiltUI Cards */}
          <div className="lg:col-span-7">
            <FadeInOnScroll durationMs={500} delayMs={100}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PrebuiltUI Featured Cards */}
                {featuredCards.map((card) => (
                  <PrebuiltCard key={card.title} {...card} />
                ))}
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}



