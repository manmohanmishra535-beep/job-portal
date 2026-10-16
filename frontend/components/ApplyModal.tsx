'use client';

import { useEffect, useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Job } from '@/types';
import { applicationsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import Button from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Field';

interface ApplyModalProps {
  job: Job | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplyModal({ job, onClose, onSuccess }: ApplyModalProps) {
  const { getToken, isSignedIn } = useAuth();
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const isOpen = Boolean(job);

  // Close on Escape and lock background scroll while the dialog is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      setError('Please sign in to submit your application.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error('No authentication session found.');

      await applicationsApi.apply(
        job.id,
        {
          resumeUrl: resumeUrl.trim() || undefined,
          coverLetter: coverLetter.trim() || undefined,
        },
        token
      );

      setApplied(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError((err as Error).message || 'Failed to submit application. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="glass-strong relative max-h-[90vh] w-full max-w-lg animate-scale-in overflow-y-auto rounded-3xl p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {applied ? (
          <div className="space-y-4 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 animate-scale-in items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">Application Submitted!</h3>
            <p className="mx-auto max-w-sm text-sm text-slate-400">
              Your application for{' '}
              <span className="font-semibold text-white">{job.title}</span> has been logged to your
              candidate dashboard.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6 pr-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Application Form
              </span>
              <h2
                id="apply-modal-title"
                className="mt-1 font-heading text-2xl font-bold text-white"
              >
                Apply for {job.title}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {job.company?.name} • {job.location}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs text-rose-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field
                label="Resume Link (PDF / Hosted URL)"
                htmlFor="apply-resume-url"
                hint="Optional: if left blank, your default profile resume will be attached."
              >
                <div className="relative">
                  <Upload className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="apply-resume-url"
                    type="url"
                    placeholder="https://drive.google.com/... or hosted PDF link"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </Field>

              <Field
                label="Cover Note / Pitch (Optional)"
                htmlFor="apply-cover-letter"
              >
                <Textarea
                  id="apply-cover-letter"
                  rows={4}
                  placeholder="Highlight key projects, relevant skills, and why you are a great match..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </Field>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Confirm & Apply'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
