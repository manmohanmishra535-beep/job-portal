'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Clock, Bookmark, Building, CheckCircle2 } from 'lucide-react';
import { Job } from '@/types';
import { formatSalary, formatDate } from '@/lib/utils';
import { jobsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

interface JobCardProps {
  job: Job;
  onApplyClick?: (job: Job) => void;
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
    <div className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 group flex flex-col justify-between">
      <div>
        {/* Header: Company & Action */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-white font-heading font-bold text-lg shadow-sm">
              {job.company?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  className="w-8 h-8 object-contain rounded-lg"
                />
              ) : (
                job.company?.name?.charAt(0) || <Building className="w-6 h-6 text-indigo-400" />
              )}
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                <Link href={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                {job.company?.name}
                <span className="inline-block w-1 h-1 rounded-full bg-gray-500" />
                <span className="text-xs text-indigo-400/90 font-semibold">{job.experienceLevel}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleSave}
            disabled={isSaving}
            aria-label="Save Job"
            className={`p-2.5 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-400' : ''}`} />
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4 text-xs text-gray-300">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
            {job.jobType.replace('_', ' ')}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">{job.description}</p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {job.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5 font-mono"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded-md text-gray-400 font-mono">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer: Date & Apply Button */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(job.createdAt)}
        </span>

        <div className="flex items-center gap-2">
          {job.hasApplied ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" /> Applied
            </span>
          ) : (
            <button
              onClick={() => onApplyClick && onApplyClick(job)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
