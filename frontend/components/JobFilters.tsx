'use client';

import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';

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
    <div className="glass-panel rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          Filter Jobs
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Keywords
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Role, tech stack, company..."
            value={filters.q}
            onChange={(e) => onChange('q', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Location Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="City, country or Remote..."
            value={filters.location}
            onChange={(e) => onChange('location', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Job Type Selector */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Job Type
        </label>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onChange('jobType', type.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.jobType === type.value
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/30'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Experience Level
        </label>
        <div className="flex flex-col gap-2">
          {expLevels.map((lvl) => (
            <label
              key={lvl.value}
              className="flex items-center gap-2.5 text-sm text-gray-300 hover:text-white cursor-pointer select-none"
            >
              <input
                type="radio"
                name="expLevel"
                checked={filters.experienceLevel === lvl.value}
                onChange={() => onChange('experienceLevel', lvl.value)}
                className="w-4 h-4 accent-indigo-500 cursor-pointer"
              />
              {lvl.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
