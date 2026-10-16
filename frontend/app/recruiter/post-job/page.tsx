'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, ArrowLeft, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { jobsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

export default function PostJobPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    companyId: 'comp-google', // defaults to seeded company
    description: '',
    location: '',
    jobType: 'FULL_TIME',
    experienceLevel: 'Fresher',
    salaryMin: 1800000,
    salaryMax: 3000000,
    skills: 'TypeScript, React, Node.js, PostgreSQL',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error('You must be signed in as a recruiter to post jobs.');

      const payload = {
        title: formData.title,
        companyId: formData.companyId,
        description: formData.description,
        location: formData.location,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };

      await jobsApi.create(payload, token);
      setSuccess(true);
      setTimeout(() => {
        router.push('/recruiter');
      }, 1500);
    } catch (err) {
      setError((err as Error).message || 'Failed to create job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/recruiter"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Recruiter Dashboard
      </Link>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 block mb-1">
            Recruiter Listing Form
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Create New Job Opportunity
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Publish an engineering opening to candidate search results and automated skill match feeds.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Job posted successfully! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SDE-1 Backend Systems"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru, India / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Job Type *
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Experience Tier *
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Fresher">Fresher (0-1 yr)</option>
                <option value="Mid">Mid-Level (1-3 yrs)</option>
                <option value="Senior">Senior (3+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Min Salary (INR / Year)
              </label>
              <input
                type="number"
                placeholder="e.g. 1800000"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Max Salary (INR / Year)
              </label>
              <input
                type="number"
                placeholder="e.g. 3000000"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Required Skills (Comma separated) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TypeScript, React, Go, Docker, PostgreSQL"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Role Description & Candidate Requirements *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Detail team objectives, day-to-day responsibilities, tech stack, and key requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-white/10">
            <Link
              href="/recruiter"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish Job Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
