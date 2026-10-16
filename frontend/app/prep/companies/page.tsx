import Link from 'next/link';
import { Building2, ArrowRight, CheckCircle2, ArrowLeft, Trophy } from 'lucide-react';

const COMPANIES = [
  {
    slug: 'google',
    name: 'Google',
    tier: 'Product (MAMAA)',
    compensation: '₹25 LPA - ₹42 LPA',
    examPlatform: 'HackerEarth / Google Internal',
    roundsCount: '4-5 Rounds',
    focus: 'Dynamic Programming, Graph algorithms, Distributed Systems, Googleyness',
  },
  {
    slug: 'amazon',
    name: 'Amazon',
    tier: 'Product (MAMAA)',
    compensation: '₹22 LPA - ₹35 LPA',
    examPlatform: 'HackerRank',
    roundsCount: '4 Rounds',
    focus: '16 Leadership Principles, Tree/Graph DFS, System Design, Bar Raiser',
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    tier: 'Product (Tier 1)',
    compensation: '₹20 LPA - ₹32 LPA',
    examPlatform: 'Codility',
    roundsCount: '4 Rounds',
    focus: 'Arrays, Strings, Linked Lists, Cloud fundamentals, Clean Code',
  },
  {
    slug: 'tcs',
    name: 'TCS (Digital & Prime)',
    tier: 'Service / Enterprise',
    compensation: '₹7 LPA - ₹9 LPA (Prime)',
    examPlatform: 'TCS iON',
    roundsCount: '3 Rounds',
    focus: 'Advanced Quantitative Aptitude, Verbal Ability, Hands-on Coding (DSA)',
  },
  {
    slug: 'infosys',
    name: 'Infosys (SP & DSE)',
    tier: 'Service / Enterprise',
    compensation: '₹6.5 LPA - ₹9.5 LPA (SP)',
    examPlatform: 'Infosys Springboard',
    roundsCount: '3 Rounds',
    focus: 'Complex Dynamic Programming, Greedy approaches, Technical Interview',
  },
  {
    slug: 'accenture',
    name: 'Accenture',
    tier: 'Consulting / Tech',
    compensation: '₹4.5 LPA - ₹6.5 LPA',
    examPlatform: 'CoCubes',
    roundsCount: '3 Rounds',
    focus: 'Cognitive & Technical Assessment, Pseudo-Code, Communication Test',
  },
];

export default function CompaniesPage() {
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
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <Building2 className="w-4 h-4" />
          Company-Specific Blueprints
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Company Hiring Processes & Syllabi
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Detailed exam blueprints, eligibility criteria, assessment platforms, round timelines, and frequent coding problems for top tech recruiters.
        </p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMPANIES.map((comp) => (
          <Link
            key={comp.slug}
            href={`/prep/companies/${comp.slug}`}
            className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-heading font-extrabold text-xl group-hover:scale-105 transition-transform">
                  {comp.name.charAt(0)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
                  {comp.tier}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-white group-hover:text-amber-400 transition-colors">
                {comp.name}
              </h3>
              <p className="text-xs font-semibold text-emerald-400 mt-1">
                Typical CTC: {comp.compensation}
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Assessment Platform:</span>
                  <span className="font-medium text-white">{comp.examPlatform}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Selection Rounds:</span>
                  <span className="font-medium text-white">{comp.roundsCount}</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-300 leading-relaxed">
                <strong className="text-amber-300 block mb-0.5">Primary Focus:</strong>
                {comp.focus}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-400">View Full Syllabus</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
