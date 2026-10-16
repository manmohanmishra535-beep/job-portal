'use client';

import { Search, MapPin, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Field';

interface JobFiltersProps {
  filters: {
    q: string;
    location: string;
    jobType: string;
    experienceLevel: string;
  };
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}

const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-slate-400';

export default function JobFilters({ filters, onChange, onReset }: JobFiltersProps) {
  const jobTypes = [
    { label: 'All Types', value: '' },
    { label: 'Full Time', value: 'FULL_TIME' },
    { label: 'Part Time', value: 'PART_TIME' },
    { label: 'Internship', value: 'INTERNSHIP' },
    { label: 'Contract', value: 'CONTRACT' },
  ];

  const expLevels = [
    { label: 'All Levels', value: '' },
    { label: 'Fresher (0-1 yr)', value: 'Fresher' },
    { label: 'Mid-Level (1-3 yrs)', value: 'Mid' },
    { label: 'Senior (3+ yrs)', value: 'Senior' },
  ];

  return (
    <div className="glass-panel space-y-6 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="flex items-center gap-2 font-heading text-base font-bold text-white">
          <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
          Filters
        </h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-500/10 hover:text-indigo-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Keyword search */}
      <div className="space-y-2">
        <label htmlFor="job-filter-q" className={labelClass}>
          Keywords
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            id="job-filter-q"
            type="text"
            placeholder="Role, tech stack, company..."
            value={filters.q}
            onChange={(e) => onChange('q', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Location search */}
      <div className="space-y-2">
        <label htmlFor="job-filter-location" className={labelClass}>
          Location
        </label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            id="job-filter-location"
            type="text"
            placeholder="City, country or Remote..."
            value={filters.location}
            onChange={(e) => onChange('location', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Job type */}
      <fieldset>
        <legend className={cn(labelClass, 'mb-2.5')}>Job Type</legend>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map((type) => {
            const active = filters.jobType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onChange('jobType', type.value)}
                aria-pressed={active}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  active
                    ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                )}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Experience level */}
      <fieldset>
        <legend className={cn(labelClass, 'mb-2')}>Experience Level</legend>
        <div className="space-y-1">
          {expLevels.map((lvl) => {
            const active = filters.experienceLevel === lvl.value;
            return (
              <label
                key={lvl.value}
                className={cn(
                  'flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors',
                  active ? 'bg-indigo-500/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )}
              >
                <input
                  type="radio"
                  name="expLevel"
                  checked={active}
                  onChange={() => onChange('experienceLevel', lvl.value)}
                  className="h-4 w-4 cursor-pointer accent-indigo-500"
                />
                {lvl.label}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
