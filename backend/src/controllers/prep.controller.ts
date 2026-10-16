import { Request, Response, NextFunction } from 'express';
import { PrepService } from '../services/prep.service';
import { TopicCategory } from '@prisma/client';

export class PrepController {
  static async getTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as TopicCategory | undefined;
      const topics = await PrepService.getTopics(category);
      return res.status(200).json({
        success: true,
        data: topics,
        message: 'Topics fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getTopicQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: topicId } = req.params;
      const userId = req.user?.id;
      const filters = {
        difficulty: req.query.difficulty as string | undefined,
        type: req.query.type as any,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
      };

      const result = await PrepService.getQuestionsByTopic(topicId, filters, userId);
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Questions fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getDsaOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const data = await PrepService.getDsaOverview(userId);
      return res.status(200).json({
        success: true,
        data,
        message: 'DSA overview fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getQuestionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const question = await PrepService.getQuestionById(id, userId);
      return res.status(200).json({
        success: true,
        data: question,
        message: 'Question detail fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getTopicNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: topicId } = req.params;
      const notes = await PrepService.getTopicNotes(topicId);
      return res.status(200).json({
        success: true,
        data: notes,
        message: 'Notes fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getCompanies(_req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await PrepService.getCompanies();
      return res.status(200).json({
        success: true,
        data: companies,
        message: 'Companies fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getCompanyBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const company = await PrepService.getCompanyBySlug(slug);
      return res.status(200).json({
        success: true,
        data: company,
        message: 'Company guide fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async toggleBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: questionId } = req.params;
      const userId = req.user!.id;
      const result = await PrepService.toggleBookmark(userId, questionId);
      return res.status(200).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getMyBookmarks(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const bookmarks = await PrepService.getBookmarks(userId);
      return res.status(200).json({
        success: true,
        data: bookmarks,
        message: 'Bookmarks fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }
}
