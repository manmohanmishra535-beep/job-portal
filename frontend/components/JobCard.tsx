'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Wallet,
  Clock,
  Bookmark,
  Building2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Job } from '@/types';
import { formatSalary, formatDate } from '@/lib/utils';
import { jobsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import Badge, { BadgeTone } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onApplyClick?: (job: Job) => void;
}

const JOB_TYPE_TONES: Record<string, BadgeTone> = {
  FULL_TIME: 'indigo',
  PART_TIME: 'cyan',
  INTERNSHIP: 'violet',
  CONTRACT: 'amber',
};

function jobTypeLabel(value: string) {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function JobCard({ job, onApplyClick }: JobCardProps) {
  const { getToken, isSignedIn } = useAuth();
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  // Re-sync when fresh job data arrives. The list first renders fallback jobs and
  // is then replaced by the API response; those share ids, so React reuses this
  // component and the initial `useState` value would otherwise stick.
  useEffect(() => {
    setIsSaved(job.isSaved || false);
  }, [job.isSaved, job.id]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      alert('Please sign in to save jobs.');
      return;
    }

    try {
      setIsSaving(true);
      const token = await getToken();
      if (token) {
        const res = await jobsApi.toggleSave(job.id, token);
        setIsSaved(res.data.saved);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="glass-panel group flex h-full flex-col rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400/40 hover:shadow-[0_24px_50px_-30px_rgba(79,70,229,0.8)]">
      {/* Header: company + title + save */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-tr from-slate-800 to-slate-700 font-heading text-lg font-bold text-white">
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
              <Building2 className="h-5 w-5 text-indigo-400" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-base font-bold leading-snug text-white">
              <Link
                href={`/jobs/${job.id}`}
                className="line-clamp-2 transition-colors group-hover:text-indigo-300"
              >
                {job.title}
              </Link>
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              <span className="truncate font-medium">{job.company?.name}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleSave}
          disabled={isSaving}
          aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
          aria-pressed={isSaved}
          title={isSaved ? 'Remove from saved jobs' : 'Save job'}
          className={cn(
            'shrink-0 rounded-xl border p-2.5 transition-colors duration-200 disabled:opacity-60',
            isSaved
              ? 'border-indigo-500/40 bg-indigo-600/20 text-indigo-300'
              : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
          )}
        >
          <Bookmark className={cn('h-4 w-4', isSaved && 'fill-indigo-300')} />
        </button>
      </div>

      {/* Metadata */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone="neutral">
          <MapPin className="h-3 w-3 text-cyan-400" />
          {job.location}
        </Badge>
        <Badge tone="neutral">
          <Wallet className="h-3 w-3 text-emerald-400" />
          {formatSalary(job.salaryMin, job.salaryMax)}
        </Badge>
        <Badge tone={JOB_TYPE_TONES[job.jobType] || 'neutral'} uppercase>
          {jobTypeLabel(job.jobType)}
        </Badge>
        {job.experienceLevel && <Badge tone="cyan">{job.experienceLevel}</Badge>}
      </div>

      {/* Description */}
      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-400">
        {job.description}
      </p>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-400"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-1.5 py-0.5 font-mono text-[11px] text-slate-500">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/5 pt-4">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(job.createdAt)}
        </span>

        {job.hasApplied ? (
          <Badge tone="emerald">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Applied
          </Badge>
        ) : (
          <button
            onClick={() => onApplyClick && onApplyClick(job)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/50 bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_-12px_rgba(99,102,241,0.9)] transition-all duration-200 hover:bg-indigo-500 active:scale-[0.98]"
          >
            Apply Now
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </article>
  );
}
