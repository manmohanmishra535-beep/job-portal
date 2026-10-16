import Link from 'next/link';
import { Compass, ArrowLeft, Briefcase } from 'lucide-react';
import { buttonClasses } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[520px] max-w-full -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[100px]"
      />
      <div className="glass-panel relative w-full max-w-lg rounded-3xl p-8 text-center sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
          <Compass className="h-8 w-8" />
        </div>
        <p className="font-heading text-5xl font-black text-white">404</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-white">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back
          on track.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonClasses('primary', 'md')}>
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <Link href="/jobs" className={buttonClasses('secondary', 'md')}>
            <Briefcase className="h-4 w-4" /> Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
