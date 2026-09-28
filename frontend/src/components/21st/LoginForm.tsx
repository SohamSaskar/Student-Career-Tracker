'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { useToast } from '@/components/toast/ToastProvider';
import { authService } from '@/services/authService';
import { onboardingService } from '@/services/onboardingService';
import { AlertCircle, User, ArrowRight, Loader2, Code2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();

  const usernameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync state if browser auto-fills on mount/focus
  React.useEffect(() => {
    const syncAutofill = () => {
      if (usernameRef.current?.value && !username) {
        setUsername(usernameRef.current.value);
      }
      if (passwordRef.current?.value && !password) {
        setPassword(passwordRef.current.value);
      }
    };
    const timer = setTimeout(syncAutofill, 200);
    return () => clearTimeout(timer);
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUsernameError('');
    setPasswordError('');
    setFormError('');

    // Fallback to DOM input values if browser autofilled without firing onChange
    const effectiveUsername = (username || usernameRef.current?.value || '').trim();
    const effectivePassword = password || passwordRef.current?.value || '';

    let hasError = false;

    if (!effectiveUsername) {
      setUsernameError('Username or email is required.');
      hasError = true;
    }

    if (!effectivePassword) {
      setPasswordError('Password is required.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await authService.login({
        username: effectiveUsername,
        password: effectivePassword,
      });

      if (response.success && response.user) {
        showToast('Authentication Successful', response.message, 'success');
        const hasCompletedOnboarding = onboardingService.hasCompletedOnboarding();
        setTimeout(() => {
          router.push(hasCompletedOnboarding ? '/overview' : '/onboarding');
        }, 600);
      } else {
        setFormError(response.message || 'Username or password is incorrect.');
        showToast('Login Failed', response.message, 'error');
      }
    } catch {
      setFormError('Unable to connect to authentication server. Please try again.');
      showToast('Network Error', 'Unable to reach server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#34383D] text-white mb-2 shadow-xs">
          <Code2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#34383D] tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs text-[#626971] font-medium">
          Enter your credentials to continue building your career path.
        </p>
      </div>

      {/* Error Banner */}
      {formError && (
        <div className="p-3 bg-[#F3DDDB] border border-[#E8BAB5] rounded-xl text-xs font-semibold text-[#B3261E] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#B3261E]" />
          <span>{formError}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            id="username"
            ref={usernameRef}
            label="Username or Email"
            placeholder="e.g. alexmorgan or alex.m@sanjivani.edu"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            autoComplete="username"
            leftIcon={<User className="w-4 h-4 text-[#858C94]" />}
            disabled={isLoading}
          />
        </div>

        <div>
          <PasswordInput
            id="password"
            ref={passwordRef}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        <ShimmerButton
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 font-bold bg-[#34383D] text-white hover:bg-[#24282D] h-11 rounded-xl shadow-xs tactile-press"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Log In
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </ShimmerButton>
      </form>

      {/* Footer Link */}
      <div className="pt-2 text-center text-xs text-[#626971]">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-bold text-[#34383D] hover:underline focus:outline-none focus:ring-2 focus:ring-[#34383D] rounded-sm"
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
