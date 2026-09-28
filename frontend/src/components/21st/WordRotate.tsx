'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedGradientText } from './AnimatedGradientText';

export interface WordRotateProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function WordRotate({
  words,
  duration = 3000,
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span className="inline-block overflow-hidden py-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={cn('inline-block font-black', className)}
        >
          <AnimatedGradientText
            gradient="from-[#000000] via-[#3B0764] via-[#581C87] to-[#2E1065]"
            glow={true}
            speed={3}
          >
            {words[index]}
          </AnimatedGradientText>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

