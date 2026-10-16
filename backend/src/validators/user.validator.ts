import { z } from 'zod';
import { Role } from '@prisma/client';

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(5).max(20).optional(),
  college: z.string().optional(),
  skills: z.array(z.string()).optional(),
  resumeUrl: z.string().url().optional(),
  location: z.string().optional(),
  experience: z.string().optional(),
});

export const updateRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

export const createCompanySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  logoUrl: z.string().url('Must be a valid URL').optional(),
  website: z.string().url('Must be a valid URL').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
