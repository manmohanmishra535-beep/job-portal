'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Sparkles, CheckCircle2, AlertTriangle, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

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
    question: 'Describe a time you faced a serious conflict with a team member. How did you resolve it?',
    objective: 'Tests empathy, collaboration, emotional intelligence, and resolution focus (STAR Method).',
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

export default function HrPrepPage() {
  const [expandedId, setExpandedId] = useState<string | null>('hr-1');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/prep"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Prep Hub
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <Users className="w-4 h-4" />
          Behavioral & Leadership Mastery
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          HR Interview & STAR Method Framework
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Craft compelling, structured answers using the STAR method (Situation, Task, Action, Result) to ace behavioral and managerial rounds.
        </p>
      </div>

      {/* STAR Framework Hero Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          The STAR Behavioral Formula
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="font-heading font-extrabold text-2xl text-indigo-400 block mb-1">S</span>
            <span className="text-sm font-bold text-white block mb-1">Situation</span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Set the context: company, project, timeline, constraints, and problem faced.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <span className="font-heading font-extrabold text-2xl text-purple-400 block mb-1">T</span>
            <span className="text-sm font-bold text-white block mb-1">Task</span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Define your specific role and objective in overcoming the challenge.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <span className="font-heading font-extrabold text-2xl text-cyan-400 block mb-1">A</span>
            <span className="text-sm font-bold text-white block mb-1">Action</span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Detail the concrete actions you spearheaded. Emphasize "I did", not just "We did".
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="font-heading font-extrabold text-2xl text-emerald-400 block mb-1">R</span>
            <span className="text-sm font-bold text-white block mb-1">Result</span>
            <p className="text-xs text-gray-300 leading-relaxed">
              Quantify the measurable business and engineering impact, lessons, and growth.
            </p>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-xl text-white">
          High-Yield HR & Leadership Questions
        </h3>

        {HR_QUESTIONS.map((q) => {
          const isExpanded = expandedId === q.id;
          return (
            <div
              key={q.id}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-white/[0.02]"
              >
                <div>
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1">
                    Framework: {q.framework}
                  </span>
                  <h4 className="font-heading font-bold text-lg text-white">{q.question}</h4>
                </div>
                <div className="p-2 rounded-xl text-gray-400 hover:text-white transition-colors shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 bg-white/[0.01]">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      What the Interviewer Evaluates:
                    </span>
                    <p className="text-xs text-indigo-300 font-medium">{q.objective}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Model High-Scoring Response
                    </span>
                    <div className="text-xs text-gray-200 leading-relaxed whitespace-pre-line font-sans">
                      {q.modelAnswer}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Common Traps to Avoid
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-300">
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
      </div>
    </div>
  );
}
