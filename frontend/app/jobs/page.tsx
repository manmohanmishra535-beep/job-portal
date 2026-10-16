'use client';

import { useState, useEffect } from 'react';
import { Briefcase, AlertCircle, RefreshCw } from 'lucide-react';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import ApplyModal from '@/components/ApplyModal';
import { Job } from '@/types';
import { jobsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';

const FALLBACK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Software Development Engineer - I (Backend)',
    company: {
      id: 'comp-google',
      name: 'Google',
      logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&q=80',
    },
    location: 'Bengaluru, India / Hybrid',
    jobType: 'FULL_TIME',
    salaryMin: 2400000,
    salaryMax: 3800000,
    skills: ['Go', 'Distributed Systems', 'C++', 'Kubernetes'],
    experienceLevel: 'Fresher',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    companyId: 'comp-google',
    description:
      'Join Google Core Infrastructure engineering team building high-throughput, low-latency microservices that power billions of daily search and cloud operations.',
  },
  {
    id: 'job-2',
    title: 'SDE-1 (Frontend & Web Systems)',
    company: {
      id: 'comp-amazon',
      name: 'Amazon',
      logoUrl: 'https://images.unsplash.com/photo-1523474255658-4af61825044d?w=128&q=80',
    },
    location: 'Hyderabad, India / Remote',
    jobType: 'FULL_TIME',
    salaryMin: 2200000,
    salaryMax: 3200000,
    skills: ['React', 'TypeScript', 'Next.js', 'Web Performance'],
    experienceLevel: 'Fresher',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    companyId: 'comp-amazon',
    description:
      'Work on Amazon Prime Video and Retail shopping web experiences serving millions of concurrent global shoppers.',
  },
  {
    id: 'job-3',
    title: 'Cloud Solutions Engineer (Azure)',
    company: {
      id: 'comp-msft',
      name: 'Microsoft',
      logoUrl: 'https://images.unsplash.com/photo-1583339824000-5af72d41a54b?w=128&q=80',
    },
    location: 'Noida, India / Hybrid',
    jobType: 'FULL_TIME',
    salaryMin: 2000000,
    salaryMax: 3000000,
    skills: ['Azure', 'C#', '.NET', 'Docker', 'Terraform'],
    experienceLevel: 'Mid',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    companyId: 'comp-msft',
    description:
      'Architect and scale enterprise cloud solutions on Microsoft Azure. Collaborate with worldwide developers and enterprise partners.',
  },
];

export default function JobsPage() {
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(FALLBACK_JOBS);
  const [loading, setLoading] = useState(false);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  const [filters, setFilters] = useState({
    q: '',
    location: '',
    jobType: '',
    experienceLevel: '',
  });

  const loadJobs = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await jobsApi.list(filters, token);
      if (res.data?.jobs && res.data.jobs.length > 0) {
        setJobs(res.data.jobs);
      } else {
        // Filter fallback jobs locally if backend is empty or offline
        let filtered = FALLBACK_JOBS;
        if (filters.q) {
          filtered = filtered.filter(
            (j) =>
              j.title.toLowerCase().includes(filters.q.toLowerCase()) ||
              j.company.name.toLowerCase().includes(filters.q.toLowerCase())
          );
        }
        if (filters.location) {
          filtered = filtered.filter((j) =>
            j.location.toLowerCase().includes(filters.location.toLowerCase())
          );
        }
        if (filters.jobType) {
          filtered = filtered.filter((j) => j.jobType === filters.jobType);
        }
        if (filters.experienceLevel) {
          filtered = filtered.filter((j) => j.experienceLevel === filters.experienceLevel);
        }
        setJobs(filtered);
      }
    } catch {
      // Local fallback filtering on network error
      let filtered = FALLBACK_JOBS;
      if (filters.q) {
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(filters.q.toLowerCase()) ||
            j.company.name.toLowerCase().includes(filters.q.toLowerCase())
        );
      }
      if (filters.location) {
        filtered = filtered.filter((j) =>
          j.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.jobType) {
        filtered = filtered.filter((j) => j.jobType === filters.jobType);
      }
      if (filters.experienceLevel) {
        filtered = filtered.filter((j) => j.experienceLevel === filters.experienceLevel);
      }
      setJobs(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      location: '',
      jobType: '',
      experienceLevel: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title Banner */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-2">
          <Briefcase className="w-4 h-4" />
          Verified Tech Roles
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          Explore Software Engineering Jobs
        </h1>
        <p className="text-sm text-gray-400 mt-1 max-w-2xl">
          Browse vetted software engineering, cloud, frontend, and systems positions with verified compensation packages.
        </p>
      </div>

      {/* Main Layout: Filters Sidebar + Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <JobFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Jobs Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Showing <strong className="text-white">{jobs.length}</strong> active openings
            </span>
            {loading && (
              <span className="flex items-center gap-1.5 text-indigo-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Updating...
              </span>
            )}
          </div>

          {jobs.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/5 text-gray-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white">No Matching Jobs Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Try widening your search terms or resetting the active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            loadJobs();
          }}
        />
      )}
    </div>
  );
}
