import Link from 'next/link';
import {
  Briefcase,
  BookOpen,
  Code2,
  Building2,
  ArrowRight,
  CheckCircle,
  Compass,
  Sparkles,
} from 'lucide-react';
import JobCard from '@/components/JobCard';
import { buttonClasses } from '@/components/ui';

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

const METRICS = [
  { value: '500+', label: 'Tech Openings', accent: 'text-white' },
  { value: '15+', label: 'DSA Topic Sheets', accent: 'text-indigo-400' },
  { value: '100%', label: 'Free Prep Resources', accent: 'text-cyan-400' },
  { value: '50+', label: 'Company Exam Guides', accent: 'text-emerald-400' },
];

const PREP_TRACKS = [
  {
    href: '/prep/aptitude',
    title: 'Quantitative & Logical',
    desc: 'Speed, Distance, Time, LCM unit method, P&C, probability, and shortcuts.',
    icon: Compass,
    tone: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  {
    href: '/prep/dsa',
    title: 'Topic-Wise DSA Sheet',
    desc: '15+ topics: Arrays, Two Pointers, Trees, Graphs, DP with code & complexities.',
    icon: Code2,
    tone: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  {
    href: '/prep/technical',
    title: 'Core CS Subjects',
    desc: 'Operating Systems (Deadlocks, TLB), DBMS (ACID, B+ Trees), Networks, and OOP.',
    icon: BookOpen,
    tone: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    href: '/prep/companies',
    title: 'Company Hiring Guides',
    desc: 'Google, Amazon, Microsoft, TCS, Infosys selection rounds and exam patterns.',
    icon: Building2,
    tone: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20 sm:space-y-28">
      {/* Hero */}
      <section className="relative overflow-hidden pb-14 pt-16 sm:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            The Unified Platform for Jobs &amp; Placement Prep
          </div>

          <h1 className="mx-auto mt-8 max-w-4xl font-heading text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Where Top Engineers
            <br />
            <span className="text-gradient">Get Hired &amp; Ace Placements</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Apply to verified software engineering opportunities and master aptitude, topic-wise DSA
            sheets, core CS subjects, and real company hiring exams in one cohesive environment.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/jobs"
              className={buttonClasses('primary', 'lg', 'w-full px-8 sm:w-auto')}
            >
              <Briefcase className="h-5 w-5" />
              Explore Open Jobs
            </Link>

            <Link
              href="/prep"
              className={buttonClasses('secondary', 'lg', 'w-full px-8 sm:w-auto')}
            >
              <BookOpen className="h-5 w-5 text-cyan-400" />
              Start Preparation Hub
            </Link>
          </div>

          {/* Metrics */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 border-t border-white/10 pt-12 md:grid-cols-4">
            {METRICS.map((metric) => (
              <div key={metric.label} className="glass-panel rounded-2xl p-5">
                <span
                  className={`font-heading text-3xl font-extrabold ${metric.accent}`}
                >
                  {metric.value}
                </span>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two pillars */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Job Portal */}
          <div className="glass-panel group relative overflow-hidden rounded-3xl p-8 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-[0_30px_70px_-40px_rgba(79,70,229,0.9)] sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl"
            />
            <div className="relative">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 transition-transform duration-200 group-hover:scale-105">
                <Briefcase className="h-7 w-7" />
              </div>
              <h2 className="mb-3 font-heading text-2xl font-bold text-white">
                Production Job Portal
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Search and filter high-paying engineering roles with transparent salary ranges, tech
                stacks, experience tiers, and direct recruiter review pipelines.
              </p>
              <ul className="mb-8 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  Real-time application status tracker (Applied → Interview → Hired)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  Fast multi-criteria search cached in Redis
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  Dedicated Recruiter dashboard for posting jobs and shortlisting talent
                </li>
              </ul>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
              >
                Browse Open Roles
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Prep Hub */}
          <div className="glass-panel group relative overflow-hidden rounded-3xl p-8 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_30px_70px_-40px_rgba(6,182,212,0.9)] sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl"
            />
            <div className="relative">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 transition-transform duration-200 group-hover:scale-105">
                <BookOpen className="h-7 w-7" />
              </div>
              <h2 className="mb-3 font-heading text-2xl font-bold text-white">
                Comprehensive Preparation Hub
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Everything needed to crack technical on-campus and off-campus placements: Aptitude
                formulas, topic-wise DSA sheets, Core CS cheat sheets, and real company interview
                guides.
              </p>
              <ul className="mb-8 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  Dedicated DSA Sheet with solve tracking and multi-language solutions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  Timed practice tests with anti-cheat backend evaluation
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  Deep-dive exam patterns and syllabi for Google, Amazon, TCS &amp; more
                </li>
              </ul>
              <Link
                href="/prep"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
              >
                Launch Prep Hub
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured jobs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-white">
              Featured Opportunities
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Actively hiring roles from top product and high-growth companies.
            </p>
          </div>
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            View All Jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURED_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Prep tracks */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-extrabold text-white">
            Placement Preparation Curriculum
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Structured modules designed by engineers to take you from foundational aptitude to
            senior-level coding interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PREP_TRACKS.map((track) => {
            const Icon = track.icon;
            return (
              <Link
                key={track.href}
                href={track.href}
                className="glass-panel group rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/40"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-110 ${track.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">{track.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{track.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel relative overflow-hidden rounded-3xl p-8 text-center sm:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] max-w-full -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[100px]"
          />
          <div className="relative">
            <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
              Ready to accelerate your engineering career?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
              Join the platform that combines verified job opportunities with a complete placement
              preparation curriculum.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/jobs" className={buttonClasses('primary', 'lg', 'px-8')}>
                <Briefcase className="h-5 w-5" /> Get Started Free
              </Link>
              <Link href="/prep/dsa" className={buttonClasses('outline', 'lg', 'px-8')}>
                <Code2 className="h-5 w-5" /> Explore DSA Sheet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
