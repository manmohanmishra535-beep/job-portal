import { cn } from '@/lib/utils';

export type ProgressTone = 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet';

const toneStyles: Record<ProgressTone, string> = {
  indigo: 'bg-indigo-400',
  cyan: 'bg-cyan-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
  violet: 'bg-violet-400',
};

const sizeStyles = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
} as const;

export interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: ProgressTone;
  size?: keyof typeof sizeStyles;
  className?: string;
  /** Accessible label announced to screen readers. */
  label?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  tone = 'indigo',
  size = 'md',
  className,
  label,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-white/10', sizeStyles[size], className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500', toneStyles[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
