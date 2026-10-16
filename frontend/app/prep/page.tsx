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
  CheckCircle2,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          The Placement Command Center
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white">
          Comprehensive Preparation Hub
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
          Master every evaluation round of the engineering recruitment lifecycle. From cognitive aptitude and online assessments to live algorithmic coding and behavioral interviews.
        </p>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => {
          const Icon = track.icon;
          return (
            <Link
              key={track.href}
              href={track.href}
              className="glass-panel rounded-3xl p-7 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${track.color} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
                    {track.badge}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-white group-hover:text-indigo-400 transition-colors">
                  {track.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2.5 leading-relaxed line-clamp-3">
                  {track.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">{track.topicsCount}</span>
                <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Start Track <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
