'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin,
  DollarSign,
  Briefcase,
  Building,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import ApplyModal from '@/components/ApplyModal';
import { Job } from '@/types';
import { formatSalary, formatDate } from '@/lib/utils';
import { jobsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Jobs
      </Link>

      {/* Main Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-white font-heading font-extrabold text-2xl shadow-lg">
              {job.company?.name?.charAt(0) || <Building className="w-8 h-8 text-indigo-400" />}
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                {job.title}
              </h1>
              <p className="text-sm text-gray-400 mt-1 font-medium">
                {job.company?.name} •{' '}
                <span className="text-indigo-400 font-semibold">{job.experienceLevel} Tier</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] shrink-0"
          >
            Apply Now
          </button>
        </div>

        {/* Quick Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-gray-400 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location
            </span>
            <span className="font-semibold text-white">{job.location}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-gray-400 block mb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Compensation
            </span>
            <span className="font-semibold text-white">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-gray-400 block mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Job Type
            </span>
            <span className="font-semibold text-white">{job.jobType.replace('_', ' ')}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-gray-400 block mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" /> Posted
            </span>
            <span className="font-semibold text-white">{formatDate(job.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Role Details */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-heading font-bold text-xl text-white mb-3">About the Role</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{job.description}</p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-xl text-white mb-3">Required Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Company Prep Guide Link */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Preparing for {job.company?.name}?
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Review the hiring rounds, OA exam pattern, and frequent technical questions in our Company Prep Guide.
              </p>
            </div>
          </div>
          <Link
            href={`/prep/companies/${job.company?.name?.toLowerCase()}`}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors shrink-0"
          >
            View Hiring Guide
          </Link>
        </div>
      </div>

      {/* Application Modal */}
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
