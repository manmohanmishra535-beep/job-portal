import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  skills: z.array(z.string()).min(1, 'Please specify at least 1 required skill'),
  experienceLevel: z.enum(['Fresher', 'Mid', 'Senior']).default('Fresher'),
  companyId: z.string().min(1, 'Company ID is required'),
});

export const updateJobSchema = createJobSchema.partial().extend({
  status: z.enum(['OPEN', 'CLOSED']).optional(),
});

export const jobQuerySchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  skills: z.string().optional(), // comma-separated
  salaryMin: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  experienceLevel: z.string().optional(),
  page: z.string().optional().default('1').transform((val) => parseInt(val, 10) || 1),
  limit: z.string().optional().default('10').transform((val) => Math.min(parseInt(val, 10) || 10, 50)),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobQueryInput = z.infer<typeof jobQuerySchema>;
