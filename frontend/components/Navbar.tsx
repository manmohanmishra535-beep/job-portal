'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Briefcase,
  BookOpen,
  Code2,
  Building2,
  Award,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { buttonClasses } from '@/components/ui';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Prep Hub', href: '/prep', icon: BookOpen },
    { label: 'DSA Sheet', href: '/prep/dsa', icon: Code2 },
    { label: 'Companies', href: '/prep/companies', icon: Building2 },
    { label: 'Quiz', href: '/prep/quiz', icon: Award },
  ];

  const isActive = (path: string) => {
    if (path === '/jobs') return pathname === '/jobs' || pathname.startsWith('/jobs/');
    if (path === '/prep') return pathname === '/prep';
    return pathname.startsWith(path);
  };

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070a12]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#070a12]/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="NexusCareer home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-extrabold tracking-tight text-white">
              Nexus<span className="text-indigo-400">Career</span>
            </span>
            <span className="hidden rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300 lg:inline-block">
              Portal &amp; Prep
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-indigo-500/10 text-white ring-1 ring-inset ring-indigo-500/25'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-indigo-300' : 'text-slate-500')} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth & dashboards */}
        <div className="hidden items-center gap-2 md:flex">
          <SignedIn>
            <Link
              href="/dashboard"
              aria-current={pathname === '/dashboard' ? 'page' : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                pathname === '/dashboard'
                  ? 'bg-indigo-500/10 text-indigo-200 ring-1 ring-inset ring-indigo-500/25'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Candidate
            </Link>
            <Link
              href="/recruiter"
              aria-current={pathname.startsWith('/recruiter') ? 'page' : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith('/recruiter')
                  ? 'bg-indigo-500/10 text-indigo-200 ring-1 ring-inset ring-indigo-500/25'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              )}
            >
              Recruiter
            </Link>
            <div className="ml-1 border-l border-white/10 pl-3">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className={buttonClasses('ghost', 'sm', 'h-9 px-4 text-sm')}>
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className={buttonClasses('primary', 'sm', 'h-9 px-4 text-sm')}>
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="rounded-xl p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white md:hidden"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="animate-fade-in border-t border-white/10 bg-[#070a12]/95 backdrop-blur-xl md:hidden"
        >
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4" aria-label="Mobile">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium transition-colors',
                    active
                      ? 'bg-indigo-500/10 text-indigo-200 ring-1 ring-inset ring-indigo-500/25'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-3 space-y-2 border-t border-white/10 pt-4">
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Candidate Dashboard
                </Link>
                <Link
                  href="/recruiter"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <Briefcase className="h-4 w-4" />
                  Recruiter Portal
                </Link>
                <div className="px-3 pt-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className={buttonClasses('outline', 'md', 'w-full')}>Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className={buttonClasses('primary', 'md', 'w-full')}>Get Started</button>
                </SignUpButton>
              </SignedOut>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
