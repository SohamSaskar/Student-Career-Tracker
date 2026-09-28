'use client';

import React from 'react';
import { MotionFooter } from '@/components/21st/MotionFooter';

export interface LandingFooterProps {
  onPrivacyClick: () => void;
  onLoginClick: () => void;
  onGetStartedClick: () => void;
}

export function LandingFooter({ onPrivacyClick, onLoginClick, onGetStartedClick }: LandingFooterProps) {
  return (
    <MotionFooter
      onPrivacyClick={onPrivacyClick}
      onLoginClick={onLoginClick}
      onGetStartedClick={onGetStartedClick}
    />
  );
}
