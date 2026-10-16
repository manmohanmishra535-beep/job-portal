'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, ArrowLeft, Search, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Field';

const COMPANIES = [
  {
    slug: 'google',
    name: 'Google',
    tier: 'Product (MAMAA)',
    compensation: '₹25 LPA - ₹42 LPA',
    examPlatform: 'HackerEarth / Google Internal',
    roundsCount: '4-5 Rounds',
    focus: 'Dynamic Programming, Graph algorithms, Distributed Systems, Googleyness',
  },
  {
    slug: 'amazon',
    name: 'Amazon',
    tier: 'Product (MAMAA)',
    compensation: '₹22 LPA - ₹35 LPA',
    examPlatform: 'HackerRank',
    roundsCount: '4 Rounds',
    focus: '16 Leadership Principles, Tree/Graph DFS, System Design, Bar Raiser',
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    tier: 'Product (Tier 1)',
    compensation: '₹20 LPA - ₹32 LPA',
    examPlatform: 'Codility',
    roundsCount: '4 Rounds',
    focus: 'Arrays, Strings, Linked Lists, Cloud fundamentals, Clean Code',
  },
  {
    slug: 'tcs',
    name: 'TCS (Digital & Prime)',
    tier: 'Service / Enterprise',
    compensation: '₹7 LPA - ₹9 LPA (Prime)',
    examPlatform: 'TCS iON',
    roundsCount: '3 Rounds',
    focus: 'Advanced Quantitative Aptitude, Verbal Ability, Hands-on Coding (DSA)',
  },
  {
    slug: 'infosys',
    name: 'Infosys (SP & DSE)',
    tier: 'Service / Enterprise',
    compensation: '₹6.5 LPA - ₹9.5 LPA (SP)',
    examPlatform: 'Infosys Springboard',
    roundsCount: '3 Rounds',
    focus: 'Complex Dynamic Programming, Greedy approaches, Technical Interview',
  },
  {
    slug: 'accenture',
    name: 'Accenture',
    tier: 'Consulting / Tech',
    compensation: '₹4.5 LPA - ₹6.5 LPA',
    examPlatform: 'CoCubes',
    roundsCount: '3 Rounds',
    focus: 'Cognitive & Technical Assessment, Pseudo-Code, Communication Test',
  },
];

type TierGroup = 'All' | 'Product' | 'Service' | 'Consulting';

const TIER_FILTERS: TierGroup[] = ['All', 'Product', 'Service', 'Consulting'];

function tierGroup(tier: string): Exclude<TierGroup, 'All'> {
  if (tier.includes('Product')) return 'Product';
  if (tier.includes('Service')) return 'Service';
  return 'Consulting';
}

export default function CompaniesPage() {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<TierGroup>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMPANIES.filter((comp) => {
      const matchesTier = tier === 'All' || tierGroup(comp.tier) === tier;
      const matchesQuery =
        !q ||
        comp.name.toLowerCase().includes(q) ||
        comp.focus.toLowerCase().includes(q) ||
        comp.examPlatform.toLowerCase().includes(q);
      return matchesTier && matchesQuery;
    });
  }, [query, tier]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/prep"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Prep Hub
      </Link>

      {/* Header */}
      <header>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Building2 className="h-4 w-4" />
          Company-Specific Blueprints
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          Company Hiring Processes &amp; Syllabi
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Detailed exam blueprints, eligibility criteria, assessment platforms, round timelines, and
          frequent coding problems for top tech recruiters.
        </p>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, platform or focus area..."
            aria-label="Search companies"
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {TIER_FILTERS.map((option) => {
            const active = tier === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setTier(option)}
                aria-pressed={active}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200',
                  active
                    ? 'border-amber-500/60 bg-amber-500/20 text-amber-200'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No companies match your filters"
          description="Try a different search term or switch the tier filter back to All."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((comp) => (
            <Link
              key={comp.slug}
              href={`/prep/companies/${comp.slug}`}
              className="glass-panel group flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_28px_60px_-36px_rgba(245,158,11,0.7)] sm:p-7"
            >
              <div>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 font-heading text-xl font-extrabold text-amber-300 transition-transform duration-200 group-hover:scale-105">
                    {comp.name.charAt(0)}
                  </div>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    {comp.tier}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-white transition-colors group-hover:text-amber-300">
                  {comp.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-emerald-400">
                  Typical CTC: {comp.compensation}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">Assessment Platform</span>
                    <span className="truncate font-medium text-white">{comp.examPlatform}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">Selection Rounds</span>
                    <span className="font-medium text-white">{comp.roundsCount}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/5 bg-white/5 p-3 text-[11px] leading-relaxed text-slate-300">
                  <strong className="mb-0.5 block text-amber-300">Primary Focus:</strong>
                  {comp.focus}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                <span className="text-slate-400">View Full Syllabus</span>
                <span className="flex items-center gap-1 font-semibold text-amber-300 transition-transform duration-200 group-hover:translate-x-1">
                  Read Guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
