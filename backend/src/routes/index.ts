import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import jobRoutes from './job.routes';
import applicationRoutes from './application.routes';
import prepRoutes from './prep.routes';
import quizRoutes from './quiz.routes';
import progressRoutes from './progress.routes';
import recruiterRoutes from './recruiter.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health check endpoint (Section 16)
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mount modules matching technical documentation paths
router.use('/webhooks', authRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/', prepRoutes); // mounts /topics, /questions, /companies
router.use('/quizzes', quizRoutes);
router.use('/progress', progressRoutes);
router.use('/recruiter', recruiterRoutes);
router.use('/admin', adminRoutes);

export default router;
