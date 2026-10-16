import Link from 'next/link';
import { Sparkles } from 'lucide-react';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block text-slate-400 transition-colors duration-150 hover:text-indigo-300"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#070a12]/80 text-sm text-slate-400 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-bold text-white">NexusCareer</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              The unified career acceleration platform combining verified tech job opportunities with
              production-grade placement prep modules.
            </p>
          </div>

          {/* Job Portal */}
          <nav aria-label="Job portal">
            <h4 className="mb-3 font-heading text-sm font-semibold text-white">Job Portal</h4>
            <ul className="space-y-2.5">
              <li>
                <FooterLink href="/jobs">Explore Tech Jobs</FooterLink>
              </li>
              <li>
                <FooterLink href="/jobs?experienceLevel=Fresher">Fresher &amp; Graduate Roles</FooterLink>
              </li>
              <li>
                <FooterLink href="/jobs?jobType=REMOTE">Remote Engineering</FooterLink>
              </li>
              <li>
                <FooterLink href="/recruiter">Post a Job (Recruiters)</FooterLink>
              </li>
            </ul>
          </nav>

          {/* Prep Hub */}
          <nav aria-label="Preparation hub">
            <h4 className="mb-3 font-heading text-sm font-semibold text-white">Preparation Hub</h4>
            <ul className="space-y-2.5">
              <li>
                <FooterLink href="/prep/aptitude">Quantitative Aptitude</FooterLink>
              </li>
              <li>
                <FooterLink href="/prep/dsa">Curated DSA Sheet</FooterLink>
              </li>
              <li>
                <FooterLink href="/prep/technical">Core CS (OS, DBMS, Networks)</FooterLink>
              </li>
              <li>
                <FooterLink href="/prep/hr">Behavioral &amp; STAR Method</FooterLink>
              </li>
              <li>
                <FooterLink href="/prep/companies">Company Exam Patterns</FooterLink>
              </li>
            </ul>
          </nav>

          {/* Architecture */}
          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold text-white">Architecture</h4>
            <p className="mb-4 text-xs leading-relaxed text-slate-500">
              Next.js 14 App Router + Express.js REST API + Prisma ORM + Supabase PostgreSQL + Redis
              Cache + Clerk Auth.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-300">All Systems Operational</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} NexusCareer. Built for high-growth software engineers.
          </p>
          <p className="text-xs text-slate-500">Powered by Next.js &amp; Express</p>
        </div>
      </div>
    </footer>
  );
}
