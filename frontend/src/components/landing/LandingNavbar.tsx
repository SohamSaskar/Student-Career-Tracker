'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface LandingNavbarProps {
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
}

export function LandingNavbar({ onLoginClick, onGetStartedClick }: LandingNavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('product');

  const navLinks = [
    { label: 'Product', href: '#product', id: 'product' },
    { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { label: 'Features', href: '#features', id: 'features' },
  ];

  const handleNavClick = (id: string, href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push('/login');
    }
  };

  const handleGetStarted = () => {
    if (onGetStartedClick) {
      onGetStartedClick();
    } else {
      router.push('/signup');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#D8DDE3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34383D] rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-[#34383D] flex items-center justify-center text-white shadow-xs group-hover:bg-[#24282D] transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-[#34383D] leading-tight tracking-[-0.02em]">
                DEVTRACK
              </span>
              <span className="text-[10px] font-mono font-semibold text-[#858C94] uppercase tracking-[0.08em]">
                Career Readiness
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 h-full" aria-label="Landing Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.id, link.href, e)}
                  className={cn(
                    'relative h-full flex items-center px-4 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34383D] rounded-md',
                    isActive ? 'text-[#34383D] font-bold' : 'text-[#626971] hover:text-[#34383D] hover:bg-[#F1F3F5]'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#34383D] rounded-t-sm" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogin}
            >
              Log in
            </Button>
            <Button
              variant="navy"
              size="sm"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="sm:hidden p-2 text-[#34383D] hover:bg-[#F1F3F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34383D]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#D8DDE3] bg-[#FFFFFF] px-4 pt-3 pb-5 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleNavClick(link.id, link.href, e)}
              className="block px-3 py-2 text-sm font-medium text-[#34383D] hover:bg-[#F1F3F5] rounded-lg"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[#D8DDE3] flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={handleLogin} className="w-full">
              Log in
            </Button>
            <Button variant="navy" size="sm" onClick={handleGetStarted} className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
