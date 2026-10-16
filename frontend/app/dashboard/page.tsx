'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Award,
  Code2,
  Bookmark,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { applicationsApi, progressApi, jobsApi } from '@/lib/api';
import { Application, Job } from '@/types';
import { useAuth, useUser } from '@clerk/nextjs';
import { formatDate } from '@/lib/utils';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'UNDER_REVIEW':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'SHORTLISTED':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'INTERVIEW':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'HIRED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-white/10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 block mb-1">
            Candidate Command Center
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white">
            Welcome back, {user?.firstName || 'Engineer'} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track your ongoing job applications, topic-wise DSA solve metrics, and assessment history.
          </p>
        </div>

        <Link
          href="/jobs"
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 hover:scale-[1.02] transition-transform flex items-center gap-2 shrink-0"
        >
          <Briefcase className="w-4 h-4" /> Find More Jobs
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Applications
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            {applications.length}
          </span>
          <p className="text-[11px] text-gray-400 mt-1">Active submissions</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              DSA Solved
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-cyan-400 font-mono">
            {progress?.overview?.solvedCount || 0}
          </span>
          <p className="text-[11px] text-gray-400 mt-1">Problems solved</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quiz Accuracy
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400 font-mono">
            {progress?.overview?.avgScore || 0}%
          </span>
          <p className="text-[11px] text-gray-400 mt-1">Average score</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Saved Jobs
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            {savedJobs.length}
          </span>
          <p className="text-[11px] text-gray-400 mt-1">Bookmarked</p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Applications (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                Active Job Applications
              </h2>
              <span className="text-xs text-gray-400 font-medium">
                {applications.length} submitted
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm text-gray-400">
                  You haven&apos;t submitted any job applications yet.
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Explore and apply to tech jobs <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-heading font-bold text-base text-white">
                        {app.job?.title || 'Engineering Role'}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {app.job?.company?.name || 'Tech Company'} • Applied {formatDate(app.appliedAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                      <Link
                        href={`/jobs/${app.jobId}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Prep Progress & Quick Links (1 col) */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              DSA Preparation Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-emerald-400 font-semibold">Easy Problems</span>
                <span className="font-mono text-white font-bold">
                  {progress?.overview?.solvedByDifficulty?.Easy || 0} Solved
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-amber-400 font-semibold">Medium Problems</span>
                <span className="font-mono text-white font-bold">
                  {progress?.overview?.solvedByDifficulty?.Medium || 0} Solved
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-rose-400 font-semibold">Hard Problems</span>
                <span className="font-mono text-white font-bold">
                  {progress?.overview?.solvedByDifficulty?.Hard || 0} Solved
                </span>
              </div>
            </div>

            <Link
              href="/prep/dsa"
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/15 transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              Continue DSA Practice <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
