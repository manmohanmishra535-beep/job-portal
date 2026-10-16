import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatTone = 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet';

const toneStyles: Record<StatTone, string> = {
  indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
  cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
  emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  amber: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  rose: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
  violet: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
};

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: StatTone;
  className?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'indigo',
  className,
}: StatCardProps) {
  return (
    <div className={cn('glass-panel rounded-2xl p-5', className)}>
      <div
        className={cn(
          'mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border',
          toneStyles[tone]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-heading text-3xl font-extrabold leading-none text-white">{value}</div>
      <div className="mt-1.5 text-sm font-medium text-slate-400">{label}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
