import { prisma } from '../lib/prisma';
import { CreateCompanyInput } from '../validators/user.validator';
import { ApplicationStatus } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export class RecruiterService {
  /**
   * Recruiter dashboard statistics: jobs posted, total applicants, status counts
   */
  static async getRecruiterStats(recruiterId: string) {
    const jobs = await prisma.job.findMany({
      where: { postedById: recruiterId },
      select: { id: true, status: true },
    });

    const jobIds = jobs.map((j) => j.id);

    const applications = await prisma.application.findMany({
      where: { jobId: { in: jobIds } },
      select: { status: true },
    });

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'OPEN').length;
    const totalApplicants = applications.length;

    const statusCounts: Record<ApplicationStatus, number> = {
      APPLIED: 0,
      UNDER_REVIEW: 0,
      SHORTLISTED: 0,
      INTERVIEW: 0,
      REJECTED: 0,
      HIRED: 0,
    };

    applications.forEach((app) => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status] += 1;
      }
    });

    return {
      totalJobs,
      activeJobs,
      totalApplicants,
      statusCounts,
    };
  }

  /**
   * List all jobs posted by this recruiter
   */
  static async getMyPostedJobs(recruiterId: string) {
    const jobs = await prisma.job.findMany({
      where: { postedById: recruiterId },
      include: {
        company: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return jobs;
  }

  /**
   * Create or update the recruiter's associated company.
   *
   * A recruiter is expected to own a single company. If more than one is
   * associated, refuse rather than picking one arbitrarily and overwriting its
   * details (which would silently rename an unrelated company).
   */
  static async createOrUpdateCompany(recruiterId: string, data: CreateCompanyInput) {
    const existing = await prisma.company.findMany({
      where: { recruiterId },
      orderBy: { createdAt: 'asc' },
    });

    if (existing.length > 1) {
      throw new AppError(
        'This recruiter is associated with multiple companies, so the company to update is ambiguous.',
        409,
        [
          `Found ${existing.length} companies: ${existing.map((c) => `${c.name} (${c.id})`).join(', ')}.`,
          'Each recruiter should own a single company; resolve the seed data or pass an explicit company id.',
        ]
      );
    }

    if (existing.length === 1) {
      const company = await prisma.company.update({
        where: { id: existing[0].id },
        data,
      });
      return { company, created: false };
    }

    const company = await prisma.company.create({
      data: {
        ...data,
        recruiterId,
        isApproved: false, // Default requires admin review
      },
    });
    return { company, created: true };
  }
}
