'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, ExternalLink, Bookmark, ChevronDown, ChevronUp, Code, Lightbulb, Clock } from 'lucide-react';
import { Question } from '@/types';
import { progressApi, prepApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

interface DsaTopicSheetProps {
  topicName: string;
  questions: Question[];
}

export default function DsaTopicSheet({ topicName, questions: initialQuestions }: DsaTopicSheetProps) {
  const { getToken, isSignedIn } = useAuth();
  const [questions, setQuestions] = useState(initialQuestions);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<Record<string, string>>({});

  const solvedCount = questions.filter((q) => q.progressStatus === 'SOLVED').length;
  const progressPct = questions.length > 0 ? Math.round((solvedCount / questions.length) * 100) : 0;

  const handleToggleSolve = async (questionId: string) => {
    if (!isSignedIn) {
      alert('Sign in to track your DSA solve progress!');
      return;
    }

    const current = questions.find((q) => q.id === questionId)?.progressStatus;
    const nextStatus = current === 'SOLVED' ? 'NOT_STARTED' : 'SOLVED';

    // Optimistic UI update
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, progressStatus: nextStatus } : q))
    );

    try {
      const token = await getToken();
      if (token) {
        await progressApi.updateStatus(questionId, nextStatus, token);
      }
    } catch (err) {
      console.error('Failed to update progress status:', err);
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

  return (
    <div className="space-y-6">
      {/* Topic Header & Progress Ring Banner */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-white">{topicName}</h2>
          <p className="text-sm text-gray-400 mt-1">
            Master the core algorithmic patterns and solve high-frequency interview problems.
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
          <div className="text-right">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              Completed
            </span>
            <span className="font-heading font-bold text-lg text-white">
              {solvedCount} / {questions.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center font-bold text-xs text-indigo-400 font-mono">
            {progressPct}%
          </div>
        </div>
      </div>

      {/* Questions Sheet Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="divide-y divide-white/5">
          {questions.map((q, idx) => {
            const isSolved = q.progressStatus === 'SOLVED';
            const isExpanded = expandedId === q.id;
            const currentTab = activeCodeTab[q.id] || 'python';

            return (
              <div key={q.id} className="transition-colors hover:bg-white/[0.02]">
                <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  {/* Status Check & Title */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleSolve(q.id)}
                      className="text-gray-400 hover:text-emerald-400 transition-colors shrink-0"
                    >
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <span className="text-xs font-mono text-gray-400 w-6">#{idx + 1}</span>

                    <span
                      className={`text-sm font-semibold truncate ${
                        isSolved ? 'line-through text-gray-400' : 'text-white'
                      }`}
                    >
                      {q.title}
                    </span>
                  </div>

                  {/* Actions & Badges */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Difficulty Badge */}
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        q.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {q.difficulty}
                    </span>

                    {/* External Link */}
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

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        q.isBookmarked
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${q.isBookmarked ? 'fill-indigo-400' : ''}`} />
                    </button>

                    {/* Expand Details Trigger */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Solution Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 bg-[#0d1322]/90 border-t border-white/5 space-y-4">
                    <p className="text-sm text-gray-300 leading-relaxed">{q.body}</p>

                    {/* Intuition & Approach */}
                    {q.explanation && (
                      <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                          <Lightbulb className="w-4 h-4" />
                          Intuition & Optimal Approach
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">{q.explanation}</p>
                      </div>
                    )}

                    {/* Solution & Complexities */}
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
                              onClick={() =>
                                setActiveCodeTab((prev) => ({ ...prev, [q.id]: lang }))
                              }
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
                        {q.answer || '// Code solution available in repository starter files'}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
