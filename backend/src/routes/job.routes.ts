import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { ApplicationController } from '../controllers/application.controller';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware';
import { validate, validateBody } from '../middleware/validate.middleware';
import { createJobSchema, updateJobSchema, jobQuerySchema } from '../validators/job.validator';
import { applyJobSchema } from '../validators/application.validator';
import { applyLimiter } from '../middleware/rateLimiter.middleware';
import { Role } from '@prisma/client';

const router = Router();

// GET /jobs - Public search & filter jobs (paginated, Redis-cached)
router.get('/', optionalAuth, validate(jobQuerySchema), JobController.listJobs);

// GET /jobs/saved/me - Get candidate saved jobs
router.get('/saved/me', requireAuth, requireRole(Role.USER), JobController.getSavedJobs);

// GET /jobs/:id - Public job details (optionalAuth to check isSaved/hasApplied)
router.get('/:id', optionalAuth, JobController.getJobById);

// POST /jobs - Recruiter creates job
router.post('/', requireAuth, requireRole(Role.RECRUITER, Role.ADMIN), validateBody(createJobSchema), JobController.createJob);

// PUT /jobs/:id - Recruiter updates job
router.put('/:id', requireAuth, requireRole(Role.RECRUITER, Role.ADMIN), validateBody(updateJobSchema), JobController.updateJob);

// DELETE /jobs/:id - Recruiter/Admin deletes job
router.delete('/:id', requireAuth, requireRole(Role.RECRUITER, Role.ADMIN), JobController.deleteJob);

// POST /jobs/:id/save - Candidate saves/unsaves a job
router.post('/:id/save', requireAuth, requireRole(Role.USER), JobController.toggleSaveJob);

// POST /jobs/:id/apply - Candidate applies to a job
router.post(
  '/:id/apply',
  requireAuth,
  requireRole(Role.USER),
  applyLimiter,
  validateBody(applyJobSchema),
  ApplicationController.applyToJob
);

export default router;
