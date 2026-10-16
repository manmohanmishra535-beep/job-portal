'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Plus,
  Award,
  CalendarClock,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { recruiterApi, applicationsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { formatDate, cn } from '@/lib/utils';
import { buttonClasses } from '@/components/ui';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import Badge, { BadgeTone } from '@/components/ui/Badge';

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

const STAGE_OPTIONS = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' },
];

export default function RecruiterDashboardPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<any>({
    totalJobs: 3,
    activeJobs: 3,
    totalApplicants: 12,
    statusCounts: {
      APPLIED: 4,
      UNDER_REVIEW: 3,
      SHORTLISTED: 2,
      INTERVIEW: 2,
      REJECTED: 1,
      HIRED: 0,
    },
  });
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRecruiterData() {
      try {
        setLoading(true);
        const token = await getToken();
        if (token) {
          const [statsRes, jobsRes] = await Promise.allSettled([
            recruiterApi.getStats(token),
            recruiterApi.getMyJobs(token),
          ]);
          if (statsRes.status === 'fulfilled' && statsRes.value.data) {
            setStats(statsRes.value.data);
          }
          if (jobsRes.status === 'fulfilled' && jobsRes.value.data) {
            setJobs(jobsRes.value.data);
            if (jobsRes.value.data.length > 0) {
              setSelectedJobId(jobsRes.value.data[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Error loading recruiter stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecruiterData();
  }, [getToken]);

  useEffect(() => {
    async function loadApplicants() {
      if (!selectedJobId) return;
      try {
        const token = await getToken();
        if (token) {
          const res = await applicationsApi.getJobApplicants(selectedJobId, token);
          setApplicants(res.data || []);
        }
      } catch {
        // Mock fallback applicants
        setApplicants([
          {
            id: 'app-1',
            status: 'APPLIED',
            appliedAt: new Date().toISOString(),
            coverLetter: 'Graduating CS major with solid experience in Go and distributed systems.',
            resumeUrl: 'https://example.com/resume.pdf',
            user: {
              name: 'Alex Johnson',
              email: 'alex@example.com',
              profile: {
                college: 'NIT Surathkal',
                skills: ['Go', 'Kubernetes', 'Docker', 'PostgreSQL'],
                experience: '1 year full-time SDE',
              },
            },
          },
        ]);
      }
    }
    loadApplicants();
  }, [selectedJobId, getToken]);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const token = await getToken();
      if (token) {
        await applicationsApi.updateStatus(applicationId, newStatus, token);
        setApplicants((prev) =>
          prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating candidate status.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl"
        />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Talent Acquisition Hub
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-white">
              Recruiter Dashboard &amp; Pipeline
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-slate-400">
              Review incoming applicants, schedule interviews, and update candidate hiring stages.
            </p>
          </div>

          <Link
            href="/recruiter/post-job"
            className={buttonClasses('primary', 'md', 'shrink-0')}
          >
            <Plus className="h-4 w-4" /> Post New Job
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        <StatCard
          icon={Briefcase}
          label="Active Jobs"
          value={stats.activeJobs || 0}
          hint={`${stats.totalJobs || 0} total listings`}
          tone="indigo"
        />
        <StatCard
          icon={Users}
          label="Total Applicants"
          value={stats.totalApplicants || 0}
          hint="Across all roles"
          tone="cyan"
        />
        <StatCard
          icon={Award}
          label="Shortlisted"
          value={stats.statusCounts?.SHORTLISTED || 0}
          hint="In advanced stages"
          tone="violet"
        />
        <StatCard
          icon={CalendarClock}
          label="Interviews"
          value={stats.statusCounts?.INTERVIEW || 0}
          hint="Interview stage"
          tone="emerald"
        />
      </section>

      {/* Pipeline */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Posted jobs */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <Briefcase className="h-4 w-4 text-indigo-400" /> My Posted Jobs
          </h2>

          {jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs posted yet"
              description="Create your first listing to start receiving applicants."
              className="py-10"
              action={
                <Link href="/recruiter/post-job" className={buttonClasses('primary', 'sm')}>
                  Post a job
                </Link>
              }
            />
          ) : (
            <div className="space-y-2">
              {jobs.map((j) => {
                const active = selectedJobId === j.id;
                return (
                  <button
                    key={j.id}
                    onClick={() => setSelectedJobId(j.id)}
                    aria-pressed={active}
                    className={cn(
                      'w-full rounded-2xl border p-4 text-left transition-all duration-200',
                      active
                        ? 'border-indigo-500/60 bg-indigo-600/20 shadow-md shadow-indigo-500/10'
                        : 'glass-panel hover:border-white/15'
                    )}
                  >
                    <h3 className="line-clamp-1 text-sm font-semibold text-white">{j.title}</h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate">{j.location}</span>
                      <span className="ml-2 shrink-0 font-mono font-bold text-indigo-300">
                        {j._count?.applications || 0} applicants
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Applicants */}
        <section className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
              <Users className="h-4 w-4 text-indigo-400" />
              Applicant Screening Pipeline
              <span className="text-slate-500">({applicants.length})</span>
            </h2>
            {loading && (
              <span className="flex items-center gap-1.5 text-xs text-indigo-300">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Syncing
              </span>
            )}
          </div>

          {applicants.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No candidates yet"
              description="Candidates who apply to the selected role will appear here with their profile, skills and resume."
            />
          ) : (
            <div className="space-y-4">
              {applicants.map((app) => (
                <article key={app.id} className="glass-panel space-y-4 rounded-2xl p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-tr from-slate-800 to-slate-700 font-heading text-sm font-bold text-white">
                        {(app.user?.name || 'C').charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading text-lg font-bold text-white">
                          {app.user?.name || 'Candidate'}
                        </h3>
                        <p className="truncate text-xs text-slate-400">
                          {app.user?.email} • {app.user?.profile?.college || 'University'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge tone={statusTone(app.status)} uppercase>
                        {STAGE_OPTIONS.find((s) => s.value === app.status)?.label || app.status}
                      </Badge>
                      <label className="sr-only" htmlFor={`stage-${app.id}`}>
                        Change hiring stage
                      </label>
                      <select
                        id={`stage-${app.id}`}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="cursor-pointer rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors focus:border-indigo-500/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
                      >
                        {STAGE_OPTIONS.map((stage) => (
                          <option key={stage.value} value={stage.value} className="bg-[#0b111e]">
                            {stage.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {app.user?.profile?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {app.user.profile.skills.map((s: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 font-mono text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {app.coverLetter && (
                    <p className="rounded-xl border border-white/5 bg-white/5 p-3 text-xs leading-relaxed text-slate-300">
                      &quot;{app.coverLetter}&quot;
                    </p>
                  )}

                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> View Submitted Resume
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
