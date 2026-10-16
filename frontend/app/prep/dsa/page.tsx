'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Code2, ArrowLeft, AlertCircle, Search } from 'lucide-react';
import DsaTopicSheet, { DsaDifficultyFilter } from '@/components/DsaTopicSheet';
import { Question } from '@/types';
import { prepApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import ProgressBar, { ProgressTone } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Field';

interface CountPair {
  total: number;
  solved: number;
}

interface SheetSection {
  id: string;
  name: string;
  total: number;
  solved: number;
  easy: CountPair;
  medium: CountPair;
  hard: CountPair;
}

interface DsaOverview {
  totals: { total: number; solved: number; easy: CountPair; medium: CountPair; hard: CountPair };
  sections: SheetSection[];
}

const DIFFICULTY_META: {
  key: DsaDifficultyFilter;
  color: string;
  tone: ProgressTone;
}[] = [
  { key: 'Easy', color: 'text-emerald-300', tone: 'emerald' },
  { key: 'Medium', color: 'text-amber-300', tone: 'amber' },
  { key: 'Hard', color: 'text-rose-300', tone: 'rose' },
];

function pct(solved: number, total: number) {
  return total > 0 ? Math.round((solved / total) * 100) : 0;
}

function ProgressRing({ value, solved, total }: { value: number; solved: number; total: number }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="-rotate-90 h-28 w-28">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-white/10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-cyan-400 transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-2xl font-extrabold text-white">{value}%</span>
        <span className="font-mono text-[10px] text-slate-400">
          {solved}/{total}
        </span>
      </div>
    </div>
  );
}

function DifficultyCard({
  label,
  pair,
  color,
  tone,
}: {
  label: string;
  pair: CountPair;
  color: string;
  tone: ProgressTone;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider">
        <span className={color}>{label}</span>
        <span className="font-mono text-slate-400 normal-case">
          {pair.solved}/{pair.total}
        </span>
      </div>
      <ProgressBar
        value={pair.solved}
        max={pair.total}
        tone={tone}
        className="mt-2.5"
        label={`${label} progress`}
      />
    </div>
  );
}

export default function DsaPage() {
  const { getToken, isLoaded } = useAuth();

  const [overview, setOverview] = useState<DsaOverview | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<DsaDifficultyFilter>('ALL');
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSection = useMemo(
    () => overview?.sections.find((s) => s.id === selectedId) || null,
    [overview, selectedId]
  );

  // Load aggregate progress + the section list once auth resolves.
  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;

    (async () => {
      try {
        setLoadingOverview(true);
        setError(null);
        const token = await getToken();
        const res = await prepApi.getDsaOverview(token);
        const data: DsaOverview | null = res.data || null;
        if (cancelled) return;
        setOverview(data);
        setSelectedId(data?.sections[0]?.id ?? null);
      } catch {
        if (!cancelled) setError('Could not load the DSA sheet. Please retry.');
      } finally {
        if (!cancelled) setLoadingOverview(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Load problems + concept list for the selected section.
  useEffect(() => {
    if (!isLoaded || !selectedId) return;
    let cancelled = false;

    (async () => {
      try {
        setLoadingQuestions(true);
        const token = await getToken();
        const [questionsRes, notesRes] = await Promise.all([
          prepApi.getTopicQuestions(selectedId, { limit: 500 }, token),
          prepApi.getTopicNotes(selectedId, token).catch(() => null),
        ]);
        if (cancelled) return;

        setQuestions(questionsRes.data?.questions || []);

        const conceptNote = (notesRes?.data || []).find(
          (n: { title: string }) => n.title === 'Concepts Covered'
        );
        setConcepts(
          conceptNote
            ? conceptNote.content
                .split('\n')
                .map((line: string) => line.replace(/^-\s*/, '').trim())
                .filter(Boolean)
            : []
        );
      } catch {
        if (!cancelled) {
          setQuestions([]);
          setConcepts([]);
        }
      } finally {
        if (!cancelled) setLoadingQuestions(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, isLoaded]);

  // Keep the sidebar + header stats in sync with optimistic solve toggles.
  const applySolvedDelta = (question: Question, nextStatus: 'SOLVED' | 'NOT_STARTED') => {
    const delta = nextStatus === 'SOLVED' ? 1 : -1;
    const key =
      question.difficulty === 'Medium' ? 'medium' : question.difficulty === 'Hard' ? 'hard' : 'easy';

    setOverview((prev) => {
      if (!prev) return prev;
      const totals = {
        ...prev.totals,
        solved: prev.totals.solved + delta,
        easy: { ...prev.totals.easy },
        medium: { ...prev.totals.medium },
        hard: { ...prev.totals.hard },
      };
      totals[key].solved += delta;

      const sections = prev.sections.map((s) => ({
        ...s,
        easy: { ...s.easy },
        medium: { ...s.medium },
        hard: { ...s.hard },
      }));
      const section = sections.find((s) => s.id === question.topicId);
      if (section) {
        section.solved += delta;
        section[key].solved += delta;
      }

      return { totals, sections };
    });
  };

  const totals = overview?.totals;
  const overallPct = totals ? pct(totals.solved, totals.total) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-4 py-10 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        href="/prep"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Prep Hub
      </Link>

      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
          <Code2 className="h-4 w-4" />
          Technical Coding Tracks
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          Dedicated DSA Topic Sheet
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          {totals
            ? `${totals.total} problems across ${overview?.sections.length ?? 0} sections, organised by the pattern each one teaches.`
            : 'Curated problem sets categorised by fundamental pattern.'}
        </p>
      </div>

      {loadingOverview ? (
        <div className="space-y-7">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <Skeleton className="h-28 w-28 shrink-0 rounded-full" />
              <div className="w-full flex-1 space-y-3">
                <Skeleton className="h-5 w-40" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Skeleton className="h-[74px] rounded-xl" />
                  <Skeleton className="h-[74px] rounded-xl" />
                  <Skeleton className="h-[74px] rounded-xl" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <Skeleton className="h-72 rounded-2xl" />
            <div className="space-y-5">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-80 rounded-2xl" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="glass-panel flex flex-col items-center justify-center gap-3 rounded-2xl p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/10 text-rose-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-white">Something went wrong</p>
          <p className="max-w-sm text-xs text-slate-400">{error}</p>
        </div>
      ) : !overview || overview.sections.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-sm text-slate-400">
          No DSA sections available yet.
        </div>
      ) : (
        <>
          {/* Overall progress */}
          <section className="glass-panel rounded-2xl p-6">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <ProgressRing
                value={overallPct}
                solved={overview.totals.solved}
                total={overview.totals.total}
              />
              <div className="w-full flex-1">
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="font-heading text-lg font-bold text-white">Overall Progress</h2>
                  <span className="text-xs text-slate-400">
                    {overview.totals.total - overview.totals.solved} remaining
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {DIFFICULTY_META.map(({ key, color, tone }) => (
                    <DifficultyCard
                      key={key}
                      label={key}
                      pair={overview.totals[key.toLowerCase() as 'easy' | 'medium' | 'hard']}
                      color={color}
                      tone={tone}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar + content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Section navigation */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="glass-panel rounded-2xl p-3">
                <div
                  role="tablist"
                  aria-label="DSA sections"
                  className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
                >
                  {overview.sections.map((section) => {
                    const active = section.id === selectedId;
                    return (
                      <button
                        key={section.id}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setSelectedId(section.id)}
                        className={cn(
                          'w-44 shrink-0 rounded-xl border px-3 py-2.5 text-left transition-colors lg:w-full',
                          active
                            ? 'border-cyan-500/40 bg-cyan-600/15'
                            : 'border-transparent hover:bg-white/5'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              'truncate text-xs font-semibold',
                              active ? 'text-white' : 'text-slate-300'
                            )}
                          >
                            {section.name}
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-slate-400">
                            {section.solved}/{section.total}
                          </span>
                        </div>
                        <ProgressBar
                          value={section.solved}
                          max={section.total}
                          tone="cyan"
                          size="sm"
                          className="mt-1.5"
                          label={`${section.name} progress`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Selected section */}
            <main className="min-w-0 space-y-5">
              {selectedSection && (
                <div className="glass-panel rounded-2xl p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <h2 className="font-heading text-2xl font-extrabold text-white">
                        {selectedSection.name}
                      </h2>
                      <p className="mt-1 text-xs text-slate-400">
                        Master the core patterns and solve the high-frequency problems in this
                        section.
                      </p>
                      {concepts.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {concepts.map((c) => (
                            <Badge key={c}>{c}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Solved
                      </div>
                      <div className="font-heading text-2xl font-extrabold text-white">
                        {selectedSection.solved}
                        <span className="text-lg text-slate-500">/{selectedSection.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter by problem or pattern…"
                    aria-label="Filter problems"
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {(['ALL', 'Easy', 'Medium', 'Hard'] as DsaDifficultyFilter[]).map((level) => {
                    const active = difficulty === level;
                    const pair = !selectedSection
                      ? null
                      : level === 'ALL'
                      ? { solved: selectedSection.solved, total: selectedSection.total }
                      : selectedSection[level.toLowerCase() as 'easy' | 'medium' | 'hard'];
                    return (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        aria-pressed={active}
                        className={cn(
                          'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                          active
                            ? 'border-cyan-500 bg-cyan-600 text-white'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                        )}
                      >
                        {level === 'ALL' ? 'All' : level}
                        {pair && (
                          <span
                            className={cn(
                              'ml-1.5 font-mono',
                              active ? 'text-cyan-100' : 'text-slate-500'
                            )}
                          >
                            {pair.total}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problems */}
              {loadingQuestions ? (
                <div className="glass-panel space-y-3 rounded-2xl p-5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-11 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <DsaTopicSheet
                  key={selectedSection?.id}
                  questions={questions}
                  searchQuery={search}
                  difficultyFilter={difficulty}
                  onSolvedChange={applySolvedDelta}
                />
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
