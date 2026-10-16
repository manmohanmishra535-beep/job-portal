import { prisma } from '../lib/prisma';
import { UpdateProfileInput } from '../validators/user.validator';
import { AppError } from '../middleware/error.middleware';

export class UserService {
  /**
   * Get user profile and career progress summary
   */
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        profile: true,
        _count: {
          select: {
            applications: true,
            savedJobs: true,
            progress: true,
            quizAttempts: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  /**
   * Update profile information
   */
  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const { name, ...profileFields } = data;

    // Update user name if provided
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    // Upsert Profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: profileFields,
      create: {
        userId,
        ...profileFields,
      },
    });

    return profile;
  }

  /**
   * Save resume URL (after uploading to Supabase Storage)
   */
  static async updateResume(userId: string, resumeUrl: string) {
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { resumeUrl },
      create: {
        userId,
        resumeUrl,
      },
    });

    return profile;
  }
}
