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

export type DsaDifficultyFilter = 'ALL' | 'Easy' | 'Medium' | 'Hard';

interface DsaTopicSheetProps {
  questions: Question[];
  searchQuery?: string;
  difficultyFilter?: DsaDifficultyFilter;
  onSolvedChange?: (question: Question, nextStatus: 'SOLVED' | 'NOT_STARTED') => void;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

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
      if (current) onSolvedChange?.(current, current.progressStatus === 'SOLVED' ? 'SOLVED' : 'NOT_STARTED');
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
      <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-2">
        <SearchX className="w-8 h-8 text-gray-500" />
        <p className="text-sm font-semibold text-gray-300">No problems match your filters</p>
        <p className="text-xs text-gray-500">
          {questions.length === 0
            ? 'This section is concept-only — no practice problems yet.'
            : 'Try clearing the search box or switching difficulty.'}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
      <div className="divide-y divide-white/5">
        {visible.map((q) => {
          const isSolved = q.progressStatus === 'SOLVED';
          const isExpanded = expandedId === q.id;
          const currentTab = activeCodeTab[q.id] || 'python';
          const position = positionById.get(q.id) ?? 0;

          return (
            <div key={q.id} className="transition-colors hover:bg-white/[0.02]">
              <div className="p-4 flex items-center gap-4">
                {/* Status toggle */}
                <button
                  onClick={() => handleToggleSolve(q.id)}
                  className="text-gray-400 hover:text-emerald-400 transition-colors shrink-0"
                  aria-label={isSolved ? 'Mark as not started' : 'Mark as solved'}
                >
                  {isSolved ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                {/* Number + title */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-gray-500 w-7 shrink-0">#{position}</span>
                  <span
                    className={`text-sm font-semibold truncate ${
                      isSolved ? 'line-through text-gray-500' : 'text-white'
                    }`}
                    title={q.title}
                  >
                    {q.title}
                  </span>
                </div>

                {/* Actions & badges */}
                <div className="flex items-center gap-2 shrink-0">
                  {q.pattern && (
                    <span className="hidden lg:inline text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400 max-w-[180px] truncate">
                      {q.pattern}
                    </span>
                  )}

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                      DIFFICULTY_STYLES[q.difficulty] || DIFFICULTY_STYLES.Easy
                    }`}
                  >
                    {q.difficulty}
                  </span>

                  {q.links && q.links.length > 0 && (
                    <a
                      href={q.links[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Practice on LeetCode/GFG"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleToggleBookmark(q.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      q.isBookmarked
                        ? 'text-indigo-400 bg-indigo-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    aria-label={q.isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                  >
                    <Bookmark className={`w-4 h-4 ${q.isBookmarked ? 'fill-indigo-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded solution drawer */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 bg-[#0d1322]/90 border-t border-white/5 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {q.pattern && (
                      <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                        Pattern: {q.pattern}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                        DIFFICULTY_STYLES[q.difficulty] || DIFFICULTY_STYLES.Easy
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">{q.body}</p>

                  {q.explanation && (
                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                        <Lightbulb className="w-4 h-4" />
                        Intuition & Optimal Approach
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">{q.explanation}</p>
                    </div>
                  )}

                  <div className="rounded-xl overflow-hidden border border-white/10 bg-[#070b12]">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-gray-300">Solution</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {['python', 'cpp', 'java', 'javascript'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setActiveCodeTab((prev) => ({ ...prev, [q.id]: lang }))}
                            className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors ${
                              currentTab === lang
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {lang.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
                      {q.answer || '// Editorial for this problem is not included in the sheet yet.'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
