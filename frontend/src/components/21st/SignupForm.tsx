'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { useToast } from '@/components/toast/ToastProvider';
import { authService } from '@/services/authService';
import { AlertCircle, User, Mail, ArrowRight, Loader2, Code2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SignupForm() {
  const router = useRouter();
  const { showToast } = useToast();

  const fullNameRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync state if browser auto-fills on mount
  React.useEffect(() => {
    const syncAutofill = () => {
      if (fullNameRef.current?.value && !fullName) setFullName(fullNameRef.current.value);
      if (usernameRef.current?.value && !username) setUsername(usernameRef.current.value);
      if (emailRef.current?.value && !email) setEmail(emailRef.current.value);
      if (passwordRef.current?.value && !password) setPassword(passwordRef.current.value);
      if (confirmPasswordRef.current?.value && !confirmPassword) setConfirmPassword(confirmPasswordRef.current.value);
    };
    const timer = setTimeout(syncAutofill, 200);
    return () => clearTimeout(timer);
  }, [fullName, username, email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFullNameError('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setFormError('');
    setFormSuccess('');

    const effectiveFullName = (fullName || fullNameRef.current?.value || '').trim();
    const effectiveUsername = (username || usernameRef.current?.value || '').trim();
    const effectiveEmail = (email || emailRef.current?.value || '').trim();
    const effectivePassword = password || passwordRef.current?.value || '';
    const effectiveConfirmPassword = confirmPassword || confirmPasswordRef.current?.value || '';

    let hasError = false;

    if (!effectiveFullName) {
      setFullNameError('Full name is required.');
      hasError = true;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!effectiveUsername) {
      setUsernameError('Username is required.');
      hasError = true;
    } else if (!usernameRegex.test(effectiveUsername)) {
      setUsernameError('Username can contain letters, numbers and underscores.');
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!effectiveEmail) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!emailRegex.test(effectiveEmail)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    if (!effectivePassword) {
      setPasswordError('Password is required.');
      hasError = true;
    } else if (effectivePassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      hasError = true;
    }

    if (!effectiveConfirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      hasError = true;
    } else if (effectivePassword !== effectiveConfirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await authService.signup({
        fullName: effectiveFullName,
        username: effectiveUsername,
        email: effectiveEmail,
        password: effectivePassword,
      });

      if (response.success && response.user) {
        setFormSuccess(response.message);
        showToast('Account Created', response.message, 'success');
        setTimeout(() => {
          router.push('/onboarding');
        }, 800);
      } else {
        if (response.message.includes('Username')) {
          setUsernameError(response.message);
        } else if (response.message.includes('Email')) {
          setEmailError(response.message);
        } else {
          setFormError(response.message);
        }
        showToast('Registration Failed', response.message, 'error');
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
          Create your account
        </h1>
        <p className="text-xs text-[#626971] font-medium">
          Join DevTrack to start tracking your career readiness and skill roadmaps.
        </p>
      </div>

      {/* Success Banner */}
      {formSuccess && (
        <div className="p-3 bg-[#DDEBE4] border border-[#B8D7C8] rounded-xl text-xs font-semibold text-[#123D2C] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#123D2C]" />
          <span>{formSuccess}</span>
        </div>
      )}

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
            id="fullName"
            ref={fullNameRef}
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={fullNameError}
            autoComplete="name"
            leftIcon={<User className="w-4 h-4 text-[#858C94]" />}
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            id="username"
            ref={usernameRef}
            label="Username"
            placeholder="e.g. alexmorgan"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            autoComplete="username"
            leftIcon={<User className="w-4 h-4 text-[#858C94]" />}
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            id="email"
            ref={emailRef}
            type="email"
            label="Email Address"
            placeholder="e.g. alex.m@sanjivani.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            autoComplete="email"
            leftIcon={<Mail className="w-4 h-4 text-[#858C94]" />}
            disabled={isLoading}
          />
        </div>

        <div>
          <PasswordInput
            id="password"
            ref={passwordRef}
            label="Password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>

        <div>
          <PasswordInput
            id="confirmPassword"
            ref={confirmPasswordRef}
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPasswordError}
            autoComplete="new-password"
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
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Create Account
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </ShimmerButton>
      </form>

      {/* Footer Link */}
      <div className="pt-2 text-center text-xs text-[#626971]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-bold text-[#34383D] hover:underline focus:outline-none focus:ring-2 focus:ring-[#34383D] rounded-sm"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
