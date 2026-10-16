'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RichText from '@/components/ui/RichText';
import Badge from '@/components/ui/Badge';

const HR_QUESTIONS = [
  {
    id: 'hr-1',
    question: 'Tell me about yourself and your background.',
    objective: 'Tests communication, conciseness, technical passion, and relevant achievements.',
    framework: 'Present → Past → Future (2-minute pitch)',
    modelAnswer: `I am a Software Engineer specializing in scalable backend systems and modern web technologies. Recently at my university and internship at XYZ, I engineered real-time microservices handling thousands of requests and optimized PostgreSQL database queries using indexed B+ trees. 

My engineering journey began with algorithmic problem-solving and open-source contributions. I enjoy translating complex business requirements into maintainable, well-tested code. I am particularly excited about this role because your team is solving distributed scalability challenges that directly align with my background in distributed systems and cloud infrastructure.`,
    pitfalls: [
      'Do not narrate your entire life story from high school.',
      'Avoid reciting your resume line by line; highlight impact and metrics.',
    ],
  },
  {
    id: 'hr-2',
    question:
      'Describe a time you faced a serious conflict with a team member. How did you resolve it?',
    objective:
      'Tests empathy, collaboration, emotional intelligence, and resolution focus (STAR Method).',
    framework: 'STAR: Situation → Task → Action → Result',
    modelAnswer: `• **Situation**: During a capstone project with a team of four, our frontend and backend leads disagreed over whether to adopt GraphQL or standard REST APIs, which stalled development two weeks before our first milestone.
• **Task**: As team coordinator, I needed to break the deadlock and align on an architecture that met our tight deadlines without sacrificing developer velocity.
• **Action**: I scheduled a focused 30-minute sync where both engineers presented their pros and cons grounded in our actual requirements. I proposed a benchmark test for our two primary queries and suggested sticking to REST with OpenAPI specs because the team already possessed high REST fluency and our deadline was imminent.
• **Result**: Both leads agreed with the pragmatic data-driven decision. We completed the integration three days ahead of the milestone, and our documented contract avoided any interface regressions.`,
    pitfalls: [
      'Never blame the other party or speak negatively about colleagues.',
      'Do not say "I have never had any conflict" — interviewers want to see how you navigate disagreements.',
    ],
  },
  {
    id: 'hr-3',
    question: 'Tell me about a time you failed or made a technical mistake.',
    objective: 'Tests self-awareness, accountability, root-cause analysis, and growth mindset.',
    framework: 'Honest admission → Immediate mitigation → Long-term prevention',
    modelAnswer: `• **Situation**: While deploying an updated schema migration in our staging environment, I failed to notice a missing foreign key index, which caused query latency on our primary table to spike to 8 seconds.
• **Task**: I needed to quickly restore database performance and prevent un-indexed migrations from ever reaching staging or production.
• **Action**: I immediately rolled back the migration using our Prisma migration rollback script, which brought latency back to 15ms within 4 minutes. I then conducted a root cause analysis and added an automated CI linter that verifies indexes on all foreign key fields before any pull request can be merged.
• **Result**: The team suffered zero downtime, and the automated CI check prevented two similar indexing omissions in subsequent sprints.`,
    pitfalls: [
      'Do not give a fake flaw like "I work too hard."',
      'Never claim you have never made a mistake.',
    ],
  },
];

const STAR_STEPS = [
  {
    letter: 'S',
    label: 'Situation',
    tone: 'border-indigo-500/25 bg-indigo-500/10 text-indigo-300',
    text: 'Set the context: company, project, timeline, constraints, and problem faced.',
  },
  {
    letter: 'T',
    label: 'Task',
    tone: 'border-purple-500/25 bg-purple-500/10 text-purple-300',
    text: 'Define your specific role and objective in overcoming the challenge.',
  },
  {
    letter: 'A',
    label: 'Action',
    tone: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
    text: 'Detail the concrete actions you spearheaded. Emphasize "I did", not just "We did".',
  },
  {
    letter: 'R',
    label: 'Result',
    tone: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    text: 'Quantify the measurable business and engineering impact, lessons, and growth.',
  },
];

export default function HrPrepPage() {
  const [expandedId, setExpandedId] = useState<string | null>('hr-1');

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
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
          <Users className="h-4 w-4" />
          Behavioral &amp; Leadership Mastery
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          HR Interview &amp; STAR Method Framework
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Craft compelling, structured answers using the STAR method (Situation, Task, Action,
          Result) to ace behavioral and managerial rounds.
        </p>
      </header>

      {/* STAR framework */}
      <section className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8">
        <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-white">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          The STAR Behavioral Formula
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAR_STEPS.map((step) => (
            <div key={step.letter} className={cn('rounded-2xl border p-4', step.tone)}>
              <span className="mb-1 block font-heading text-2xl font-extrabold">
                {step.letter}
              </span>
              <span className="mb-1 block text-sm font-bold text-white">{step.label}</span>
              <p className="text-xs leading-relaxed text-slate-300">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Questions */}
      <section className="space-y-4">
        <h3 className="font-heading text-xl font-bold text-white">
          High-Yield HR &amp; Leadership Questions
        </h3>

        {HR_QUESTIONS.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <div key={q.id} className="glass-panel overflow-hidden rounded-2xl">
              <h4>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`hr-panel-${q.id}`}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-white/[0.02] sm:p-6"
                >
                  <span>
                    <Badge tone="rose" className="mb-2">
                      {q.framework}
                    </Badge>
                    <span className="block font-heading text-lg font-bold text-white">
                      {q.question}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 rounded-xl p-2 text-slate-400 transition-all duration-200',
                      isExpanded && 'rotate-180 bg-white/5 text-white'
                    )}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </button>
              </h4>

              {isExpanded && (
                <div
                  id={`hr-panel-${q.id}`}
                  className="animate-fade-in space-y-4 border-t border-white/5 bg-white/[0.01] px-5 pb-6 pt-5 sm:px-6"
                >
                  <div>
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      What the interviewer evaluates
                    </span>
                    <p className="text-xs font-medium text-indigo-300">{q.objective}</p>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" /> Model High-Scoring Response
                    </span>
                    <RichText content={q.modelAnswer} className="text-xs" />
                  </div>

                  <div className="space-y-1 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-200">
                      <AlertTriangle className="h-4 w-4" /> Common Traps to Avoid
                    </div>
                    <ul className="list-inside list-disc space-y-0.5 text-slate-300">
                      {q.pitfalls.map((pitfall, pIdx) => (
                        <li key={pIdx}>{pitfall}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
