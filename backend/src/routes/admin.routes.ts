import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { updateRoleSchema } from '../validators/user.validator';
import { createTopicSchema, createQuestionSchema, createCompanyGuideSchema } from '../validators/prep.validator';
import { Role } from '@prisma/client';

const router = Router();

// Protect all admin routes
router.use(requireAuth, requireRole(Role.ADMIN));

// Platform Statistics
router.get('/stats', AdminController.getPlatformStats);

// User Management
router.get('/users', AdminController.listUsers);
router.patch('/users/:id/role', validateBody(updateRoleSchema), AdminController.changeUserRole);

// Recruiter Approval
router.patch('/recruiters/:id/approve', AdminController.setCompanyApproval);

// Content Management
router.post('/topics', validateBody(createTopicSchema), AdminController.createTopic);
router.post('/questions', validateBody(createQuestionSchema), AdminController.createQuestion);
router.put('/questions/:id', AdminController.updateQuestion);
router.delete('/questions/:id', AdminController.deleteQuestion);
router.post('/companies', validateBody(createCompanyGuideSchema), AdminController.createCompanyGuide);

export default router;
