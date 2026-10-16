import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validators/user.validator';
import { Role } from '@prisma/client';

const router = Router();

// GET /users/me - Get current user profile
router.get('/me', requireAuth, UserController.getMe);

// PUT /users/me - Update user profile
router.put('/me', requireAuth, validateBody(updateProfileSchema), UserController.updateMe);

// POST /users/me/resume - Upload/save resume URL
router.post('/me/resume', requireAuth, requireRole(Role.USER), UserController.uploadResume);

export default router;
