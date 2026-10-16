'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Wallet,
  Briefcase,
  Building2,
  CheckCircle2,
  ArrowLeft,
  CalendarDays,
  BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ApplyModal from '@/components/ApplyModal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { Job } from '@/types';
import { formatSalary, formatDate, cn } from '@/lib/utils';
import { jobsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

function jobTypeLabel(value: string) {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function InfoTile({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  iconClass?: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-3">
      <span className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
        <Icon className={cn('h-3.5 w-3.5', iconClass)} />
        {label}
      </span>
      <span className="block truncate text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams() as { id: string };
  const { getToken } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await jobsApi.getById(id, token);
        setJob(res.data);
      } catch {
        // Fallback mockup if backend is offline
        setJob({
          id,
          title: 'Software Development Engineer - I (Backend)',
          company: {
            id: 'comp-google',
            name: 'Google',
            logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&q=80',
            website: 'https://careers.google.com',
            description:
              'Google’s mission is to organize the world’s information and make it universally accessible and useful.',
          },
          location: 'Bengaluru, India / Hybrid',
          jobType: 'FULL_TIME',
          salaryMin: 2400000,
          salaryMax: 3800000,
          skills: ['Go', 'Distributed Systems', 'C++', 'Kubernetes', 'gRPC'],
          experienceLevel: 'Fresher',
          status: 'OPEN',
          createdAt: new Date().toISOString(),
          companyId: 'comp-google',
          description:
            'Join Google Core Infrastructure engineering team building high-throughput, low-latency microservices that power billions of daily search and cloud operations.',
        });
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id, getToken]);

  if (loading || !job) {
    return (
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-32" />
        <div className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="glass-panel space-y-4 rounded-3xl p-6 sm:p-8">
          <Skeleton className="h-6 w-40" />
          <SkeletonText lines={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to All Jobs
      </Link>

      {/* Header card */}
      <div className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-tr from-slate-800 to-slate-700 font-heading text-2xl font-extrabold text-white shadow-lg">
              {job.company?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  className="h-full w-full object-cover"
                />
              ) : job.company?.name?.charAt(0) ? (
                job.company.name.charAt(0)
              ) : (
                <Building2 className="h-8 w-8 text-indigo-400" />
              )}
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
                {job.title}
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-400">
                {job.company?.name} •{' '}
                <span className="font-semibold text-indigo-300">{job.experienceLevel} Tier</span>
              </p>
            </div>
          </div>

          {job.hasApplied ? (
            <Badge tone="emerald" className="shrink-0 px-4 py-2 text-xs">
              <CheckCircle2 className="h-4 w-4" /> Application submitted
            </Badge>
          ) : (
            <Button size="lg" className="shrink-0" onClick={() => setShowApplyModal(true)}>
              Apply Now
            </Button>
          )}
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
          <InfoTile icon={MapPin} label="Location" value={job.location} iconClass="text-cyan-400" />
          <InfoTile
            icon={Wallet}
            label="Compensation"
            value={formatSalary(job.salaryMin, job.salaryMax)}
            iconClass="text-emerald-400"
          />
          <InfoTile
            icon={Briefcase}
            label="Job Type"
            value={jobTypeLabel(job.jobType)}
            iconClass="text-indigo-400"
          />
          <InfoTile
            icon={CalendarDays}
            label="Posted"
            value={formatDate(job.createdAt)}
            iconClass="text-purple-400"
          />
        </div>
      </div>

      {/* Role details */}
      <div className="glass-panel space-y-8 rounded-3xl p-6 sm:p-8">
        <section>
          <h2 className="mb-3 font-heading text-xl font-bold text-white">About the Role</h2>
          <p className="text-sm leading-relaxed text-slate-300">{job.description}</p>
        </section>

        <section>
          <h2 className="mb-3 font-heading text-xl font-bold text-white">
            Required Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 font-mono text-xs font-medium text-indigo-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Prep guide CTA */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Preparing for {job.company?.name}?
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Review the hiring rounds, OA exam pattern, and frequent technical questions in our
                Company Prep Guide.
              </p>
            </div>
          </div>
          <Link
            href={`/prep/companies/${job.company?.name?.toLowerCase()}`}
            className="shrink-0 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20"
          >
            View Hiring Guide
          </Link>
        </div>
      </div>

      {/* Apply modal */}
      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setJob((prev) => (prev ? { ...prev, hasApplied: true } : null));
          }}
        />
      )}
    </div>
  );
}
