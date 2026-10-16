'use client';

import { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Job } from '@/types';
import { applicationsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-[#0f172a]/95 border border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {applied ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-white">Application Submitted!</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Your application for <span className="text-white font-semibold">{job.title}</span> has been logged to your candidate dashboard.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Application Form
              </span>
              <h2 className="font-heading font-bold text-2xl text-white mt-1">
                Apply for {job.title}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {job.company?.name} • {job.location}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Resume Link (PDF / Hosted URL)
                </label>
                <div className="relative">
                  <Upload className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or hosted PDF link"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Optional: If left blank, your default profile resume will be attached.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Highlight key projects, relevant skills, and why you are a great match..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Confirm & Apply'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
