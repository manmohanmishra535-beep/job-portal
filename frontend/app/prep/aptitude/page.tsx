'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, BookOpen, Lightbulb, CheckCircle2, Copy, Check, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

const APTITUDE_TOPICS = [
  {
    id: 'tsd',
    title: 'Time, Speed & Distance',
    formulas: [
      { name: 'Core Relationship', formula: 'Speed = Distance / Time ; Distance = Speed × Time' },
      { name: 'Unit Conversion', formula: '1 km/hr = 5/18 m/s ; 1 m/s = 18/5 km/hr' },
      { name: 'Average Speed (Equal Distances)', formula: 'Avg Speed = (2 × S1 × S2) / (S1 + S2)' },
      { name: 'Relative Speed', formula: 'Same Direction: |S1 - S2| ; Opposite: S1 + S2' },
      { name: 'Boats & Streams', formula: 'Downstream = u + v ; Upstream = u - v ; Boat = (D+U)/2' },
    ],
    shortcuts: [
      'If two travelers start simultaneously and meet, their distance ratio equals their speed ratio (D1/D2 = S1/S2).',
      'For train crossing a platform of length L_p: Total Distance = Length_train + Length_platform.',
    ],
    practiceProblems: [
      {
        question:
          'A train 240 meters long passes a telegraph pole in 16 seconds. How long will it take to pass a platform 420 meters long at the same speed?',
        options: ['28 seconds', '44 seconds', '36 seconds', '40 seconds'],
        correct: '44 seconds',
        explanation:
          '1) Speed = 240m / 16s = 15 m/s. 2) Distance to clear platform = 240 + 420 = 660m. 3) Time = 660 / 15 = 44 seconds.',
      },
    ],
  },
  {
    id: 'time-work',
    title: 'Time & Work / Pipes & Cisterns',
    formulas: [
      { name: 'LCM Unit Work Rule', formula: 'Total Work = LCM of individual completion days' },
      { name: 'Efficiency Formula', formula: 'Efficiency = Total Work / Individual Days' },
      { name: 'Combined Rate', formula: '1/T_total = 1/T_A + 1/T_B' },
      { name: 'Man-Days Relation', formula: '(M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2' },
    ],
    shortcuts: [
      'Assign Total Work = LCM of given numbers to avoid messy fractions.',
      'For pipes with leakages, treat leak as negative efficiency (work = Filling units - Leak units).',
    ],
    practiceProblems: [
      {
        question:
          'A can complete a piece of work in 12 days and B in 18 days. If they work together for 4 days, what fraction of the work remains unfinished?',
        options: ['1/3', '4/9', '5/9', '2/9'],
        correct: '4/9',
        explanation:
          '1) Total Work = LCM(12, 18) = 36 units. 2) A rate = 3, B rate = 2. 3) Combined = 5 units/day. 4) In 4 days = 20 units done. 5) Remaining = 16 units -> 16/36 = 4/9.',
      },
    ],
  },
];

export default function AptitudePage() {
  const [selectedTopic, setSelectedTopic] = useState(APTITUDE_TOPICS[0]);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  const handleCopy = (formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(formula);
    setTimeout(() => setCopiedFormula(null), 1500);
  };

  const toggleSolution = (idx: number) => {
    setRevealedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

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
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          <Compass className="h-4 w-4" />
          Quantitative &amp; Logical Aptitude
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          Aptitude Mastery &amp; Cheat Sheets
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          High-yield formulas, relative velocity shortcuts, LCM unit work methods, and practice
          questions tested in TCS NQT, Infosys, and FAANG OAs.
        </p>
      </header>

      {/* Topic tabs */}
      <div
        role="tablist"
        aria-label="Aptitude topics"
        className="flex flex-wrap gap-2 border-b border-white/10 pb-3"
      >
        {APTITUDE_TOPICS.map((topic) => {
          const active = selectedTopic.id === topic.id;
          return (
            <button
              key={topic.id}
              role="tab"
              aria-selected={active}
              onClick={() => {
                setSelectedTopic(topic);
                setRevealedSolutions({});
              }}
              className={cn(
                'rounded-xl border px-4 py-2 text-xs font-semibold transition-all duration-200',
                active
                  ? 'border-indigo-500/50 bg-indigo-600 text-white shadow-[0_10px_30px_-14px_rgba(99,102,241,0.9)]'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              )}
            >
              {topic.title}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Formulas + shortcuts */}
        <div className="space-y-6 lg:col-span-2">
          <section className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-white">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              {selectedTopic.title} — High-Yield Formulas
            </h2>

            <div className="space-y-3">
              {selectedTopic.formulas.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors hover:border-white/10"
                >
                  <div className="min-w-0">
                    <span className="mb-1 block text-xs font-semibold text-indigo-300">
                      {item.name}
                    </span>
                    <code className="block break-words font-mono text-sm text-cyan-200">
                      {item.formula}
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy(item.formula)}
                    aria-label={`Copy formula: ${item.name}`}
                    title="Copy formula"
                    className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {copiedFormula === item.formula ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <Lightbulb className="h-4 w-4 text-amber-400" /> Exam Shortcuts &amp; Elimination
                Tricks
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedTopic.shortcuts.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-indigo-400">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Practice */}
        <div className="space-y-6">
          <section className="glass-panel space-y-4 rounded-3xl p-6 sm:p-8">
            <h3 className="font-heading text-lg font-bold text-white">Interactive Practice</h3>
            {selectedTopic.practiceProblems.map((prob, idx) => (
              <div key={idx} className="space-y-4">
                <p className="text-sm font-medium leading-relaxed text-slate-300">{prob.question}</p>

                <div className="space-y-2">
                  {prob.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.03] p-2.5 font-mono text-xs text-slate-300"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px] font-bold text-slate-400">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => toggleSolution(idx)}
                >
                  {revealedSolutions[idx] ? 'Hide Solution' : 'View Correct Answer & Explanation'}
                </Button>

                {revealedSolutions[idx] && (
                  <div className="animate-fade-in space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" /> Correct Answer: {prob.correct}
                    </div>
                    <p className="leading-relaxed text-slate-300">{prob.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
