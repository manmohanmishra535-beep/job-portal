'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';
import { jobsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import Button from '@/components/ui/Button';
import { Field, Input, Textarea, Select } from '@/components/ui/Field';

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
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
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
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/recruiter"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Recruiter Dashboard
      </Link>

      <header>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          <Sparkles className="h-4 w-4" />
          Recruiter Listing Form
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white">
          Create New Job Opportunity
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Publish an engineering opening to candidate search results and automated skill match
          feeds.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="glass-panel space-y-6 rounded-3xl p-6 sm:p-8 lg:col-span-2"
        >
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-4 text-xs text-rose-300"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-xs text-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Job posted successfully! Redirecting to dashboard...
            </div>
          )}

          <Field label="Job Title" htmlFor="job-title" required>
            <Input
              id="job-title"
              type="text"
              required
              placeholder="e.g. SDE-1 Backend Systems"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Location" htmlFor="job-location" required>
              <Input
                id="job-location"
                type="text"
                required
                placeholder="e.g. Bengaluru, India / Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Field>

            <Field label="Job Type" htmlFor="job-type" required>
              <Select
                id="job-type"
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              >
                <option value="FULL_TIME" className="bg-[#0b111e]">
                  Full Time
                </option>
                <option value="PART_TIME" className="bg-[#0b111e]">
                  Part Time
                </option>
                <option value="INTERNSHIP" className="bg-[#0b111e]">
                  Internship
                </option>
                <option value="CONTRACT" className="bg-[#0b111e]">
                  Contract
                </option>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Experience Tier" htmlFor="job-experience" required>
              <Select
                id="job-experience"
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              >
                <option value="Fresher" className="bg-[#0b111e]">
                  Fresher (0-1 yr)
                </option>
                <option value="Mid" className="bg-[#0b111e]">
                  Mid-Level (1-3 yrs)
                </option>
                <option value="Senior" className="bg-[#0b111e]">
                  Senior (3+ yrs)
                </option>
              </Select>
            </Field>

            <Field label="Min Salary (INR / Year)" htmlFor="job-salary-min">
              <Input
                id="job-salary-min"
                type="number"
                placeholder="e.g. 1800000"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
              />
            </Field>

            <Field label="Max Salary (INR / Year)" htmlFor="job-salary-max">
              <Input
                id="job-salary-max"
                type="number"
                placeholder="e.g. 3000000"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Field
            label="Required Skills"
            htmlFor="job-skills"
            required
            hint="Comma separated. These power the skill-match feed."
          >
            <Input
              id="job-skills"
              type="text"
              required
              placeholder="e.g. TypeScript, React, Go, Docker, PostgreSQL"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="font-mono"
            />
          </Field>

          <Field label="Role Description & Candidate Requirements" htmlFor="job-description" required>
            <Textarea
              id="job-description"
              required
              rows={5}
              placeholder="Detail team objectives, day-to-day responsibilities, tech stack, and key requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Field>

          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
            <Link
              href="/recruiter"
              className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Job Listing'}
            </Button>
          </div>
        </form>

        {/* Tips */}
        <aside className="space-y-6">
          <div className="glass-panel space-y-4 rounded-3xl p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold text-white">
              <Lightbulb className="h-4 w-4 text-amber-400" /> Listing tips
            </h2>
            <ul className="space-y-2.5 text-xs leading-relaxed text-slate-300">
              {[
                'Lead with the concrete role title candidates actually search for.',
                'List 4–6 core skills so the skill-match feed stays precise.',
                'Quantify scope in the description (team size, scale, impact).',
                'State a realistic salary range to maximise qualified applies.',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
