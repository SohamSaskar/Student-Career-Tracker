'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProgressionFlowSection } from '@/components/landing/ProgressionFlowSection';
import { SkillGapSection } from '@/components/landing/SkillGapSection';
import { RoadmapSection } from '@/components/landing/RoadmapSection';
import { VaultSection } from '@/components/landing/VaultSection';
import { ReadinessSection } from '@/components/landing/ReadinessSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { PrivacyPolicyModal } from '@/components/landing/PrivacyPolicyModal';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { Button } from '@/components/ui/Button';
import { FadeInOnScroll } from '@/components/motion/FadeInOnScroll';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PublicLandingPage() {
  const router = useRouter();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSeeHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#30343A] flex flex-col font-sans selection:bg-[#30343A] selection:text-white">
      {/* 1. Public Product Navbar */}
      <LandingNavbar
        onLoginClick={handleLogin}
        onGetStartedClick={handleGetStarted}
      />

      {/* Main Content Showcase */}
      <main id="product" className="flex-1">
        {/* 2. Hero Section with 21st.dev ContainerScroll, ShimmerButton, WordRotate */}
        <HeroSection
          targetRole="Backend Software Engineer"
          showPreview={true}
          onGetStartedClick={handleGetStarted}
          onSeeHowItWorksClick={handleSeeHowItWorks}
        />

        {/* 3. Progression Flow Section (7-Stage Engine Sequence) */}
        <ProgressionFlowSection />

        {/* 4. Skill Gap Engine Showcase */}
        <SkillGapSection />

        {/* 5. Structured Learning Roadmap Showcase */}
        <RoadmapSection />

        {/* 6. Evidence Vaults (Projects & Certifications) Showcase */}
        <VaultSection />

        {/* 7. Career Readiness Engine Showcase */}
        <ReadinessSection />

        {/* 8. Final Call to Action Section */}
        <section className="py-20 bg-[#FFFFFF] border-t border-[#CDD3D8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <FadeInOnScroll durationMs={450}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#30343A] tracking-tight leading-tight">
                Know where you stand. <br className="hidden sm:inline" />
                Build your software engineering career.
              </h2>
              <p className="text-sm sm:text-base text-[#59616A] max-w-2xl mx-auto mt-3">
                No guesswork. DevTrack provides computer science students with deterministic skill gap analyses, structured roadmaps, and verified evidence vaults.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
                <ShimmerButton
                  onClick={handleGetStarted}
                  className="text-sm font-semibold bg-[#30343A] text-white hover:bg-[#202428] px-6 py-3 rounded-xl shadow-xs"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </ShimmerButton>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLogin}
                  className="border-[#CDD3D8] text-[#30343A] hover:bg-[#ECEFF1]"
                >
                  Log In to DevTrack
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-[#7A838C]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7C63]" /> Free for CS Students
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7C63]" /> 3NF Data-Driven Metrics
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D7C63]" /> Multi-Tenant Session Isolation
                </span>
              </div>
            </FadeInOnScroll>
          </div>
        </section>
      </main>

      {/* 9. Landing Footer */}
      <LandingFooter
        onPrivacyClick={() => setIsPrivacyOpen(true)}
        onLoginClick={handleLogin}
        onGetStartedClick={handleGetStarted}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
