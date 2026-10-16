'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Lightbulb,
  Code,
  Trophy,
} from 'lucide-react';

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Link */}
      <Link
        href="/prep/companies"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Companies
      </Link>

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-heading font-extrabold text-3xl">
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                  {company.name}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5">
                  {company.tier}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{company.tagline}</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400 uppercase tracking-wider block">Target CTC</span>
            <span className="font-heading font-bold text-lg text-emerald-400">
              {company.compensation}
            </span>
          </div>
        </div>
      </div>

      {/* Eligibility & Exam Pattern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eligibility Criteria */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
          <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Eligibility Criteria
          </h2>
          <div className="space-y-3 text-xs text-gray-300">
            <div>
              <span className="text-gray-400 block mb-0.5">Eligible Degrees:</span>
              <span className="font-medium text-white">{company.eligibility.degree}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">CGPA / Percentage Cutoff:</span>
              <span className="font-medium text-white">{company.eligibility.cgpaCutoff}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Target Batch:</span>
              <span className="font-medium text-white">{company.eligibility.batch}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Attempt Policy:</span>
              <span className="font-medium text-white">{company.eligibility.allowedAttempts}</span>
            </div>
          </div>
        </div>

        {/* OA Exam Pattern */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
          <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> OA Exam Pattern
          </h2>
          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Test Platform:</span>
              <span className="font-medium text-white">{company.examPattern.platform}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Duration:</span>
              <span className="font-medium text-white">{company.examPattern.totalDuration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Question Format:</span>
              <span className="font-medium text-white">{company.examPattern.totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Negative Marking:</span>
              <span className="font-medium text-white">{company.examPattern.negativeMarking}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Rounds Timeline */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" /> Selection Rounds Roadmap
        </h2>

        <div className="space-y-4">
          {company.rounds.map((round: any) => (
            <div
              key={round.step}
              className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-heading font-bold text-sm flex items-center justify-center shrink-0">
                  {round.step}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">{round.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{round.format}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-white/5 text-indigo-300 border border-white/5 shrink-0">
                {round.duration}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips & Common Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tips */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
          <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" /> Preparation Strategy & Tips
          </h2>
          <ul className="space-y-2.5 text-xs text-gray-300 leading-relaxed">
            {company.tips.map((tip: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Common Questions */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
          <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" /> Frequent Interview Problems
          </h2>
          <div className="space-y-2.5">
            {company.commonQuestions.map((q: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-semibold text-white block">{q.title}</span>
                  <span className="text-[11px] text-gray-400">{q.topic}</span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    q.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : q.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {q.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
