'use client';

import React from 'react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { Badge } from '@/components/ui/Badge';
import { FadeInOnScroll } from '@/components/motion/FadeInOnScroll';
import { CheckCircle2, Clock, CircleDashed } from 'lucide-react';

export function RoadmapSection() {
  const stages = [
    {
      stage: 'Completed Phase',
      badgeVariant: 'success' as const,
      icon: <CheckCircle2 className="w-4 h-4 text-[#123D2C]" />,
      items: [
        { title: 'Java 21 Fundamentals & OOP', detail: 'Classes, Collections, Exceptions, Interfaces' },
        { title: 'MySQL 8.0 Schema Design', detail: 'Primary Keys, Indexes, Views, Stored Procedures' },
      ],
    },
    {
      stage: 'In Progress Phase',
      badgeVariant: 'warning' as const,
      icon: <Clock className="w-4 h-4 text-[#9A5B0A]" />,
      items: [
        { title: 'Spring Boot & REST Controllers', detail: 'Spring Initializr, Controllers, Repositories, Services' },
        { title: 'RESTful API Endpoint Design', detail: 'HTTP Verbs, JSON payloads, Response Status Codes' },
      ],
    },
    {
      stage: 'Next Up Phase',
      badgeVariant: 'neutral' as const,
      icon: <CircleDashed className="w-4 h-4 text-[#626971]" />,
      items: [
        { title: 'JUnit 5 & Mockito Unit Testing', detail: 'Automated service tests, DAO mocks, Assertion suites' },
        { title: 'Docker Containerization', detail: 'Dockerfile compilation, container networking, environment configs' },
      ],
    },
  ];

  return (
    <section className="py-16 bg-[#EAEDF1]/40 border-y border-[#D8DDE3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Visual Roadmap UI */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <FadeInOnScroll durationMs={500}>
              <CardSpotlight className="p-5 sm:p-6 border border-[#D8DDE3] space-y-5 bg-[#FFFFFF] shadow-xs hover:border-[#C8CED5]">
                <div className="flex items-center justify-between border-b border-[#D8DDE3] pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-[#34383D] uppercase tracking-wide">Learning Roadmap</h3>
                    <p className="text-xs text-[#858C94] mt-0.5">Sequential path based on role priorities</p>
                  </div>
                </div>

                {/* Vertical Stage Sequence */}
                <div className="space-y-5 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D8DDE3]">
                  {stages.map((stg) => (
                    <div key={stg.stage} className="relative pl-9 space-y-2">
                      {/* Timeline Node */}
                      <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-[#FFFFFF] border-2 border-[#34383D] flex items-center justify-center -translate-x-1/2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34383D]" />
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-[#34383D]">{stg.stage}</span>
                        <Badge variant={stg.badgeVariant} size="sm">{stg.items.length} Skills</Badge>
                      </div>

                      <div className="divide-y divide-[#E2E6EA] border border-[#E2E6EA] rounded-lg overflow-hidden bg-[#F8F9FA]">
                        {stg.items.map((item) => (
                          <div key={item.title} className="p-3 flex items-start justify-between gap-3 hover:bg-[#F1F3F5] transition-colors">
                            <div>
                              <p className="text-xs font-bold text-[#34383D] flex items-center gap-1.5">
                                {stg.icon}
                                {item.title}
                              </p>
                              <p className="text-[11px] text-[#626971] leading-snug mt-0.5">{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardSpotlight>
            </FadeInOnScroll>
          </div>

          {/* Right Editorial Copy */}
          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2 pt-2">
            <FadeInOnScroll durationMs={400}>
              <span className="font-mono text-xs font-bold text-[#858C94] uppercase tracking-wider block mb-1">
                02 / STRUCTURED ROADMAP
              </span>
              <h2 className="text-3xl sm:text-[36px] md:text-[42px] font-extrabold text-[#34383D] tracking-[-0.025em] leading-[1.08]">
                Turn missing skills into a learning path.
              </h2>
              <p className="text-sm sm:text-base font-normal text-[#626971] leading-[1.6] pt-1">
                Learning is most effective when sequenced logically. DevTrack organizes missing skills into a structured vertical roadmap divided into Completed, In Progress, and Next Up phases.
              </p>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

