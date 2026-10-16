import { prisma } from '../lib/prisma';
import { ApplicationStatus } from '@prisma/client';
import { ApplyJobInput } from '../validators/application.validator';
import { AppError } from '../middleware/error.middleware';

export class ApplicationService {
  /**
   * Candidate applies to a job
   */
  static async applyToJob(jobId: string, userId: string, data: ApplyJobInput) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (job.status !== 'OPEN') {
      throw new AppError('This job posting is closed and no longer accepting applications.', 400);
    }

    // Check if duplicate application
    const existing = await prisma.application.findUnique({
      where: {
        jobId_userId: { jobId, userId },
      },
    });

    if (existing) {
      throw new AppError('You have already applied to this job.', 409);
    }

    // If no resumeUrl is provided in body, check user's profile for an uploaded resume
    let resumeUrl = data.resumeUrl;
    if (!resumeUrl) {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      resumeUrl = profile?.resumeUrl || undefined;
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        userId,
        resumeUrl,
        coverLetter: data.coverLetter,
        status: ApplicationStatus.APPLIED,
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    return application;
  }

  /**
   * Candidate gets all their applications with status tracking
   */
  static async getCandidateApplications(userId: string) {
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    return applications;
  }

  /**
   * Recruiter views all applicants for a specific job they posted
   */
  static async getJobApplicantsForRecruiter(jobId: string, recruiterId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { postedById: true },
    });

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (job.postedById !== recruiterId) {
      throw new AppError('Forbidden: You can only view applicants for jobs you posted.', 403);
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    return applications;
  }

  /**
   * Recruiter updates candidate status (Shortlist, Interview, Reject, Hire)
   */
  static async updateStatus(applicationId: string, recruiterId: string, newStatus: ApplicationStatus) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          select: { postedById: true },
        },
      },
    });

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.job.postedById !== recruiterId) {
      throw new AppError('Forbidden: You can only update applications for your own job postings.', 403);
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        job: {
          select: { id: true, title: true },
        },
      },
    });

    return updated;
  }
}
