import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Competitive';
  if (min && !max) return `₹${(min / 100000).toFixed(1)} LPA+`;
  if (!min && max) return `Up to ₹${(max / 100000).toFixed(1)} LPA`;
  return `₹${(min! / 100000).toFixed(1)} - ₹${(max! / 100000).toFixed(1)} LPA`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}
