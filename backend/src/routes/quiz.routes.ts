import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { submitQuizSchema } from '../validators/quiz.validator';
import { strictLimiter } from '../middleware/rateLimiter.middleware';
import { Role } from '@prisma/client';

const router = Router();

// GET /quizzes - List quizzes
router.get('/', optionalAuth, QuizController.listQuizzes);

// GET /quizzes/attempts/me - Past quiz attempts
router.get('/attempts/me', requireAuth, requireRole(Role.USER), QuizController.getMyAttempts);

// GET /quizzes/:id - Get quiz questions (without answers)
router.get('/:id', optionalAuth, QuizController.getQuizById);

// POST /quizzes/:id/submit - Submit answers and get evaluated score
router.post(
  '/:id/submit',
  requireAuth,
  requireRole(Role.USER),
  strictLimiter,
  validateBody(submitQuizSchema),
  QuizController.submitQuiz
);

export default router;
