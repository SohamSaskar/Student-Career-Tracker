'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowUpRight, ShieldCheck, Sparkles, Zap, Heart, Terminal, Globe, Code2 } from 'lucide-react';
import Link from 'next/link';
import { ShimmerButton } from './ShimmerButton';

export interface MotionFooterProps {
  onPrivacyClick: () => void;
  onLoginClick: () => void;
  onGetStartedClick: () => void;
}

export function MotionFooter({ onPrivacyClick, onLoginClick, onGetStartedClick }: MotionFooterProps) {
  const productLinks = [
    { label: 'Product Overview', href: '#product' },
    { label: 'Skill Gap Analysis Engine', href: '/skill-gap' },
    { label: 'Smart Career Recommendations', href: '/recommendations' },
    { label: 'Interactive Learning Roadmap', href: '/roadmap' },
    { label: 'Verified Project Showcase', href: '/projects' },
  ];

  const resourceLinks = [
    { label: 'Certifications Vault', href: '/certifications' },
    { label: 'Career Readiness Index', href: '/readiness' },
    { label: 'Design System Tokens', href: '/design-system' },
    { label: 'Java Swing → Web Architecture', href: '#' },
  ];

  return (
    <footer className="relative bg-[#FFFFFF] border-t border-[#CDD3D8] pt-20 pb-12 text-xs overflow-hidden z-10">
      {/* Background Decorative Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[32rem] h-[32rem] bg-gradient-to-br from-[#7C3AED]/10 via-[#3B0764]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[28rem] h-[28rem] bg-gradient-to-tl from-[#581C87]/10 via-[#2E1065]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Top 21st.dev Callout CTA Box */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#181B1F] via-[#2E1065] to-[#181B1F] border border-[#7C3AED]/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle Shimmer Ray */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.35),rgba(255,255,255,0))]" />
          
          <div className="space-y-2 max-w-xl text-center md:text-left z-10">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Ready to land your dream target role?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Track your skills, close critical learning gaps, and build a verified portfolio engineered for top tech recruitment.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 z-10">
            <ShimmerButton onClick={onGetStartedClick} className="text-xs font-extrabold px-6 py-3">
              <span>Get Started Free</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </ShimmerButton>
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pt-4">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#181B1F] flex items-center justify-center text-white shadow-xs border border-[#7C3AED]/40">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#181B1F] tracking-tight">
                  DEVTRACK
                </span>
                <span className="text-[10px] font-mono font-bold text-[#7A838C] uppercase tracking-wider">
                  Career Readiness Platform
                </span>
              </div>
            </div>

            <p className="text-xs font-medium text-[#59616A] max-w-md leading-relaxed">
              DevTrack empowers computer science and engineering students to systematically analyze skill gaps, follow personalized learning roadmaps, and build verified portfolios that stand out to industry recruiters.
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3F1EA] text-[#1F6B4F] border border-[#1F6B4F]/30 text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Platform Engines Operational • v2.0</span>
            </div>
          </div>

          {/* Column 2: Core Platform Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-mono font-black text-[11px] text-[#181B1F] uppercase tracking-[0.1em] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Platform Engines</span>
            </h4>
            <ul className="space-y-2.5 text-[#59616A]">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#59616A] hover:text-[#181B1F] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CDD3D8] group-hover:bg-[#7C3AED] transition-colors" />
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 text-[#7C3AED]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources & Account Actions */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono font-black text-[11px] text-[#181B1F] uppercase tracking-[0.1em] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Account & Security</span>
            </h4>
            <ul className="space-y-2.5 text-[#59616A] text-xs font-bold">
              <li>
                <button
                  onClick={onLoginClick}
                  className="hover:text-[#7C3AED] transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CDD3D8]" />
                  <span>Student Sign In</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onGetStartedClick}
                  className="hover:text-[#7C3AED] transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CDD3D8]" />
                  <span>Create Student Account</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onPrivacyClick}
                  className="hover:text-[#7C3AED] transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CDD3D8]" />
                  <span>Privacy Policy & Data Security</span>
                </button>
              </li>
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#7C3AED] transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CDD3D8]" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 21st.dev Giant Backdrop Watermark Typography */}
        <div className="pt-6 border-t border-[#CDD3D8]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#7A838C] font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <p>© 2026 DevTrack • Student Career Readiness Platform</p>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#181B1F]">
              <Terminal className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Modern Next.js Stack</span>
            </span>
            <button
              onClick={onPrivacyClick}
              className="underline hover:text-[#7C3AED] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
