'use client';

import { useState, useEffect, useMemo } from 'react';
import { Briefcase, RefreshCw, SearchX, ArrowUpDown } from 'lucide-react';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import ApplyModal from '@/components/ApplyModal';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
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

type SortOption = 'recommended' | 'newest' | 'salary-desc' | 'salary-asc';

export default function JobsPage() {
  const { getToken } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(FALLBACK_JOBS);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
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

  // Sorting is purely presentational; "recommended" preserves the fetched order.
  const sortedJobs = useMemo(() => {
    const list = [...jobs];
    switch (sortBy) {
      case 'newest':
        return list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'salary-desc':
        return list.sort(
          (a, b) => (b.salaryMax ?? b.salaryMin ?? 0) - (a.salaryMax ?? a.salaryMin ?? 0)
        );
      case 'salary-asc':
        return list.sort(
          (a, b) => (a.salaryMin ?? a.salaryMax ?? 0) - (b.salaryMin ?? b.salaryMax ?? 0)
        );
      default:
        return list;
    }
  }, [jobs, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-10">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
          <Briefcase className="h-4 w-4" />
          Verified Tech Roles
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          Explore Software Engineering Jobs
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Browse vetted software engineering, cloud, frontend, and systems positions with verified
          compensation packages.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
        {/* Filters */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24">
          <JobFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Results */}
        <section className="space-y-6 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              Showing <span className="font-semibold text-white">{jobs.length}</span> active
              opening{jobs.length === 1 ? '' : 's'}
            </p>

            <div className="flex items-center gap-3">
              {loading && (
                <span className="flex items-center gap-1.5 text-xs text-indigo-300">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Updating
                </span>
              )}
              <div className="relative">
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort jobs"
                  className="h-9 appearance-none rounded-xl border border-white/10 bg-white/5 pl-9 pr-8 text-sm text-slate-200 transition-colors focus:border-indigo-500/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
                >
                  <option className="bg-[#0b111e]" value="recommended">
                    Recommended
                  </option>
                  <option className="bg-[#0b111e]" value="newest">
                    Newest first
                  </option>
                  <option className="bg-[#0b111e]" value="salary-desc">
                    Salary: high to low
                  </option>
                  <option className="bg-[#0b111e]" value="salary-asc">
                    Salary: low to high
                  </option>
                </select>
              </div>
            </div>
          </div>

          {jobs.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No matching jobs found"
              description="Try widening your search terms or resetting the active filters to see more openings."
              action={
                <Button variant="primary" onClick={handleResetFilters}>
                  Reset filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {sortedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          )}
        </section>
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
