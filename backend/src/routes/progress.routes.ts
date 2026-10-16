import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { updateProgressSchema } from '../validators/prep.validator';
import { Role } from '@prisma/client';

const router = Router();

// PUT /progress/questions/:id - Mark question attempted / solved
router.put(
  '/questions/:id',
  requireAuth,
  requireRole(Role.USER),
  validateBody(updateProgressSchema),
  ProgressController.updateQuestionProgress
);

// GET /progress/me - Overall and topic-wise progress breakdown
router.get('/me', requireAuth, requireRole(Role.USER), ProgressController.getMyProgress);

export default router;
