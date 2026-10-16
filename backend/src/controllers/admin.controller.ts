import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { Role } from '@prisma/client';

export class AdminController {
  static async getPlatformStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getPlatformStats();
      return res.status(200).json({
        success: true,
        data: stats,
        message: 'Platform statistics retrieved successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const role = req.query.role as Role | undefined;

      const result = await AdminService.listUsers(page, limit, role);
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Users retrieved successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async changeUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.params;
      const { role } = req.body;
      const updated = await AdminService.changeUserRole(userId, role);
      return res.status(200).json({
        success: true,
        data: updated,
        message: `User role changed to ${role}`,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async setCompanyApproval(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: companyId } = req.params;
      const { isApproved } = req.body;
      const updated = await AdminService.setCompanyApproval(companyId, isApproved);
      return res.status(200).json({
        success: true,
        data: updated,
        message: isApproved ? 'Recruiter company approved' : 'Recruiter company blocked',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await AdminService.createTopic(req.body);
      return res.status(201).json({
        success: true,
        data: topic,
        message: 'Topic created successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await AdminService.createQuestion(req.body);
      return res.status(201).json({
        success: true,
        data: question,
        message: 'Question created successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: questionId } = req.params;
      const question = await AdminService.updateQuestion(questionId, req.body);
      return res.status(200).json({
        success: true,
        data: question,
        message: 'Question updated successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: questionId } = req.params;
      const result = await AdminService.deleteQuestion(questionId);
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Question deleted successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createCompanyGuide(req: Request, res: Response, next: NextFunction) {
    try {
      const guide = await AdminService.createCompanyGuide(req.body);
      return res.status(201).json({
        success: true,
        data: guide,
        message: 'Company guide created successfully',
      });
    } catch (error) {
      return next(error);
    }
  }
}
