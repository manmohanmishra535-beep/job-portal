'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Code,
  Lightbulb,
  SearchX,
} from 'lucide-react';
import { Question } from '@/types';
import { progressApi, prepApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import Badge, { difficultyTone } from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';

export type DsaDifficultyFilter = 'ALL' | 'Easy' | 'Medium' | 'Hard';

interface DsaTopicSheetProps {
  questions: Question[];
  searchQuery?: string;
  difficultyFilter?: DsaDifficultyFilter;
  onSolvedChange?: (question: Question, nextStatus: 'SOLVED' | 'NOT_STARTED') => void;
}

const LANGUAGES = ['python', 'cpp', 'java', 'javascript'];

export default function DsaTopicSheet({
  questions: initialQuestions,
  searchQuery = '',
  difficultyFilter = 'ALL',
  onSolvedChange,
}: DsaTopicSheetProps) {
  const { getToken, isSignedIn } = useAuth();
  const [questions, setQuestions] = useState(initialQuestions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<Record<string, string>>({});

  // Stable curriculum numbering, unaffected by filtering.
  const positionById = useMemo(() => {
    const map = new Map<string, number>();
    questions.forEach((q, i) => map.set(q.id, i + 1));
    return map;
  }, [questions]);

  const query = searchQuery.trim().toLowerCase();
  const visible = questions.filter((q) => {
    const matchesDifficulty = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchesQuery =
      !query ||
      q.title.toLowerCase().includes(query) ||
      (q.pattern || '').toLowerCase().includes(query);
    return matchesDifficulty && matchesQuery;
  });

  const handleToggleSolve = async (questionId: string) => {
    if (!isSignedIn) {
      alert('Sign in to track your DSA solve progress!');
      return;
    }

    const current = questions.find((q) => q.id === questionId);
    const nextStatus = current?.progressStatus === 'SOLVED' ? 'NOT_STARTED' : 'SOLVED';

    // Optimistic UI update
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, progressStatus: nextStatus } : q))
    );
    if (current) onSolvedChange?.(current, nextStatus);

    try {
      const token = await getToken();
      if (token) {
        await progressApi.updateStatus(questionId, nextStatus, token);
      }
    } catch (err) {
      console.error('Failed to update progress status:', err);
      // Roll back the optimistic change on failure.
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, progressStatus: current?.progressStatus } : q
        )
      );
      if (current)
        onSolvedChange?.(current, current.progressStatus === 'SOLVED' ? 'SOLVED' : 'NOT_STARTED');
    }
  };

  const handleToggleBookmark = async (questionId: string) => {
    if (!isSignedIn) {
      alert('Sign in to bookmark questions!');
      return;
    }

    const current = questions.find((q) => q.id === questionId)?.isBookmarked;

    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, isBookmarked: !current } : q))
    );

    try {
      const token = await getToken();
      if (token) {
        await prepApi.toggleBookmark(questionId, token);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No problems match your filters"
        description={
          questions.length === 0
            ? 'This section is concept-only — no practice problems yet.'
            : 'Try clearing the search box or switching the difficulty filter.'
        }
      />
    );
  }

  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <ul className="divide-y divide-white/5">
        {visible.map((q) => {
          const isSolved = q.progressStatus === 'SOLVED';
          const isExpanded = expandedId === q.id;
          const currentTab = activeCodeTab[q.id] || 'python';
          const position = positionById.get(q.id) ?? 0;

          return (
            <li key={q.id} className="transition-colors hover:bg-white/[0.02]">
              <div className="flex items-center gap-3 p-4">
                {/* Status toggle */}
                <button
                  onClick={() => handleToggleSolve(q.id)}
                  aria-pressed={isSolved}
                  aria-label={isSolved ? 'Mark as not started' : 'Mark as solved'}
                  className={cn(
                    'shrink-0 rounded-lg p-1 transition-colors',
                    isSolved ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'
                  )}
                >
                  {isSolved ? (
                    <CheckCircle2 className="h-5 w-5 fill-emerald-500/20" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                {/* Number + title */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="w-8 shrink-0 font-mono text-xs text-slate-500">#{position}</span>
                  <span
                    className={cn(
                      'truncate text-sm font-semibold',
                      isSolved ? 'text-slate-500 line-through' : 'text-white'
                    )}
                    title={q.title}
                  >
                    {q.title}
                  </span>
                </div>

                {/* Actions & badges */}
                <div className="flex shrink-0 items-center gap-1.5">
                  {q.pattern && (
                    <span className="hidden max-w-[180px] truncate rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-400 lg:inline">
                      {q.pattern}
                    </span>
                  )}

                  <Badge tone={difficultyTone(q.difficulty)} uppercase>
                    {q.difficulty}
                  </Badge>

                  {q.links && q.links.length > 0 && (
                    <a
                      href={q.links[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                      title="Practice on LeetCode/GFG"
                      aria-label={`Open ${q.title} on the practice platform`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleToggleBookmark(q.id)}
                    aria-pressed={Boolean(q.isBookmarked)}
                    aria-label={q.isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                    className={cn(
                      'rounded-lg p-1.5 transition-colors',
                      q.isBookmarked
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Bookmark className={cn('h-4 w-4', q.isBookmarked && 'fill-indigo-400')} />
                  </button>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    aria-expanded={isExpanded}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                    aria-label={isExpanded ? 'Collapse solution' : 'Expand solution'}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded solution drawer */}
              {isExpanded && (
                <div className="animate-fade-in space-y-4 border-t border-white/5 bg-[#0b111e]/80 px-5 pb-6 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {q.pattern && <Badge tone="cyan">Pattern: {q.pattern}</Badge>}
                    <Badge tone={difficultyTone(q.difficulty)} uppercase>
                      {q.difficulty}
                    </Badge>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-300">{q.body}</p>

                  {q.explanation && (
                    <div className="space-y-1.5 rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                        <Lightbulb className="h-4 w-4" />
                        Intuition &amp; Optimal Approach
                      </div>
                      <p className="text-xs leading-relaxed text-slate-300">{q.explanation}</p>
                    </div>
                  )}

                  <div className="overflow-hidden rounded-xl border border-white/10 bg-[#070b12]">
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-slate-300">Solution</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setActiveCodeTab((prev) => ({ ...prev, [q.id]: lang }))}
                            aria-pressed={currentTab === lang}
                            className={cn(
                              'rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors',
                              currentTab === lang
                                ? 'bg-indigo-600 font-semibold text-white'
                                : 'text-slate-400 hover:text-white'
                            )}
                          >
                            {lang.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-cyan-200">
                      {q.answer || '// Editorial for this problem is not included in the sheet yet.'}
                    </pre>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
