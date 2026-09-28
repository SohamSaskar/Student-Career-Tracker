'use client';

import React from 'react';
import { ElegantDarkPattern } from '@/components/ui/elegant-dark-pattern';
import { AuthCard } from '@/components/21st/AuthCard';
import { LoginForm } from '@/components/21st/LoginForm';

export default function LoginPage() {
  return (
    <ElegantDarkPattern>
      <main className="w-full max-w-md py-8 relative z-10 px-4">
        <AuthCard className="p-6 sm:p-8 bg-white/95 backdrop-blur-lg border border-slate-200/80 shadow-2xl">
          <LoginForm />
        </AuthCard>
      </main>
    </ElegantDarkPattern>
  );
}

