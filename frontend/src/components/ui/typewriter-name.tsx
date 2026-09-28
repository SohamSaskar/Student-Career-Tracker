'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterNameProps {
  text: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBeforeDelete?: number;
  delayBeforeType?: number;
  className?: string;
}

export function TypewriterName({
  text,
  typingSpeed = 150,
  deletingSpeed = 100,
  delayBeforeDelete = 1800,
  delayBeforeType = 400,
  className = '',
}: TypewriterNameProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedText.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delayBeforeDelete);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
        }, delayBeforeType);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, text, typingSpeed, deletingSpeed, delayBeforeDelete, delayBeforeType]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{displayedText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="ml-1 inline-block w-[3px] h-[0.95em] bg-[#581C87] rounded-full align-baseline"
      />
    </span>
  );
}
