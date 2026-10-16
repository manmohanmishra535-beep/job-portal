import { Router } from 'express';
import { PrepController } from '../controllers/prep.controller';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// GET /topics?category=DSA - Topics by category (cached)
router.get('/topics', optionalAuth, PrepController.getTopics);

// GET /dsa/overview - Aggregated DSA progress (per section + difficulty)
router.get('/dsa/overview', optionalAuth, PrepController.getDsaOverview);

// GET /topics/:id/questions - Questions of a topic (filters: difficulty, status)
router.get('/topics/:id/questions', optionalAuth, PrepController.getTopicQuestions);

// GET /questions/:id - Question detail
router.get('/questions/:id', optionalAuth, PrepController.getQuestionById);

// GET /topics/:id/notes - Notes of a topic
router.get('/topics/:id/notes', optionalAuth, PrepController.getTopicNotes);

// GET /companies - Company guides list
router.get('/companies', optionalAuth, PrepController.getCompanies);

// GET /companies/:slug - Hiring process and interview prep for company
router.get('/companies/:slug', optionalAuth, PrepController.getCompanyBySlug);

// POST /questions/:id/bookmark - Bookmark/unbookmark a question
router.post('/questions/:id/bookmark', requireAuth, requireRole(Role.USER), PrepController.toggleBookmark);

// GET /questions/bookmarks/me - List candidate bookmarked questions
router.get('/bookmarks/me', requireAuth, requireRole(Role.USER), PrepController.getMyBookmarks);

export default router;
