'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Award,
  Code2,
  Bookmark,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
} from 'lucide-react';
import { applicationsApi, progressApi, jobsApi } from '@/lib/api';
import { Application, Job } from '@/types';
import { useAuth, useUser } from '@clerk/nextjs';
import { formatDate, cn } from '@/lib/utils';
import Badge, { BadgeTone } from '@/components/ui/Badge';
import { buttonClasses } from '@/components/ui';
import StatCard from '@/components/ui/StatCard';
import { StatCardSkeleton, Skeleton } from '@/components/ui/Skeleton';

const DIFFICULTY_ROWS = [
  { key: 'Easy', dot: 'bg-emerald-400', text: 'text-emerald-300' },
  { key: 'Medium', dot: 'bg-amber-400', text: 'text-amber-300' },
  { key: 'Hard', dot: 'bg-rose-400', text: 'text-rose-300' },
] as const;

function statusTone(status: string): BadgeTone {
  switch (status) {
    case 'APPLIED':
      return 'indigo';
    case 'UNDER_REVIEW':
      return 'amber';
    case 'SHORTLISTED':
      return 'violet';
    case 'INTERVIEW':
      return 'cyan';
    case 'HIRED':
      return 'emerald';
    case 'REJECTED':
      return 'rose';
    default:
      return 'neutral';
  }
}

function statusLabel(status: string) {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CandidateDashboardPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [progress, setProgress] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const token = await getToken();
        if (token) {
          const [appsRes, savedRes, progRes] = await Promise.allSettled([
            applicationsApi.getMyApplications(token),
            jobsApi.getSaved(token),
            progressApi.getMyProgress(token),
          ]);

          if (appsRes.status === 'fulfilled') setApplications(appsRes.value.data || []);
          if (savedRes.status === 'fulfilled') setSavedJobs(savedRes.value.data || []);
          if (progRes.status === 'fulfilled') setProgress(progRes.value.data || null);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [getToken]);

  const solvedCount = progress?.overview?.solvedCount || 0;
  const avgScore = progress?.overview?.avgScore || 0;
  const solvedByDifficulty = progress?.overview?.solvedByDifficulty || {};

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Welcome banner */}
      <section className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl"
        />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Candidate Command Center
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Welcome back, {user?.firstName || 'Engineer'}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-slate-400">
              Track your ongoing job applications, topic-wise DSA solve metrics, and assessment
              history — all in one place.
            </p>
          </div>

          <Link href="/jobs" className={buttonClasses('primary', 'md', 'shrink-0')}>
            <Briefcase className="h-4 w-4" />
            Find More Jobs
          </Link>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={Briefcase}
              label="Applications"
              value={applications.length}
              hint="Active submissions"
              tone="indigo"
            />
            <StatCard
              icon={Code2}
              label="DSA Solved"
              value={solvedCount}
              hint="Problems solved"
              tone="cyan"
            />
            <StatCard
              icon={Award}
              label="Quiz Accuracy"
              value={`${avgScore}%`}
              hint="Average score"
              tone="emerald"
            />
            <StatCard
              icon={Bookmark}
              label="Saved Jobs"
              value={savedJobs.length}
              hint="Bookmarked"
              tone="amber"
            />
          </>
        )}
      </section>

      {/* Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Applications */}
        <section className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-white">
              <Briefcase className="h-5 w-5 text-indigo-400" />
              Active Job Applications
            </h2>
            <span className="text-xs font-medium text-slate-400">
              {applications.length} submitted
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="space-y-3 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-400">
                You haven&apos;t submitted any job applications yet.
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
              >
                Explore and apply to tech jobs <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {applications.map((app) => (
                <li
                  key={app.id}
                  className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-colors hover:border-white/10 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-tr from-slate-800 to-slate-700 text-sm font-bold text-white">
                      {app.job?.company?.name?.charAt(0) || 'T'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-heading text-base font-bold text-white">
                        {app.job?.title || 'Engineering Role'}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {app.job?.company?.name || 'Tech Company'} • Applied{' '}
                        {formatDate(app.appliedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone={statusTone(app.status)} uppercase>
                      {statusLabel(app.status)}
                    </Badge>
                    <Link
                      href={`/jobs/${app.jobId}`}
                      aria-label={`View ${app.job?.title || 'job'}`}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Sidebar panels */}
        <div className="space-y-8">
          {/* DSA breakdown */}
          <section className="glass-panel space-y-4 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                DSA Preparation
              </h3>
              <span className="font-mono text-sm text-slate-400">{solvedCount} solved</span>
            </div>

            <div className="space-y-2.5">
              {DIFFICULTY_ROWS.map((row) => (
                <div
                  key={row.key}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <span className={cn('h-2 w-2 rounded-full', row.dot)} />
                    {row.key}
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    {solvedByDifficulty[row.key] || 0}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/prep/dsa"
              className={buttonClasses('secondary', 'md', 'w-full')}
            >
              Continue DSA Practice
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          {/* Saved jobs */}
          <section className="glass-panel space-y-4 rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
                <Bookmark className="h-5 w-5 text-amber-400" />
                Saved Jobs
              </h3>
              <span className="text-xs font-medium text-slate-400">{savedJobs.length}</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="space-y-2 py-6 text-center">
                <p className="text-sm text-slate-400">No saved jobs yet.</p>
                <Link
                  href="/jobs"
                  className="text-xs font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                >
                  Browse jobs <ChevronRight className="inline h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {savedJobs.slice(0, 4).map((job) => (
                  <li key={job.id}>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:border-indigo-400/30 hover:bg-white/[0.06]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-white">
                        {job.company?.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={job.company.logoUrl}
                            alt={job.company.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          job.company?.name?.charAt(0) || 'T'
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-white transition-colors group-hover:text-indigo-300">
                          {job.title}
                        </span>
                        <span className="block truncate text-xs text-slate-400">
                          {job.company?.name} • {job.location}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
