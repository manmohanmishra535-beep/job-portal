import { Router } from 'express';
import { RecruiterController } from '../controllers/recruiter.controller';
import { ApplicationController } from '../controllers/application.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createCompanySchema } from '../validators/user.validator';
import { Role } from '@prisma/client';

const router = Router();

// Recruiter Dashboard Stats
router.get('/stats', requireAuth, requireRole(Role.RECRUITER, Role.ADMIN), RecruiterController.getStats);

// My Posted Jobs
router.get('/jobs', requireAuth, requireRole(Role.RECRUITER, Role.ADMIN), RecruiterController.getMyJobs);

// Create or update recruiter company profile
router.post(
  '/company',
  requireAuth,
  requireRole(Role.RECRUITER, Role.ADMIN),
  validateBody(createCompanySchema),
  RecruiterController.createOrUpdateCompany
);

// Get applicants for a specific posted job
router.get(
  '/jobs/:id/applications',
  requireAuth,
  requireRole(Role.RECRUITER, Role.ADMIN),
  ApplicationController.getJobApplicantsForRecruiter
);

export default router;
