import Link from 'next/link';
import {
  Compass,
  Code2,
  BookOpen,
  Building2,
  Award,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function PrepHubPage() {
  const tracks = [
    {
      title: 'Quantitative & Logical Aptitude',
      desc: 'Speed math shortcuts, Time & Work LCM unit method, Trains, Boats & Streams, and Probability.',
      href: '/prep/aptitude',
      icon: Compass,
      color: 'from-blue-500 to-indigo-600',
      badge: 'High Frequency in OAs',
      topicsCount: '12 Core Topics',
    },
    {
      title: 'Topic-Wise DSA Sheet',
      desc: 'Comprehensive 180+ problems covering Arrays, Two Pointers, Trees, Graphs, and DP with multi-language code.',
      href: '/prep/dsa',
      icon: Code2,
      color: 'from-cyan-500 to-teal-600',
      badge: 'Coding Rounds & Loops',
      topicsCount: '15 Curated Categories',
    },
    {
      title: 'Core Computer Science',
      desc: 'High-yield cheat sheets for Operating Systems (Deadlocks, Virtual Memory), DBMS (ACID, B+ Trees), and Networks.',
      href: '/prep/technical',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-600',
      badge: 'Technical Phone Screens',
      topicsCount: '4 Fundamental Subjects',
    },
    {
      title: 'HR & Behavioral Interview (STAR)',
      desc: 'Model answers for "Tell me about yourself", handling conflict, leadership questions, and salary negotiation.',
      href: '/prep/hr',
      icon: Users,
      color: 'from-rose-500 to-orange-500',
      badge: 'Managerial & Cultural',
      topicsCount: '25+ STAR Frameworks',
    },
    {
      title: 'Company Hiring Processes & Syllabi',
      desc: 'Deep-dive blueprints for Google, Amazon, Microsoft, TCS, Infosys, and Accenture with round timelines.',
      href: '/prep/companies',
      icon: Building2,
      color: 'from-amber-500 to-amber-600',
      badge: 'Company Specific',
      topicsCount: '50+ Tech Companies',
    },
    {
      title: 'Interactive Speed Quizzes',
      desc: 'Timed multiple-choice assessments with backend evaluation, instant percentage accuracy, and score history.',
      href: '/prep/quiz',
      icon: Award,
      color: 'from-emerald-500 to-green-600',
      badge: 'Anti-Cheat Engine',
      topicsCount: 'Timed Tests with Explanations',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mx-auto max-w-3xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          The Placement Command Center
        </div>
        <h1 className="font-heading text-3xl font-black text-white sm:text-5xl">
          Comprehensive Preparation Hub
        </h1>
        <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
          Master every evaluation round of the engineering recruitment lifecycle. From cognitive
          aptitude and online assessments to live algorithmic coding and behavioral interviews.
        </p>
      </header>

      {/* Tracks */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => {
          const Icon = track.icon;
          return (
            <Link
              key={track.href}
              href={track.href}
              className="glass-panel group relative flex flex-col overflow-hidden rounded-3xl p-7 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-[0_28px_60px_-36px_rgba(79,70,229,0.9)]"
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-24 right-0 h-44 w-44 rounded-full bg-gradient-to-br ${track.color} opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-25`}
              />

              <div className="relative flex items-center justify-between gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${track.color} text-white shadow-lg shadow-black/30 transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  {track.badge}
                </span>
              </div>

              <h3 className="relative mt-5 font-heading text-xl font-bold text-white transition-colors group-hover:text-indigo-300">
                {track.title}
              </h3>
              <p className="relative mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-400">
                {track.desc}
              </p>

              <div className="relative mt-8 flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                <span className="font-medium text-slate-400">{track.topicsCount}</span>
                <span className="flex items-center gap-1 font-semibold text-indigo-300 transition-transform duration-200 group-hover:translate-x-1">
                  Start track <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
