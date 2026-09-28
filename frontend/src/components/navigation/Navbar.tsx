'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NavItem, StudentProfileFixture } from '@/types/design-system';
import { cn } from '@/lib/utils';
import { Menu, X, GraduationCap, ChevronDown, User, LogOut, Target, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import { authService } from '@/services/authService';

export interface NavbarProps {
  navItems?: NavItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
  user?: StudentProfileFixture;
}

const defaultNavItems: NavItem[] = [
  { label: 'Overview', href: '/overview' },
  { label: 'Skill Gap', href: '/skill-gap' },
  { label: 'Recommendations', href: '/recommendations' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Projects', href: '/projects' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Career Readiness', href: '/readiness' },
];

export function Navbar({
  navItems = defaultNavItems,
  activeHref = '/overview',
  onNavigate,
  user: userProp,
}: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<StudentProfileFixture | null>(userProp || null);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userProp) {
      const current = dashboardService.getCurrentUser();
      if (current) {
        // Wrap state update in queueMicrotask / timeout to satisfy ESLint effect rule if props change dynamically
        Promise.resolve().then(() => {
          setSessionUser({
            fullName: current.fullName || 'Student User',
            email: current.email || 'student@devtrack.edu',
            college: current.college || 'Engineering College',
            branch: current.branch || 'Computer Science',
            yearOfStudy: current.yearOfStudy || 'Undergraduate',
            targetRole: current.targetRole || 'Software Engineer',
          });
        });
      }
    }
  }, [userProp]);

  // Click outside and Escape listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeUser = sessionUser || userProp || {
    fullName: 'Student User',
    email: 'student@devtrack.edu',
    college: 'University',
    branch: 'CS',
    yearOfStudy: 'Senior',
    targetRole: 'Software Developer',
  };

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    } else {
      router.push(href);
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    authService.logout();
    setUserDropdownOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-2.5 z-50 w-full max-w-7xl mx-auto px-3 sm:px-6">
      {/* 21st.dev Animated Floating Glass Navbar Container */}
      <div className="bg-[#FFFFFF]/92 backdrop-blur-xl border border-[#CDD3D8] shadow-lg shadow-black/5 rounded-2xl sm:rounded-full px-3.5 sm:px-5 py-2 flex items-center justify-between transition-all duration-300">
        
        {/* Brand Logo with 21st.dev Animated Badge */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/overview')}
          className="flex items-center gap-2.5 cursor-pointer focus-visible:outline-none rounded-xl p-1 group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#181B1F] flex items-center justify-center text-white shadow-xs border border-[#7C3AED]/30 group-hover:border-[#7C3AED]/70 group-hover:shadow-[0_2px_12px_rgba(124,58,237,0.3)] transition-all">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black text-[#181B1F] leading-tight tracking-tight group-hover:text-[#52788A] transition-colors">
              DevTrack
            </span>
            <span className="text-[9px] font-mono font-extrabold text-[#7A838C] uppercase tracking-wider hidden sm:block">
              Career Readiness Platform
            </span>
          </div>
        </motion.div>

        {/* Desktop 21st.dev Animated Sliding Pill Navigation */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-[#F5F6F7]/90 p-1.5 rounded-full border border-[#CDD3D8]/80 shadow-inner"
          aria-label="Main Navigation"
          onMouseLeave={() => setHoveredHref(null)}
        >
          {navItems.map((item) => {
            const isActive = activeHref === item.href || item.active;
            const isHovered = hoveredHref === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredHref(item.href)}
                onClick={(e) => handleNavClick(item.href, e)}
                className={cn(
                  'relative px-3.5 py-1.5 text-xs font-extrabold rounded-full transition-colors z-10 flex items-center gap-1',
                  isActive
                    ? 'text-white'
                    : 'text-[#59616A] hover:text-[#181B1F]'
                )}
              >
                {/* 21st.dev Spring Animated Active Tab Pill */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-[#181B1F] rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-[#7C3AED]/40 -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {/* 21st.dev Spring Animated Hover Pill */}
                {isHovered && !isActive && (
                  <motion.span
                    layoutId="hoverNavPill"
                    className="absolute inset-0 bg-[#E2E6EA] rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <span>{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "px-1.5 py-0.2 text-[9px] font-mono rounded-full border",
                    isActive ? "bg-white/20 text-white border-white/30" : "bg-[#ECEFF1] text-[#59616A] border-[#CDD3D8]"
                  )}>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* User Profile Fixture Dropdown & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* User Profile Pill */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              aria-expanded={userDropdownOpen}
              aria-haspopup="true"
              className={cn(
                'flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-[#CDD3D8] hover:border-[#7C3AED]/50 bg-[#FFFFFF] hover:bg-[#F4F5F6] transition-all focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-2xs',
                userDropdownOpen && 'bg-[#F4F5F6] border-[#7C3AED]'
              )}
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#181B1F] to-[#3B0764] text-white font-extrabold text-xs flex items-center justify-center border border-[#CDD3D8] shadow-2xs">
                  {activeUser.fullName.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-extrabold text-[#181B1F] leading-none">
                  {activeUser.fullName}
                </span>
                <span className="text-[9px] font-medium text-[#7A838C] leading-tight truncate max-w-[100px] mt-0.5">
                  {activeUser.targetRole}
                </span>
              </div>
              <ChevronDown className={cn('w-3.5 h-3.5 text-[#7A838C] transition-transform duration-200', userDropdownOpen && 'rotate-180 text-[#181B1F]')} />
            </motion.button>

            {/* 21st.dev Animated Profile Menu Modal */}
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2.5 w-72 bg-[#FFFFFF]/95 backdrop-blur-xl border border-[#CDD3D8] rounded-2xl shadow-xl p-3 z-50 space-y-2"
                >
                  {/* User Profile Card */}
                  <div className="p-3 bg-[#F4F5F6] border border-[#CDD3D8] rounded-xl space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#181B1F] text-white font-black text-sm flex items-center justify-center shrink-0 border border-[#7C3AED]/40 shadow-xs">
                        {activeUser.fullName.charAt(0)}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-black text-[#181B1F] truncate">{activeUser.fullName}</p>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-[11px] font-medium text-[#7A838C] truncate">{activeUser.email}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#CDD3D8]/60 space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold bg-[#FFFFFF] text-[#181B1F] rounded-lg border border-[#CDD3D8] w-full truncate">
                        <Target className="w-3 h-3 text-[#7C3AED] shrink-0" />
                        <span className="truncate">{activeUser.college} • {activeUser.branch}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold bg-[#E3F1EA] text-[#1F6B4F] rounded-md border border-[#1F6B4F]/30">
                        <Sparkles className="w-3 h-3 text-[#1F6B4F]" />
                        <span>Target: {activeUser.targetRole}</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Actions */}
                  <div className="space-y-1 pt-1">
                    <motion.button
                      whileHover={{ x: 3, backgroundColor: '#F4F5F6' }}
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        router.push('/dashboard');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-extrabold text-[#181B1F] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-[#7C3AED]" />
                        <span>Student Dashboard</span>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ x: 3, backgroundColor: '#F8E3E2' }}
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-xs font-extrabold text-[#B85C58] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <LogOut className="w-4 h-4 text-[#B85C58]" />
                        <span>Sign Out</span>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2 text-[#181B1F] hover:bg-[#F4F5F6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 21st.dev Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mt-2 border border-[#CDD3D8] bg-[#FFFFFF]/98 backdrop-blur-xl rounded-2xl p-3 space-y-1 shadow-lg overflow-hidden"
          >
            {navItems.map((item) => {
              const isActive = activeHref === item.href || item.active;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={cn(
                    'block px-3.5 py-2 text-xs font-bold rounded-xl transition-all',
                    isActive
                      ? 'bg-[#181B1F] text-white font-extrabold shadow-xs border border-[#7C3AED]/40'
                      : 'text-[#59616A] hover:bg-[#F4F5F6] hover:text-[#181B1F]'
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
