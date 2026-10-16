import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090d16] text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-lg text-white">NexusCareer</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The unified career acceleration platform combining verified tech job opportunities with
              production-grade placement prep modules.
            </p>
          </div>

          {/* Job Portal Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3 text-sm">Job Portal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="hover:text-indigo-400 transition-colors">
                  Explore Tech Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs?experienceLevel=Fresher" className="hover:text-indigo-400 transition-colors">
                  Fresher & Graduate Roles
                </Link>
              </li>
              <li>
                <Link href="/jobs?jobType=REMOTE" className="hover:text-indigo-400 transition-colors">
                  Remote Engineering
                </Link>
              </li>
              <li>
                <Link href="/recruiter" className="hover:text-indigo-400 transition-colors">
                  Post a Job (Recruiters)
                </Link>
              </li>
            </ul>
          </div>

          {/* Preparation Hub Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3 text-sm">Preparation Hub</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/prep/aptitude" className="hover:text-indigo-400 transition-colors">
                  Quantitative Aptitude
                </Link>
              </li>
              <li>
                <Link href="/prep/dsa" className="hover:text-indigo-400 transition-colors">
                  Curated DSA Sheet
                </Link>
              </li>
              <li>
                <Link href="/prep/technical" className="hover:text-indigo-400 transition-colors">
                  Core CS (OS, DBMS, Networks)
                </Link>
              </li>
              <li>
                <Link href="/prep/hr" className="hover:text-indigo-400 transition-colors">
                  Behavioral & STAR Method
                </Link>
              </li>
              <li>
                <Link href="/prep/companies" className="hover:text-indigo-400 transition-colors">
                  Company Exam Patterns
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Status */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3 text-sm">Architecture</h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Next.js 14 App Router + Express.js REST API + Prisma ORM + Supabase PostgreSQL + Redis Cache + Clerk Auth.
            </p>
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-emerald-400 font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} NexusCareer. Built for high-growth software engineers.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Powered by Next.js & Express</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
