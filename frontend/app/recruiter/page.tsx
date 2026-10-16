'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { recruiterApi, applicationsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { formatDate } from '@/lib/utils';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Recruiter Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-white/10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 block mb-1">
            Talent Acquisition Hub
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white">
            Recruiter Dashboard & Pipeline
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Review incoming applicants, schedule interviews, and update candidate hiring stages.
          </p>
        </div>

        <Link
          href="/recruiter/post-job"
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 hover:scale-[1.02] transition-transform flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      {/* Recruiter Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Active Jobs
          </span>
          <span className="font-heading font-extrabold text-2xl text-white">
            {stats.activeJobs || 0}
          </span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Total Applicants
          </span>
          <span className="font-heading font-extrabold text-2xl text-indigo-400 font-mono">
            {stats.totalApplicants || 0}
          </span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Shortlisted
          </span>
          <span className="font-heading font-extrabold text-2xl text-purple-400 font-mono">
            {stats.statusCounts?.SHORTLISTED || 0}
          </span>
        </div>
        <div className="glass-panel rounded-2xl p-5 border border-white/5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Interviews
          </span>
          <span className="font-heading font-extrabold text-2xl text-cyan-400 font-mono">
            {stats.statusCounts?.INTERVIEW || 0}
          </span>
        </div>
      </div>

      {/* Applicant Screening Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posted Jobs Picker (1 col) */}
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" /> My Posted Jobs
          </h2>

          <div className="space-y-2">
            {jobs.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl text-center text-xs text-gray-400">
                No jobs posted yet. Click &quot;Post New Job&quot; above to create your first listing.
              </div>
            ) : (
              jobs.map((j) => (
                <button
                  key={j.id}
                  onClick={() => setSelectedJobId(j.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedJobId === j.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'glass-panel border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <h3 className="font-semibold text-sm text-white line-clamp-1">{j.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                    <span>{j.location}</span>
                    <span className="font-mono text-indigo-400 font-bold">
                      {j._count?.applications || 0} applicants
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Applicants Review & Status Change (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Applicant Screening Pipeline ({applicants.length})
            </h2>
          </div>

          <div className="space-y-4">
            {applicants.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center text-gray-400 text-sm">
                No candidates have applied to this role yet.
              </div>
            ) : (
              applicants.map((app) => (
                <div
                  key={app.id}
                  className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">
                        {app.user?.name || 'Candidate'}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {app.user?.email} • {app.user?.profile?.college || 'University'}
                      </p>
                    </div>

                    {/* Status Changer Select */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium">Stage:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="APPLIED" className="bg-[#0f172a]">Applied</option>
                        <option value="UNDER_REVIEW" className="bg-[#0f172a]">Under Review</option>
                        <option value="SHORTLISTED" className="bg-[#0f172a]">Shortlisted</option>
                        <option value="INTERVIEW" className="bg-[#0f172a]">Interview</option>
                        <option value="HIRED" className="bg-[#0f172a]">Hired</option>
                        <option value="REJECTED" className="bg-[#0f172a]">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Skills & Experience */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {app.user?.profile?.skills?.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-300 font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {app.coverLetter && (
                    <p className="text-xs text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
                      &quot;{app.coverLetter}&quot;
                    </p>
                  )}

                  {/* Resume link */}
                  {app.resumeUrl && (
                    <div className="pt-2">
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Submitted Resume
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
