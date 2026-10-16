'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Compass, BookOpen, Lightbulb, CheckCircle2, Copy, Check, ArrowLeft } from 'lucide-react';

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
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          Quantitative & Logical Aptitude
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Aptitude Mastery & Cheat Sheets
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          High-yield formulas, relative velocity shortcuts, LCM unit work methods, and practice questions tested in TCS NQT, Infosys, and FAANG OAs.
        </p>
      </div>

      {/* Topic Selection Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10">
        {APTITUDE_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => {
              setSelectedTopic(topic);
              setRevealedSolutions({});
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedTopic.id === topic.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'glass-panel text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulas & Shortcuts (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              {selectedTopic.title} - High-Yield Formulas
            </h2>

            <div className="space-y-3">
              {selectedTopic.formulas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 group"
                >
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 block mb-1">
                      {item.name}
                    </span>
                    <code className="text-sm font-mono text-cyan-200">{item.formula}</code>
                  </div>
                  <button
                    onClick={() => handleCopy(item.formula)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                    title="Copy formula"
                  >
                    {copiedFormula === item.formula ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Shortcuts & Pro Tips */}
            <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Exam Shortcuts & Elimination Tricks
              </div>
              <ul className="space-y-1.5 text-xs text-gray-300">
                {selectedTopic.shortcuts.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Practice Problem (1 col) */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">Interactive Practice</h3>
            {selectedTopic.practiceProblems.map((prob, idx) => (
              <div key={idx} className="space-y-4">
                <p className="text-xs text-gray-300 leading-relaxed font-medium">{prob.question}</p>

                <div className="space-y-2">
                  {prob.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300 flex items-center gap-2 font-mono"
                    >
                      <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => toggleSolution(idx)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/15 transition-colors"
                >
                  {revealedSolutions[idx] ? 'Hide Solution' : 'View Correct Answer & Explanation'}
                </button>

                {revealedSolutions[idx] && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Correct Answer: {prob.correct}
                    </div>
                    <p className="text-gray-300 leading-relaxed">{prob.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
