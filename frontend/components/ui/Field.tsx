import {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  useId,
} from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const controlBase =
  'w-full rounded-xl bg-white/[0.04] border text-sm text-white placeholder:text-slate-500 ' +
  'transition-colors duration-200 focus:outline-none focus:bg-white/[0.06] ' +
  'focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/25 disabled:opacity-60 ' +
  'disabled:cursor-not-allowed';

export const inputClasses = cn(controlBase, 'px-3.5 py-2.5');
export const textareaClasses = cn(controlBase, 'px-3.5 py-2.5 resize-y min-h-[96px]');
export const selectClasses = cn(controlBase, 'px-3.5 py-2.5 pr-9 appearance-none');

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(inputClasses, 'border-white/10', className)}
        {...props}
      />
    );
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(textareaClasses, 'border-white/10', className)}
      {...props}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(selectClasses, 'border-white/10', className)} {...props}>
        {children}
      </select>
    );
  }
);

export interface FieldProps {
  label?: ReactNode;
  htmlFor?: string;
  error?: string | null;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          {label}
          {required && <span className="ml-0.5 text-rose-400">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-rose-400" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

/** Convenience hook so a Field can label a control it does not own. */
export function useFieldId(provided?: string) {
  const generated = useId();
  return provided || generated;
}
