import { prisma } from '../lib/prisma';
import { cache } from '../lib/redis';
import { TopicCategory, QuestionType, UserProgressStatus } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export class PrepService {
  /**
   * List topics by category with Redis caching (1 hour)
   */
  static async getTopics(category?: TopicCategory) {
    const cacheKey = `topics:${category || 'all'}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const where = category ? { category } : {};
    const topics = await prisma.topic.findMany({
      where,
      include: {
        _count: {
          select: {
            questions: true,
            notes: true,
            quizzes: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    await cache.set(cacheKey, topics, 3600);
    return topics;
  }

  /**
   * Get questions for a specific topic with optional difficulty & status filter
   */
  static async getQuestionsByTopic(
    topicId: string,
    filters: { difficulty?: string; type?: QuestionType; page?: number; limit?: number },
    userId?: string
  ) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { topicId };
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.type) where.type = filters.type;

    const [total, questions] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          bookmarks: userId ? { where: { userId } } : false,
          userProgress: userId ? { where: { userId } } : false,
        },
      }),
    ]);

    // Format response to cleanly expose isBookmarked and progressStatus
    const formatted = questions.map((q) => {
      const isBookmarked = userId && q.bookmarks ? q.bookmarks.length > 0 : false;
      const progressStatus =
        userId && q.userProgress && q.userProgress.length > 0
          ? q.userProgress[0].status
          : UserProgressStatus.NOT_STARTED;

      // Exclude relations from root object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { bookmarks, userProgress, ...rest } = q;
      return {
        ...rest,
        isBookmarked,
        progressStatus,
      };
    });

    return {
      questions: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Aggregate DSA sheet progress: totals and solved counts per section and per
   * difficulty. Kept out of the cached topic list so it stays per-user.
   */
  static async getDsaOverview(userId?: string) {
    const topics = await prisma.topic.findMany({
      where: { category: TopicCategory.DSA },
      orderBy: { createdAt: 'asc' }, // preserves curriculum order
      include: {
        questions: {
          select: {
            difficulty: true,
            userProgress: userId
              ? { where: { userId }, select: { status: true } }
              : false,
          },
        },
      },
    });

    const pair = () => ({ total: 0, solved: 0 });
    const stat = () => ({ total: 0, solved: 0, easy: pair(), medium: pair(), hard: pair() });
    type Stat = ReturnType<typeof stat>;
    type Pair = ReturnType<typeof pair>;

    const totals: Stat = stat();

    const sections = topics.map((topic) => {
      const section: Stat & { id: string; name: string } = { id: topic.id, name: topic.name, ...stat() };

      for (const q of topic.questions) {
        const solved = Array.isArray(q.userProgress) && q.userProgress.some((p) => p.status === 'SOLVED');
        const inc = solved ? 1 : 0;

        section.total += 1;
        section.solved += inc;
        totals.total += 1;
        totals.solved += inc;

        const key = q.difficulty.toLowerCase();
        if (key === 'easy' || key === 'medium' || key === 'hard') {
          const bucket: Pair = section[key];
          const totalBucket: Pair = totals[key];
          bucket.total += 1;
          bucket.solved += inc;
          totalBucket.total += 1;
          totalBucket.solved += inc;
        }
      }

      return section;
    });

    return { totals, sections };
  }

  /**
   * Get single question detail
   */
  static async getQuestionById(id: string, userId?: string) {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        topic: true,
        bookmarks: userId ? { where: { userId } } : false,
        userProgress: userId ? { where: { userId } } : false,
      },
    });

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    const isBookmarked = userId && question.bookmarks ? question.bookmarks.length > 0 : false;
    const progressStatus =
      userId && question.userProgress && question.userProgress.length > 0
        ? question.userProgress[0].status
        : UserProgressStatus.NOT_STARTED;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { bookmarks, userProgress, ...rest } = question;
    return {
      ...rest,
      isBookmarked,
      progressStatus,
    };
  }

  /**
   * Get notes for a topic
   */
  static async getTopicNotes(topicId: string) {
    const notes = await prisma.note.findMany({
      where: { topicId },
      orderBy: { createdAt: 'asc' },
    });
    return notes;
  }

  /**
   * Get all company hiring guides
   */
  static async getCompanies() {
    const companies = await prisma.companyGuide.findMany({
      orderBy: { companyName: 'asc' },
    });
    return companies;
  }

  /**
   * Get single company hiring guide with Redis caching (1 hour)
   */
  static async getCompanyBySlug(slug: string) {
    const cacheKey = `company:${slug}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const company = await prisma.companyGuide.findUnique({
      where: { slug },
    });

    if (!company) {
      throw new AppError('Company hiring guide not found', 404);
    }

    await cache.set(cacheKey, company, 3600);
    return company;
  }

  /**
   * Bookmark or unbookmark a question
   */
  static async toggleBookmark(userId: string, questionId: string) {
    const existing = await prisma.bookmarkedQuestion.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });

    if (existing) {
      await prisma.bookmarkedQuestion.delete({
        where: { userId_questionId: { userId, questionId } },
      });
      return { isBookmarked: false, message: 'Question removed from bookmarks' };
    } else {
      await prisma.bookmarkedQuestion.create({
        data: { userId, questionId },
      });
      return { isBookmarked: true, message: 'Question bookmarked successfully' };
    }
  }

  /**
   * List all bookmarked questions for user
   */
  static async getBookmarks(userId: string) {
    const bookmarks = await prisma.bookmarkedQuestion.findMany({
      where: { userId },
      include: {
        question: {
          include: {
            topic: true,
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    return bookmarks.map((b) => b.question);
  }
}
