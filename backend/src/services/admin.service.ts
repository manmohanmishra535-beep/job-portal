import { prisma } from '../lib/prisma';
import { cache } from '../lib/redis';
import { Role } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export class AdminService {
  /**
   * Platform-wide stats for Admin command center
   */
  static async getPlatformStats() {
    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalJobs,
      activeJobs,
      totalApplications,
      totalQuizzesAttempted,
      totalQuestions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.USER } }),
      prisma.user.count({ where: { role: Role.RECRUITER } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: 'OPEN' } }),
      prisma.application.count(),
      prisma.quizAttempt.count(),
      prisma.question.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        candidates: totalCandidates,
        recruiters: totalRecruiters,
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
      },
      applications: totalApplications,
      prep: {
        totalQuestions,
        quizzesAttempted: totalQuizzesAttempted,
      },
    };
  }

  /**
   * List users with pagination and role filter
   */
  static async listUsers(page = 1, limit = 20, role?: Role) {
    const skip = (page - 1) * limit;
    const where = role ? { role } : {};

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          companies: true,
          _count: {
            select: {
              applications: true,
              postedJobs: true,
            },
          },
        },
      }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update user role (e.g. elevate to RECRUITER or ADMIN)
   */
  static async changeUserRole(userId: string, newRole: Role) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return updated;
  }

  /**
   * Approve or block a recruiter's company profile
   */
  static async setCompanyApproval(companyId: string, isApproved: boolean) {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      throw new AppError('Company not found', 404);
    }

    const updated = await prisma.company.update({
      where: { id: companyId },
      data: { isApproved },
    });

    return updated;
  }

  /**
   * Admin content management for topics with cache eviction
   */
  static async createTopic(data: any) {
    const topic = await prisma.topic.create({ data });
    await cache.delPattern('topics:*');
    return topic;
  }

  static async createQuestion(data: any) {
    const question = await prisma.question.create({ data });
    await cache.delPattern('questions:*');
    return question;
  }

  static async updateQuestion(questionId: string, data: any) {
    const question = await prisma.question.update({
      where: { id: questionId },
      data,
    });
    await cache.delPattern('questions:*');
    return question;
  }

  static async deleteQuestion(questionId: string) {
    await prisma.question.delete({ where: { id: questionId } });
    await cache.delPattern('questions:*');
    return { success: true };
  }

  static async createCompanyGuide(data: any) {
    const guide = await prisma.companyGuide.create({ data });
    await cache.delPattern('company:*');
    return guide;
  }
}
