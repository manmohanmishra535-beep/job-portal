import { prisma } from '../lib/prisma';
import { SubmitQuizInput } from '../validators/quiz.validator';
import { AppError } from '../middleware/error.middleware';

export class QuizService {
  /**
   * List all available quizzes
   */
  static async listQuizzes() {
    const quizzes = await prisma.quiz.findMany({
      include: {
        topic: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        _count: {
          select: {
            quizQuestions: true,
            quizAttempts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return quizzes;
  }

  /**
   * Get quiz questions WITHOUT revealing answers (anti-cheat)
   */
  static async getQuizById(quizId: string) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        topic: true,
        quizQuestions: {
          include: {
            question: {
              select: {
                id: true,
                title: true,
                body: true,
                options: true,
                difficulty: true,
                // answer and explanation intentionally EXCLUDED here
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    return {
      id: quiz.id,
      title: quiz.title,
      topic: quiz.topic,
      duration: quiz.duration,
      difficulty: quiz.difficulty,
      totalQuestions: quiz.quizQuestions.length,
      questions: quiz.quizQuestions.map((qq) => qq.question),
    };
  }

  /**
   * Evaluate quiz answers securely on backend
   */
  static async submitQuiz(quizId: string, userId: string, submission: SubmitQuizInput) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        quizQuestions: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    const { answers, timeTaken } = submission;
    let score = 0;
    const totalQuestions = quiz.quizQuestions.length;

    const evaluationDetails = quiz.quizQuestions.map((qq) => {
      const q = qq.question;
      const candidateAnswer = answers[q.id];
      const isCorrect = candidateAnswer && candidateAnswer.trim() === q.answer.trim();

      if (isCorrect) {
        score += 1;
      }

      return {
        questionId: q.id,
        title: q.title,
        candidateAnswer: candidateAnswer || 'Not answered',
        correctAnswer: q.answer,
        isCorrect: !!isCorrect,
        explanation: q.explanation,
      };
    });

    // Save attempt in database
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        totalQuestions,
        timeTaken,
        answers: evaluationDetails,
      },
    });

    return {
      attemptId: attempt.id,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      timeTaken,
      results: evaluationDetails,
    };
  }

  /**
   * Get user's quiz attempt history
   */
  static async getCandidateAttempts(userId: string) {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            topic: true,
          },
        },
      },
      orderBy: { takenAt: 'desc' },
    });

    return attempts;
  }
}
