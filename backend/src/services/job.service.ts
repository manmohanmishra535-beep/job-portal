import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { cache } from '../lib/redis';
import { CreateJobInput, UpdateJobInput, JobQueryInput } from '../validators/job.validator';
import { AppError } from '../middleware/error.middleware';

export class JobService {
  /**
   * Search and filter jobs with Redis cache-aside
   */
  static async listJobs(query: JobQueryInput, userId?: string) {
    const { q, location, jobType, skills, salaryMin, experienceLevel, page, limit } = query;
    const skip = (page - 1) * limit;

    // Generate a hash of query filters for Redis cache key
    const filterKeyRaw = JSON.stringify({ q, location, jobType, skills, salaryMin, experienceLevel });
    const filterHash = crypto.createHash('md5').update(filterKeyRaw).digest('hex').substring(0, 10);
    const cacheKey = `jobs:list:${filterHash}:${page}`;

    // 1. Try cache
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return JobService.withUserFlags(cachedData, userId);
    }

    // 2. Build Prisma where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: 'OPEN',
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { company: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (salaryMin !== undefined) {
      where.salaryMax = { gte: salaryMin };
    }

    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      where.skills = { hasSome: skillsArray };
    }

    const [total, jobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              website: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
    ]);

    const result = {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // 3. Cache for 5 minutes (300 seconds)
    await cache.set(cacheKey, result, 300);

    return JobService.withUserFlags(result, userId);
  }

  /**
   * Attach per-user `isSaved` / `hasApplied` flags to a job list.
   *
   * Deliberately applied *after* the shared cache lookup so the cached entry
   * stays user-agnostic and can never leak one candidate's state to another.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static async withUserFlags(result: any, userId?: string) {
    if (!userId || !result?.jobs?.length) return result;

    const jobIds = result.jobs.map((job: { id: string }) => job.id);
    const [saved, applied] = await Promise.all([
      prisma.savedJob.findMany({ where: { userId, jobId: { in: jobIds } }, select: { jobId: true } }),
      prisma.application.findMany({ where: { userId, jobId: { in: jobIds } }, select: { jobId: true } }),
    ]);

    const savedIds = new Set(saved.map((row) => row.jobId));
    const appliedIds = new Set(applied.map((row) => row.jobId));

    return {
      ...result,
      jobs: result.jobs.map((job: { id: string }) => ({
        ...job,
        isSaved: savedIds.has(job.id),
        hasApplied: appliedIds.has(job.id),
      })),
    };
  }

  /**
   * Get single job by ID with 10 min cache
   */
  static async getJobById(id: string, userId?: string) {
    const cacheKey = `job:${id}`;
    let job = await cache.get<any>(cacheKey);

    if (!job) {
      job = await prisma.job.findUnique({
        where: { id },
        include: {
          company: true,
          postedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      });

      if (!job) {
        throw new AppError('Job not found', 404);
      }

      await cache.set(cacheKey, job, 600);
    }

    // Check if current user saved or applied to this job
    let isSaved = false;
    let hasApplied = false;

    if (userId) {
      const [saved, applied] = await Promise.all([
        prisma.savedJob.findUnique({
          where: { userId_jobId: { userId, jobId: id } },
        }),
        prisma.application.findUnique({
          where: { jobId_userId: { jobId: id, userId } },
        }),
      ]);
      isSaved = !!saved;
      hasApplied = !!applied;
    }

    return { ...job, isSaved, hasApplied };
  }

  /**
   * Recruiter creates a job posting
   */
  static async createJob(recruiterId: string, data: CreateJobInput) {
    // Verify recruiter belongs to or owns this company
    const company = await prisma.company.findFirst({
      where: {
        id: data.companyId,
        recruiterId,
      },
    });

    if (!company) {
      throw new AppError('Company not found or you do not have permission to post for this company.', 403);
    }

    const job = await prisma.job.create({
      data: {
        ...data,
        postedById: recruiterId,
      },
      include: {
        company: true,
      },
    });

    // Invalidate cached job lists
    await cache.delPattern('jobs:list:*');

    return job;
  }

  /**
   * Update job listing (Recruiter owner or Admin)
   */
  static async updateJob(jobId: string, recruiterId: string, data: UpdateJobInput, isAdmin: boolean) {
    const existing = await prisma.job.findUnique({ where: { id: jobId } });
    if (!existing) {
      throw new AppError('Job not found', 404);
    }

    if (!isAdmin && existing.postedById !== recruiterId) {
      throw new AppError('Forbidden: You can only edit jobs posted by yourself.', 403);
    }

    const updated = await prisma.job.update({
      where: { id: jobId },
      data,
      include: { company: true },
    });

    // Invalidate caches
    await Promise.all([
      cache.del(`job:${jobId}`),
      cache.delPattern('jobs:list:*'),
    ]);

    return updated;
  }

  /**
   * Delete or close job (Recruiter owner or Admin)
   */
  static async deleteJob(jobId: string, recruiterId: string, isAdmin: boolean) {
    const existing = await prisma.job.findUnique({ where: { id: jobId } });
    if (!existing) {
      throw new AppError('Job not found', 404);
    }

    if (!isAdmin && existing.postedById !== recruiterId) {
      throw new AppError('Forbidden: You can only delete jobs posted by yourself.', 403);
    }

    await prisma.job.delete({ where: { id: jobId } });

    // Invalidate caches
    await Promise.all([
      cache.del(`job:${jobId}`),
      cache.delPattern('jobs:list:*'),
    ]);

    return { success: true, message: 'Job deleted successfully' };
  }

  /**
   * Save / Bookmark or unsave a job
   */
  static async toggleSaveJob(userId: string, jobId: string) {
    const existing = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (existing) {
      await prisma.savedJob.delete({
        where: { userId_jobId: { userId, jobId } },
      });
      return { saved: false, message: 'Job removed from saved list' };
    } else {
      await prisma.savedJob.create({
        data: { userId, jobId },
      });
      return { saved: true, message: 'Job saved successfully' };
    }
  }

  /**
   * Get all saved jobs for a candidate
   */
  static async getSavedJobs(userId: string) {
    const saved = await prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    return saved.map((s) => s.job);
  }
}
