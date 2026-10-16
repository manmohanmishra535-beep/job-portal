import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone =
  | 'neutral'
  | 'indigo'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'violet';

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-white/[0.06] text-slate-300 border-white/10',
  indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
  emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  amber: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  rose: 'bg-rose-500/10 text-rose-300 border-rose-500/25',
  cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
  violet: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Uppercase, letter-spaced label — used for statuses and difficulties. */
  uppercase?: boolean;
}

export default function Badge({
  tone = 'neutral',
  uppercase = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
        uppercase && 'uppercase tracking-wider',
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/** Map a difficulty label ("Easy" | "Medium" | "Hard") to a badge tone. */
export function difficultyTone(difficulty?: string | null): BadgeTone {
  switch ((difficulty || '').toLowerCase()) {
    case 'easy':
      return 'emerald';
    case 'medium':
      return 'amber';
    case 'hard':
      return 'rose';
    default:
      return 'neutral';
  }
}
