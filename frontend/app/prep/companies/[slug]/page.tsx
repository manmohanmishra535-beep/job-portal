'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Lightbulb,
  Code,
} from 'lucide-react';
import Badge, { difficultyTone } from '@/components/ui/Badge';

const COMPANY_DETAILS: Record<string, any> = {
  google: {
    name: 'Google',
    tier: 'Product (MAMAA)',
    tagline: 'Software Engineer (L3 / SDE-1) Full Recruitment Lifecycle',
    compensation: '₹25 LPA - ₹42 LPA (Base ₹18L - ₹22L + Stock GSUs $30k/4yr + Bonus)',
    eligibility: {
      degree: 'B.E / B.Tech / M.E / M.Tech / MCA in CSE, IT, ECE, EE or related disciplines',
      cgpaCutoff: '7.0 CGPA or 70% aggregate (No active backlogs at time of interview)',
      batch: '2025 / 2026 Batch',
      allowedAttempts: '1 attempt per 6-month cooldown period',
    },
    examPattern: {
      platform: 'HackerEarth / Google Internal Testing Platform',
      totalDuration: '90 Minutes',
      totalQuestions: '2 Algorithmic Questions (Medium to Hard)',
      negativeMarking: 'No negative marking (Test cases evaluate partial correctness)',
      sections: [
        {
          name: 'Algorithmic Problem 1',
          duration: '45 Mins',
          focus: 'Graphs (BFS/DFS, Topological Sort) or Trees',
        },
        {
          name: 'Algorithmic Problem 2',
          duration: '45 Mins',
          focus: 'Dynamic Programming, Segment Trees, or Advanced Sliding Window',
        },
      ],
    },
    rounds: [
      {
        step: 1,
        title: 'Online Coding Assessment (OA)',
        duration: '90 Mins',
        format:
          '2 algorithmic problems testing edge cases, optimal time & space complexity, and constraints up to 10^5.',
      },
      {
        step: 2,
        title: 'Technical Phone Screen',
        duration: '45 Mins',
        format:
          '1-on-1 live coding via Google Docs / CoderPad. Focus on clean coding, communication, clarifying requirements, and dry runs.',
      },
      {
        step: 3,
        title: 'Onsite / Virtual Loop (3 Coding Rounds)',
        duration: '45 Mins each',
        format:
          '3 distinct DSA rounds focusing on algorithmic problem solving, time/space optimization, and code modularity.',
      },
      {
        step: 4,
        title: 'Googleyness & Leadership Round',
        duration: '45 Mins',
        format:
          'Behavioral evaluation assessing ambiguity handling, ethical decision-making, bias to action, and inclusive collaboration.',
      },
    ],
    tips: [
      'Always clarify problem constraints, edge cases, and empty input handling before writing code.',
      'State your brute-force approach first to establish a baseline, then systematically optimize to O(N) or O(N log N).',
      'Dry run your solution line-by-line with a sample trace before declaring your code complete.',
      'Focus heavily on Graph traversals (Dijkstra, DFS/BFS) and Dynamic Programming patterns.',
    ],
    commonQuestions: [
      { title: 'Merge Intervals', difficulty: 'Medium', topic: 'Arrays / Sorting' },
      { title: 'Course Schedule II', difficulty: 'Medium', topic: 'Graphs / Topological Sort' },
      { title: 'Word Ladder', difficulty: 'Hard', topic: 'BFS / Shortest Path' },
      { title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'DP / Binary Search' },
    ],
  },
  amazon: {
    name: 'Amazon',
    tier: 'Product (MAMAA)',
    tagline: 'SDE-1 Hiring Cycle & 16 Leadership Principles',
    compensation: '₹22 LPA - ₹35 LPA (Base ₹16L - ₹19L + Sign-on Bonus + RSUs)',
    eligibility: {
      degree: 'B.E / B.Tech / M.E / M.Tech in CSE, IT, ECE or related engineering fields',
      cgpaCutoff: '6.5 CGPA or 65% aggregate with no active backlogs',
      batch: '2025 / 2026 Batch',
      allowedAttempts: '1 attempt per 6-month cooldown period',
    },
    examPattern: {
      platform: 'HackerRank',
      totalDuration: '105 Minutes',
      totalQuestions: '2 Coding Problems + Work Style Assessment',
      negativeMarking: 'None',
      sections: [
        { name: 'Coding Assessment', duration: '70 Mins', focus: '2 Data Structures & Algorithms questions' },
        { name: 'Work Style Assessment', duration: '35 Mins', focus: '16 Amazon Leadership Principles situational judgment' },
      ],
    },
    rounds: [
      {
        step: 1,
        title: 'Online Assessment (OA)',
        duration: '105 Mins',
        format: '2 DSA problems (Arrays/Strings, Trees, Heaps) + LP survey.',
      },
      {
        step: 2,
        title: 'Technical Screen',
        duration: '60 Mins',
        format: '1 DSA problem + 20 minutes of Leadership Principle behavioral deep dives.',
      },
      {
        step: 3,
        title: 'The Onsite Loop (4 Rounds including Bar Raiser)',
        duration: '60 Mins each',
        format: 'Each round splits 50% DSA / Object Oriented Design and 50% LP questions using STAR method.',
      },
    ],
    tips: [
      'Prepare at least 2 concrete STAR stories for every single Amazon Leadership Principle.',
      'Customer Obsession, Ownership, and Bias for Action are tested in almost every interview loop.',
      'Frequent problem patterns: Priority Queues, Binary Trees, BFS/DFS, and Two Pointers.',
    ],
    commonQuestions: [
      { title: 'LRU Cache', difficulty: 'Medium', topic: 'Design / Doubly Linked List' },
      { title: 'Number of Islands', difficulty: 'Medium', topic: 'DFS / BFS' },
      { title: 'Reorganize String', difficulty: 'Medium', topic: 'Heap / Greedy' },
      { title: 'Subtree of Another Tree', difficulty: 'Easy', topic: 'Binary Trees' },
    ],
  },
};

export default function CompanyDetailPage() {
  const { slug } = useParams() as { slug: string };
  const company = COMPANY_DETAILS[slug] || COMPANY_DETAILS['google'];

  const eligibilityRows: [string, string][] = [
    ['Eligible Degrees', company.eligibility.degree],
    ['CGPA / Percentage Cutoff', company.eligibility.cgpaCutoff],
    ['Target Batch', company.eligibility.batch],
    ['Attempt Policy', company.eligibility.allowedAttempts],
  ];

  const examRows: [string, string][] = [
    ['Test Platform', company.examPattern.platform],
    ['Duration', company.examPattern.totalDuration],
    ['Question Format', company.examPattern.totalQuestions],
    ['Negative Marking', company.examPattern.negativeMarking],
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/prep/companies"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Companies
      </Link>

      {/* Header */}
      <header className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-500/15 blur-3xl"
        />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 font-heading text-3xl font-extrabold text-amber-300">
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
                  {company.name}
                </h1>
                <Badge tone="neutral" uppercase>
                  {company.tier}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">{company.tagline}</p>
            </div>
          </div>

          <div className="shrink-0 sm:text-right">
            <span className="block text-xs uppercase tracking-wider text-slate-400">Target CTC</span>
            <span className="font-heading text-lg font-bold text-emerald-400">
              {company.compensation}
            </span>
          </div>
        </div>
      </header>

      {/* Eligibility + exam pattern */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="glass-panel space-y-4 rounded-3xl p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Eligibility Criteria
          </h2>
          <dl className="space-y-3 text-xs">
            {eligibilityRows.map(([label, value], i) => (
              <div key={i}>
                <dt className="mb-0.5 text-slate-400">{label}</dt>
                <dd className="font-medium leading-relaxed text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="glass-panel space-y-4 rounded-3xl p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <Clock className="h-5 w-5 text-cyan-400" /> OA Exam Pattern
          </h2>
          <dl className="space-y-3 text-xs">
            {examRows.map(([label, value], i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <dt className="shrink-0 text-slate-400">{label}</dt>
                <dd className="text-right font-medium leading-relaxed text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Rounds */}
      <section className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8">
        <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-white">
          <Calendar className="h-5 w-5 text-indigo-400" /> Selection Rounds Roadmap
        </h2>

        <ol className="space-y-3">
          {company.rounds.map((round: any) => (
            <li
              key={round.step}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-colors hover:border-white/10 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-heading text-sm font-bold text-white">
                  {round.step}
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">{round.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{round.format}</p>
                </div>
              </div>
              <span className="shrink-0 self-start rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-300 sm:self-auto">
                {round.duration}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Tips + common questions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="glass-panel space-y-4 rounded-3xl p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <Lightbulb className="h-5 w-5 text-amber-400" /> Preparation Strategy &amp; Tips
          </h2>
          <ul className="space-y-2.5 text-xs leading-relaxed text-slate-300">
            {company.tips.map((tip: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-amber-400">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-panel space-y-4 rounded-3xl p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <Code className="h-5 w-5 text-cyan-400" /> Frequent Interview Problems
          </h2>
          <ul className="space-y-2.5">
            {company.commonQuestions.map((q: any, idx: number) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs"
              >
                <div className="min-w-0">
                  <span className="block truncate font-semibold text-white">{q.title}</span>
                  <span className="text-[11px] text-slate-400">{q.topic}</span>
                </div>
                <Badge tone={difficultyTone(q.difficulty)} uppercase>
                  {q.difficulty}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
