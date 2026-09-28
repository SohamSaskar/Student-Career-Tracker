'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PrebuiltCardProps {
  title: string;
  description: string;
  category: string;
  date?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  imageSrc?: string;
  href?: string;
  readTime?: string;
  className?: string;
  tags?: string[];
}

/**
 * PrebuiltUI Cards Component (by prebuiltui)
 * Features modern article/blog card layout with image zoom, category pill, 
 * author metadata, tag badges, and smooth interactive hover effects.
 */
export function PrebuiltCard({
  title,
  description,
  category,
  date = 'Sep 26, 2026',
  author = { name: 'DevTrack Engineering' },
  imageSrc = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=640&fit=crop&q=80&auto=format',
  href = '#',
  readTime = '5 min read',
  className,
  tags = [],
}: PrebuiltCardProps) {
  return (
    <div
      className={cn(
        'group flex flex-col bg-[#FFFFFF] border border-[#D8DDE3] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-[#AAB3BB] transition-all duration-300 ease-out cursor-pointer',
        className
      )}
    >
      {/* Top Media Thumbnail Container with Image Zoom */}
      <div className="relative w-full h-48 overflow-hidden bg-[#F4F5F6] border-b border-[#E2E6EA]">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#ECEFF1] text-[#858C94]">
            <Sparkles className="w-8 h-8 opacity-40" />
          </div>
        )}

        {/* Category Pill Tag Overlay */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold tracking-wide uppercase rounded-md bg-[#30343A]/85 backdrop-blur-md text-white shadow-2xs">
            {category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[11px] text-[#858C94] font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#59616A]" />
              {date}
            </span>
            <span>{readTime}</span>
          </div>

          {/* Title with hover color animation */}
          <h3 className="text-base font-extrabold text-[#1F2328] group-hover:text-[#2F6580] transition-colors leading-snug line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#59616A] leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#F4F5F6] text-[#30343A] border border-[#E2E6EA]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Author & Action Link */}
        <div className="pt-3 border-t border-[#E2E6EA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#ECEFF1] border border-[#D8DDE3] flex items-center justify-center text-[#30343A] overflow-hidden text-[10px] font-bold">
              {author.avatar ? (
                <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5 text-[#59616A]" />
              )}
            </div>
            <span className="text-xs font-bold text-[#34383D] truncate max-w-[120px]">
              {author.name}
            </span>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#2F6580] group-hover:text-[#1F2328] transition-colors"
          >
            <span>Explore</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
