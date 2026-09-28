'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Select } from '@/components/ui/Select';
import { SearchInput } from '@/components/ui/SearchInput';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { FadeInOnScroll } from '@/components/motion/FadeInOnScroll';
import { VisualCanvas } from '@/components/canvas/VisualCanvas';
import { useToast } from '@/components/toast/ToastProvider';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  MousePointerClick,
  Eye,
  Sliders,
  Code2,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function DesignSystemPage() {
  const { showToast } = useToast();
  const [activeNav, setActiveNav] = useState('#design-system');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingSkeletons, setIsLoadingSkeletons] = useState(false);
  const [canvasActive, setCanvasActive] = useState(false);

  // Form states for demo
  const [nameValue, setNameValue] = useState('Alex Morgan');
  const [searchValue, setSearchValue] = useState('');
  const [targetRole, setTargetRole] = useState('backend');
  const [progressVal, setProgressVal] = useState(68);

  return (
    <div className="min-h-screen bg-dt-page flex flex-col font-sans pb-16">
      <Navbar
        activeHref={activeNav}
        onNavigate={(href) => setActiveNav(href)}
      />

      <PageContainer size="lg" className="space-y-12">
        <FadeInOnScroll durationMs={400}>
          <div className="bg-dt-elevated border border-dt-border rounded-2xl p-6 md:p-8 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-dt-input border border-dt-border text-xs font-semibold text-dt-navy">
                  <ShieldCheck className="w-3.5 h-3.5 text-dt-navy" />
                  DevTrack Design System Reference
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-dt-primary tracking-tight">
                  Design System &{' '}
                  <span className="font-serif italic font-normal text-dt-secondary">
                    Component Tokens
                  </span>
                </h1>
                <p className="text-sm md:text-base text-dt-secondary leading-relaxed">
                  Editorial, technical, and structured design system reference for DevTrack.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoadingSkeletons((prev) => !prev)}
                  leftIcon={<Sliders className="w-4 h-4" />}
                >
                  {isLoadingSkeletons ? 'Show Content' : 'Toggle Skeletons'}
                </Button>
                <Button
                  variant="navy"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  leftIcon={<Eye className="w-4 h-4" />}
                >
                  Open Dialog
                </Button>
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        {/* COLOR PALETTE */}
        <FadeInOnScroll durationMs={500} delayMs={50}>
          <section id="colors" className="space-y-4">
            <SectionHeader
              title="Color System"
              italicAccent="& Surface Hierarchy"
              description="Restrained DevTrack palette tailored for readability and clear status communication."
              badge={<Badge variant="info">Hex Verified</Badge>}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 bg-[#F7F8FA] border border-[#E4DED2] rounded-xl flex flex-col justify-between h-28 shadow-2xs">
                <span className="text-xs font-bold text-[#101318]">Page Background</span>
                <div>
                  <p className="text-[11px] font-mono text-[#4B505A]">#F7F8FA</p>
                  <p className="text-[10px] text-[#868C96]">Body Canvas</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#EAEDF1] border border-[#E4DED2] rounded-xl flex flex-col justify-between h-28 shadow-2xs">
                <span className="text-xs font-bold text-[#101318]">Card Surface</span>
                <div>
                  <p className="text-[11px] font-mono text-[#4B505A]">#EAEDF1</p>
                  <p className="text-[10px] text-[#868C96]">Base Surface</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#FFFFFF] border border-[#E4DED2] rounded-xl flex flex-col justify-between h-28 shadow-2xs">
                <span className="text-xs font-bold text-[#101318]">Elevated Surface</span>
                <div>
                  <p className="text-[11px] font-mono text-[#4B505A]">#FFFFFF</p>
                  <p className="text-[10px] text-[#868C96]">Active Component</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#DCE0E6] border border-[#E4DED2] rounded-xl flex flex-col justify-between h-28 shadow-2xs">
                <span className="text-xs font-bold text-[#101318]">Input Surface</span>
                <div>
                  <p className="text-[11px] font-mono text-[#4B505A]">#DCE0E6</p>
                  <p className="text-[10px] text-[#868C96]">Controls & Fields</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#0D1B33] text-white border border-[#0D1B33] rounded-xl flex flex-col justify-between h-28 shadow-xs">
                <span className="text-xs font-bold">Primary Navy</span>
                <div>
                  <p className="text-[11px] font-mono opacity-90">#0D1B33</p>
                  <p className="text-[10px] opacity-75">Brand Action</p>
                </div>
              </div>

              <div className="p-3.5 bg-dt-elevated border-2 border-[#E4DED2] rounded-xl flex flex-col justify-between h-28 shadow-2xs">
                <span className="text-xs font-bold text-[#101318]">Default Border</span>
                <div>
                  <p className="text-[11px] font-mono text-[#4B505A]">#E4DED2</p>
                  <p className="text-[10px] text-[#868C96]">Subtle Division</p>
                </div>
              </div>
            </div>
          </section>
        </FadeInOnScroll>

        {/* TYPOGRAPHY */}
        <FadeInOnScroll durationMs={500} delayMs={100}>
          <section id="typography" className="space-y-4">
            <SectionHeader
              title="Typography Stack"
              italicAccent="& Scale"
              description="Primary UI font Plus Jakarta Sans, Newsreader italic editorial accent, and JetBrains Mono for technical attributes."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="elevated" className="space-y-3">
                <CardHeader>
                  <Badge variant="neutral" className="w-fit">Primary Interface Font</Badge>
                  <CardTitle className="text-lg">Plus Jakarta Sans</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <p className="font-bold text-base text-dt-primary">700 Bold — Major Section Headers</p>
                  <p className="font-semibold text-sm text-dt-primary">600 SemiBold — Card & Subsection Titles</p>
                  <p className="font-medium text-xs text-dt-secondary">500 Medium — Form Labels & Action Buttons</p>
                  <p className="font-normal text-xs text-dt-secondary">400 Regular — Standard body text.</p>
                </CardContent>
              </Card>

              <Card variant="elevated" className="space-y-3">
                <CardHeader>
                  <Badge variant="info" className="w-fit">Editorial Accent</Badge>
                  <CardTitle className="text-lg font-serif italic font-normal">Newsreader Italic</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <p className="font-serif italic text-base text-dt-primary">&ldquo;Targeting Backend Software Engineering&rdquo;</p>
                  <p className="font-serif italic text-sm text-dt-secondary">Used selectively for editorial accents.</p>
                </CardContent>
              </Card>

              <Card variant="elevated" className="space-y-3">
                <CardHeader>
                  <Badge variant="neutral" className="w-fit">Technical Spec</Badge>
                  <CardTitle className="font-mono text-base">JetBrains Mono</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="bg-dt-input p-2.5 rounded-lg border border-dt-border font-mono text-xs text-dt-primary space-y-1">
                    <p className="text-dt-navy font-bold">readiness_percentage: 68.4%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </FadeInOnScroll>

        {/* BUTTONS */}
        <FadeInOnScroll durationMs={500} delayMs={150}>
          <section id="buttons" className="space-y-4">
            <SectionHeader
              title="Buttons & Controls"
              italicAccent="with Tactile Physics"
              description="Tactile active press scaling (0.98), restrained 8px radius."
            />

            <Card variant="elevated" className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="navy" onClick={() => showToast('Primary action', 'Navy button clicked', 'success')}>
                  Navy Primary
                </Button>
                <Button variant="secondary" onClick={() => showToast('Secondary action', 'Secondary clicked', 'info')}>
                  Secondary Surface
                </Button>
                <Button variant="outline" onClick={() => showToast('Outline clicked', 'Outline active', 'info')}>
                  Subtle Outline
                </Button>
                <Button variant="ghost" onClick={() => showToast('Ghost clicked', 'Ghost action', 'neutral')}>
                  Ghost Text
                </Button>
                <Button variant="danger" onClick={() => showToast('Danger action', 'Danger clicked', 'error')}>
                  Danger Action
                </Button>
              </div>
            </Card>
          </section>
        </FadeInOnScroll>
      </PageContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Action"
        description="Modal foundation preview"
        footer={
          <Button variant="navy" size="sm" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="text-xs text-dt-secondary">Accessible modal dialog preview with ESC key dismissal.</p>
      </Modal>
    </div>
  );
}
