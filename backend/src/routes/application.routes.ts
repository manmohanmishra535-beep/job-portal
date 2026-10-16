import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { updateApplicationStatusSchema } from '../validators/application.validator';
import { Role } from '@prisma/client';

const router = Router();

// GET /applications/me - Candidate tracks their applications
router.get('/me', requireAuth, requireRole(Role.USER), ApplicationController.getCandidateApplications);

// PATCH /applications/:id/status - Recruiter updates applicant status
router.patch(
  '/:id/status',
  requireAuth,
  requireRole(Role.RECRUITER, Role.ADMIN),
  validateBody(updateApplicationStatusSchema),
  ApplicationController.updateApplicationStatus
);

export default router;
