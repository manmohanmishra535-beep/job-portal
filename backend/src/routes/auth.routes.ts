import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// POST /webhooks/clerk - Sync new users to DB
router.post('/clerk', AuthController.handleClerkWebhook);

export default router;
