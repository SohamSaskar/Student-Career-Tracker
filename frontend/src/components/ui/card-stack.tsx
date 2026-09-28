'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight, FolderGit2, Code2, ExternalLink } from 'lucide-react';

export interface CardStackItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
  status?: string;
  techStack?: string[];
  github?: string;
  linkUrl?: string;
  imageSrc?: string;
  href?: string;
}

export interface CardStackProps {
  items: CardStackItem[];
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
  className?: string;
}

export function CardStack({
  items: initialItems,
  autoAdvance = true,
  autoAdvanceInterval = 4500,
  className,
}: CardStackProps) {
  const [cards, setCards] = useState<CardStackItem[]>(initialItems);
  const [prevItems, setPrevItems] = useState<CardStackItem[]>(initialItems);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  // Sync state if initialItems prop updates without useEffect set-state-in-effect error
  if (initialItems !== prevItems) {
    setPrevItems(initialItems);
    setCards(initialItems);
  }

  const handleNext = useCallback(() => {
    setCards((prevCards) => {
      if (prevCards.length <= 1) return prevCards;
      const newArray = [...prevCards];
      const first = newArray.shift()!;
      newArray.push(first);
      return newArray;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setCards((prevCards) => {
      if (prevCards.length <= 1) return prevCards;
      const newArray = [...prevCards];
      const last = newArray.pop()!;
      newArray.unshift(last);
      return newArray;
    });
  }, []);

  const handleSelectIndex = (targetIndex: number) => {
    if (targetIndex === 0 || targetIndex >= cards.length) return;
    setCards((prevCards) => {
      const newArray = [...prevCards];
      const selected = newArray.splice(targetIndex, 1)[0];
      newArray.unshift(selected);
      return newArray;
    });
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      handlePrev();
    }
  };

  // Optional auto-advance with pause on hover & reduced motion check
  useEffect(() => {
    if (!autoAdvance || isHovered || cards.length <= 1 || shouldReduceMotion) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoAdvanceInterval);

    return () => clearInterval(interval);
  }, [autoAdvance, autoAdvanceInterval, isHovered, cards.length, handleNext, shouldReduceMotion]);

  if (!cards || cards.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-[#767F8A] rounded-xl bg-[#FFFFFF]">
        <FolderGit2 className="w-8 h-8 text-[#5A636D] mx-auto mb-2 opacity-60" />
        <p className="text-xs font-semibold text-[#1F2328]">No projects added yet.</p>
        <Link href="/projects" className="text-[12px] font-bold text-[#2F6580] hover:underline mt-1 inline-block">
          Add your first project to view it in the card stack →
        </Link>
      </div>
    );
  }

  const OFFSET = 14;
  const SCALE_FACTOR = 0.05;

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative w-full flex flex-col items-center justify-between p-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F3740]',
        className
      )}
      aria-label="Moving Projects Card Stack"
    >
      {/* Moving Cards Area */}
      <div className="relative w-full h-[240px] flex items-center justify-center">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isFront = index === 0;

            return (
              <motion.div
                key={card.id}
                onClick={() => handleSelectIndex(index)}
                className={cn(
                  'absolute w-full p-4 rounded-xl border bg-[#FFFFFF] transition-colors select-none cursor-pointer shadow-xs overflow-hidden',
                  isFront
                    ? 'border-[#767F8A] hover:border-[#57606A]'
                    : 'border-[#CDD3D8] opacity-95 hover:border-[#767F8A]'
                )}
                style={{
                  transformOrigin: 'top center',
                }}
                animate={{
                  top: index * -OFFSET,
                  scale: shouldReduceMotion ? 1 : 1 - index * SCALE_FACTOR,
                  zIndex: cards.length - index,
                  opacity: index > 2 ? 0 : 1 - index * 0.12,
                  rotate: shouldReduceMotion ? 0 : (index % 2 === 0 ? 1 : -1) * index * 2,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0.1 : 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="flex gap-3">
                  {/* Optional Project Screenshot Thumbnail */}
                  {card.imageSrc && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[#CDD3D8] hidden sm:block bg-[#ECEFF1]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.imageSrc}
                        alt={`Screenshot preview for ${card.title}`}
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {/* Card Top Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-[#CDD3D8] pb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderGit2 className="w-4 h-4 text-[#1F2328] shrink-0" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1F2328] leading-tight truncate">
                            {card.title}
                          </h4>
                          {card.category && (
                            <p className="text-[11px] font-medium text-[#5A636D] mt-0.5">{card.category}</p>
                          )}
                        </div>
                      </div>

                      {card.status && (
                        <Badge
                          variant={
                            card.status === 'Completed'
                              ? 'success'
                              : card.status === 'In Progress' || card.status === 'Learning'
                              ? 'warning'
                              : 'danger'
                          }
                          className="text-[10px] shrink-0"
                        >
                          {card.status === 'Not Started' ? 'Missing Gap' : card.status}
                        </Badge>
                      )}
                    </div>

                    {/* Card Description */}
                    {card.description && (
                      <p className="text-xs text-[#3F464E] leading-snug mt-2 line-clamp-2">
                        {card.description}
                      </p>
                    )}

                    {/* Tech Stack List */}
                    {card.techStack && card.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {card.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.2 text-[10px] font-mono bg-[#ECEFF1] text-[#1F2328] rounded border border-[#CDD3D8]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-3 pt-2 border-t border-[#CDD3D8] flex items-center justify-between text-[11px] font-mono text-[#5A636D]">
                  <div className="flex items-center gap-1 min-w-0">
                    <Code2 className="w-3.5 h-3.5 text-[#1F2328] shrink-0" />
                    <span className="truncate">{card.github || 'DevTrack Verified Vault Project'}</span>
                  </div>
                  <Link
                    href={card.href || '/projects'}
                    className="text-[#2F6580] hover:underline flex items-center gap-0.5 font-bold shrink-0 ml-2"
                  >
                    <span>View Project</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls & Progress Indicator Dots */}
      <div className="flex items-center justify-between w-full mt-4 pt-2 border-t border-[#CDD3D8] text-xs">
        <div className="flex items-center gap-1.5">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleSelectIndex(idx)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all duration-200 cursor-pointer',
                idx === 0 ? 'bg-[#1F2328] w-6' : 'bg-[#CDD3D8] hover:bg-[#767F8A]'
              )}
              aria-label={`Jump to project slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 rounded-md border border-[#767F8A] bg-[#FFFFFF] text-[#1F2328] hover:bg-[#ECEFF1] hover:border-[#57606A] transition-colors cursor-pointer"
            aria-label="Previous Project"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-1 rounded-md border border-[#767F8A] bg-[#FFFFFF] text-[#1F2328] hover:bg-[#ECEFF1] hover:border-[#57606A] transition-colors cursor-pointer"
            aria-label="Next Project"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
