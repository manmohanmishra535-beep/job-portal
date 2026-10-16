import Link from 'next/link';
import {
  Briefcase,
  BookOpen,
  Code2,
  Building2,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  Compass,
} from 'lucide-react';
import JobCard from '@/components/JobCard';

// Featured sample jobs for immediate landing preview
const FEATURED_JOBS: any[] = [
  {
    id: 'job-1',
    title: 'Software Development Engineer - I (Backend)',
    company: {
      id: 'comp-google',
      name: 'Google',
      logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&q=80',
    },
    location: 'Bengaluru, India / Hybrid',
    jobType: 'FULL_TIME',
    salaryMin: 2400000,
    salaryMax: 3800000,
    skills: ['Go', 'Distributed Systems', 'C++', 'Kubernetes'],
    experienceLevel: 'Fresher',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    description:
      'Join Google Core Infrastructure engineering team building high-throughput, low-latency microservices that power billions of daily search and cloud operations.',
  },
  {
    id: 'job-2',
    title: 'SDE-1 (Frontend & Web Systems)',
    company: {
      id: 'comp-amazon',
      name: 'Amazon',
      logoUrl: 'https://images.unsplash.com/photo-1523474255658-4af61825044d?w=128&q=80',
    },
    location: 'Hyderabad, India / Remote',
    jobType: 'FULL_TIME',
    salaryMin: 2200000,
    salaryMax: 3200000,
    skills: ['React', 'TypeScript', 'Next.js', 'Web Performance'],
    experienceLevel: 'Fresher',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    description:
      'Work on Amazon Prime Video and Retail shopping web experiences serving millions of concurrent global shoppers.',
  },
  {
    id: 'job-3',
    title: 'Cloud Solutions Engineer (Azure)',
    company: {
      id: 'comp-msft',
      name: 'Microsoft',
      logoUrl: 'https://images.unsplash.com/photo-1583339824000-5af72d41a54b?w=128&q=80',
    },
    location: 'Noida, India / Hybrid',
    jobType: 'FULL_TIME',
    salaryMin: 2000000,
    salaryMax: 3000000,
    skills: ['Azure', 'C#', '.NET', 'Docker', 'Terraform'],
    experienceLevel: 'Mid',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    description:
      'Architect and scale enterprise cloud solutions on Microsoft Azure. Collaborate with worldwide developers and enterprise partners.',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            The Unified Platform for Jobs & Placement Prep
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Where Top Engineers <br />
            <span className="text-gradient">Get Hired & Ace Placements</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Apply to verified software engineering opportunities and master aptitude, topic-wise DSA sheets,
            core CS subjects, and real company hiring exams in one cohesive environment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/jobs"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              Explore Open Jobs
            </Link>

            <Link
              href="/prep"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-cyan-400" />
              Start Preparation Hub
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-12 border-t border-white/10">
            <div>
              <span className="font-heading font-extrabold text-3xl text-white">500+</span>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                Tech Openings
              </p>
            </div>
            <div>
              <span className="font-heading font-extrabold text-3xl text-indigo-400 font-mono">15+</span>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                DSA Topic Sheets
              </p>
            </div>
            <div>
              <span className="font-heading font-extrabold text-3xl text-cyan-400 font-mono">100%</span>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                Free Prep Resources
              </p>
            </div>
            <div>
              <span className="font-heading font-extrabold text-3xl text-emerald-400 font-mono">50+</span>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                Company Exam Guides
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1: Job Portal */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-6">
              <Briefcase className="w-7 h-7" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-white mb-3">
              Production Job Portal
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Search and filter high-paying engineering roles with transparent salary ranges, tech stacks,
              experience tiers, and direct recruiter review pipelines.
            </p>
            <ul className="space-y-2.5 text-xs text-gray-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Real-time application status tracker (Applied → Interview → Hired)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Fast multi-criteria search cached in Redis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Dedicated Recruiter dashboard for posting jobs and shortlisting talent
              </li>
            </ul>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Browse Open Roles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pillar 2: Prep Hub */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-white mb-3">
              Comprehensive Preparation Hub
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Everything needed to crack technical on-campus and off-campus placements: Aptitude formulas,
              topic-wise DSA sheets, Core CS cheat sheets, and real company interview guides.
            </p>
            <ul className="space-y-2.5 text-xs text-gray-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Dedicated DSA Sheet with solve tracking and multi-language solutions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Timed practice tests with anti-cheat backend evaluation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Deep-dive exam patterns and syllabi for Google, Amazon, TCS & more
              </li>
            </ul>
            <Link
              href="/prep"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Launch Prep Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-heading font-extrabold text-3xl text-white">
              Featured Opportunities
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Actively hiring roles from top product and high-growth companies.
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
          >
            View All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Preparation Tracks Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading font-extrabold text-3xl text-white">
            Placement Preparation Curriculum
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Structured modules designed by engineers to take you from foundational aptitude to senior-level coding interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/prep/aptitude"
            className="glass-panel p-6 rounded-2xl hover:border-indigo-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-white text-lg">Quantitative & Logical</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Speed, Distance, Time, LCM unit method, P&C, probability, and shortcuts.
            </p>
          </Link>

          <Link
            href="/prep/dsa"
            className="glass-panel p-6 rounded-2xl hover:border-indigo-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-white text-lg">Topic-Wise DSA Sheet</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              15+ topics: Arrays, Two Pointers, Trees, Graphs, DP with code & complexities.
            </p>
          </Link>

          <Link
            href="/prep/technical"
            className="glass-panel p-6 rounded-2xl hover:border-indigo-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-white text-lg">Core CS Subjects</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Operating Systems (Deadlocks, TLB), DBMS (ACID, B+ Trees), Networks, and OOP.
            </p>
          </Link>

          <Link
            href="/prep/companies"
            className="glass-panel p-6 rounded-2xl hover:border-indigo-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-white text-lg">Company Hiring Guides</h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Google, Amazon, Microsoft, TCS, Infosys selection rounds and exam patterns.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
