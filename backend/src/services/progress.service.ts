import { prisma } from '../lib/prisma';
import { UserProgressStatus, TopicCategory } from '@prisma/client';

export class ProgressService {
  /**
   * Update or mark question progress status (NOT_STARTED, ATTEMPTED, SOLVED)
   */
  static async updateQuestionProgress(userId: string, questionId: string, status: UserProgressStatus) {
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_questionId: { userId, questionId },
      },
      update: { status },
      create: {
        userId,
        questionId,
        status,
      },
      include: {
        question: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            topic: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return progress;
  }

  /**
   * Get comprehensive candidate progress metrics
   */
  static async getMyProgress(userId: string) {
    // 1. Fetch user's solved and attempted questions
    const userProgress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        question: {
          select: {
            id: true,
            difficulty: true,
            topic: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });

    const solvedCount = userProgress.filter((p) => p.status === UserProgressStatus.SOLVED).length;
    const attemptedCount = userProgress.filter((p) => p.status === UserProgressStatus.ATTEMPTED).length;

    // Difficulty breakdown of solved problems
    const solvedByDifficulty = {
      Easy: userProgress.filter((p) => p.status === UserProgressStatus.SOLVED && p.question.difficulty === 'Easy').length,
      Medium: userProgress.filter((p) => p.status === UserProgressStatus.SOLVED && p.question.difficulty === 'Medium').length,
      Hard: userProgress.filter((p) => p.status === UserProgressStatus.SOLVED && p.question.difficulty === 'Hard').length,
    };

    // Category breakdown
    const categoryStats: Record<string, { total: number; solved: number }> = {
      APTITUDE: { total: 0, solved: 0 },
      DSA: { total: 0, solved: 0 },
      TECHNICAL: { total: 0, solved: 0 },
      HR: { total: 0, solved: 0 },
    };

    // Get total counts from DB for each category
    const categoryTotals = await prisma.question.groupBy({
      by: ['topicId'],
      _count: true,
    });

    const topics = await prisma.topic.findMany({
      select: { id: true, category: true },
    });

    const topicCatMap = new Map<string, TopicCategory>();
    topics.forEach((t) => topicCatMap.set(t.id, t.category));

    categoryTotals.forEach((ct) => {
      const cat = topicCatMap.get(ct.topicId);
      if (cat && categoryStats[cat]) {
        categoryStats[cat].total += ct._count;
      }
    });

    // Populate solved per category
    userProgress.forEach((p) => {
      if (p.status === UserProgressStatus.SOLVED && p.question.topic) {
        const cat = p.question.topic.category;
        if (categoryStats[cat]) {
          categoryStats[cat].solved += 1;
        }
      }
    });

    // 2. Fetch quiz attempts & average score
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
      select: {
        score: true,
        totalQuestions: true,
        takenAt: true,
        quiz: { select: { title: true } },
      },
      orderBy: { takenAt: 'desc' },
      take: 10,
    });

    const totalQuizzes = quizAttempts.length;
    const avgScore =
      totalQuizzes > 0
        ? Math.round(
            (quizAttempts.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) /
              totalQuizzes)
          )
        : 0;

    return {
      overview: {
        solvedCount,
        attemptedCount,
        solvedByDifficulty,
        totalQuizzes,
        avgScore,
      },
      categoryStats,
      recentQuizPerformance: quizAttempts,
    };
  }
}
