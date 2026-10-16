'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Code2, ArrowLeft, Loader2, AlertCircle, Search } from 'lucide-react';
import DsaTopicSheet, { DsaDifficultyFilter } from '@/components/DsaTopicSheet';
import { Question } from '@/types';
import { prepApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

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

const DIFFICULTY_META: { key: DsaDifficultyFilter; color: string; bar: string }[] = [
  { key: 'Easy', color: 'text-emerald-400', bar: 'bg-emerald-400' },
  { key: 'Medium', color: 'text-amber-400', bar: 'bg-amber-400' },
  { key: 'Hard', color: 'text-rose-400', bar: 'bg-rose-400' },
];

function pct(solved: number, total: number) {
  return total > 0 ? Math.round((solved / total) * 100) : 0;
}

function ProgressRing({ value, solved, total }: { value: number; solved: number; total: number }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
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
        <span className="font-heading font-extrabold text-2xl text-white">{value}%</span>
        <span className="text-[10px] font-mono text-gray-400">
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
  bar,
}: {
  label: string;
  pair: CountPair;
  color: string;
  bar: string;
}) {
  const value = pct(pair.solved, pair.total);
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider">
        <span className={color}>{label}</span>
        <span className="font-mono text-gray-400 normal-case">
          {pair.solved}/{pair.total}
        </span>
      </div>
      <div className="mt-2.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${bar}`} style={{ width: `${value}%` }} />
      </div>
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
    const key = question.difficulty === 'Medium' ? 'medium' : question.difficulty === 'Hard' ? 'hard' : 'easy';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7">
      {/* Back */}
      <Link
        href="/prep"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Prep Hub
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <Code2 className="w-4 h-4" />
          Technical Coding Tracks
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Dedicated DSA Topic Sheet
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          {totals
            ? `${totals.total} problems across ${overview?.sections.length ?? 0} sections, organised by the pattern each one teaches.`
            : 'Curated problem sets categorised by fundamental pattern.'}
        </p>
      </div>

      {loadingOverview ? (
        <div className="glass-panel rounded-2xl p-10 flex items-center justify-center gap-3 text-gray-400 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading the DSA sheet…
        </div>
      ) : error ? (
        <div className="glass-panel rounded-2xl p-10 flex items-center justify-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      ) : !overview || overview.sections.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-sm text-gray-400">
          No DSA sections available yet.
        </div>
      ) : (
        <>
          {/* Overall progress */}
          <section className="glass-panel rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ProgressRing value={overallPct} solved={overview.totals.solved} total={overview.totals.total} />
              <div className="flex-1 w-full">
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="font-heading font-bold text-lg text-white">Overall Progress</h2>
                  <span className="text-xs text-gray-400">
                    {overview.totals.total - overview.totals.solved} remaining
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DIFFICULTY_META.map(({ key, color, bar }) => (
                    <DifficultyCard
                      key={key}
                      label={key}
                      pair={overview.totals[key.toLowerCase() as 'easy' | 'medium' | 'hard']}
                      color={color}
                      bar={bar}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar + content */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
            {/* Section navigation */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="glass-panel rounded-2xl p-3">
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                  {overview.sections.map((section) => {
                    const active = section.id === selectedId;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setSelectedId(section.id)}
                        className={`shrink-0 w-44 lg:w-full text-left rounded-xl px-3 py-2.5 border transition-colors ${
                          active
                            ? 'bg-cyan-600/15 border-cyan-500/40'
                            : 'border-transparent hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-semibold truncate ${
                              active ? 'text-white' : 'text-gray-300'
                            }`}
                          >
                            {section.name}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400 shrink-0">
                            {section.solved}/{section.total}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                            style={{ width: `${pct(section.solved, section.total)}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Selected section */}
            <main className="space-y-5 min-w-0">
              {selectedSection && (
                <div className="glass-panel rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-heading font-extrabold text-2xl text-white">
                        {selectedSection.name}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">
                        Master the core patterns and solve the high-frequency problems in this section.
                      </p>
                      {concepts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {concepts.map((c) => (
                            <span
                              key={c}
                              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Solved
                      </div>
                      <div className="font-heading font-extrabold text-2xl text-white">
                        {selectedSection.solved}
                        <span className="text-gray-500 text-lg">/{selectedSection.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter by problem or pattern…"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          active
                            ? 'bg-cyan-600 text-white border-cyan-500'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {level === 'ALL' ? 'All' : level}
                        {pair && (
                          <span className={`ml-1.5 font-mono ${active ? 'text-cyan-100' : 'text-gray-500'}`}>
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
                <div className="glass-panel rounded-2xl p-10 flex items-center justify-center gap-3 text-gray-400 text-sm">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading problems…
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
