import { prisma } from '../lib/prisma';
import { CreateCompanyInput } from '../validators/user.validator';
import { ApplicationStatus } from '@prisma/client';

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
   * Create or update the recruiter's associated company
   */
  static async createOrUpdateCompany(recruiterId: string, data: CreateCompanyInput) {
    const existing = await prisma.company.findFirst({
      where: { recruiterId },
    });

    if (existing) {
      return prisma.company.update({
        where: { id: existing.id },
        data,
      });
    }

    return prisma.company.create({
      data: {
        ...data,
        recruiterId,
        isApproved: false, // Default requires admin review
      },
    });
  }
}
