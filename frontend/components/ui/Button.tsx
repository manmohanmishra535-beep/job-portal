import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'subtle';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'inline-flex items-center justify-center rounded-xl font-semibold whitespace-nowrap ' +
  'transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none ' +
  'active:scale-[0.98]';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white border border-indigo-500/50 shadow-[0_10px_30px_-12px_rgba(99,102,241,0.9)] hover:bg-indigo-500 hover:shadow-[0_14px_36px_-12px_rgba(99,102,241,1)]',
  secondary:
    'bg-white/[0.06] text-slate-100 border border-white/10 hover:bg-white/[0.1] hover:border-white/20',
  outline:
    'border border-white/15 text-slate-200 hover:bg-white/[0.06] hover:border-white/30 hover:text-white',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/[0.06]',
  danger:
    'bg-rose-600/90 text-white border border-rose-500/50 hover:bg-rose-500 shadow-[0_10px_30px_-12px_rgba(244,63,94,0.9)]',
  subtle:
    'bg-indigo-500/10 text-indigo-200 border border-indigo-500/25 hover:bg-indigo-500/20 hover:text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2',
  icon: 'h-9 w-9',
};

/** Compose button classes so the same styling can be reused on <Link> elements. */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string
) {
  return cn(base, variantStyles[variant], sizeStyles[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
});

export default Button;
