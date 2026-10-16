import { Request, Response, NextFunction } from 'express';
import { RecruiterService } from '../services/recruiter.service';

export class RecruiterController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = req.user!.id;
      const stats = await RecruiterService.getRecruiterStats(recruiterId);
      return res.status(200).json({
        success: true,
        data: stats,
        message: 'Recruiter statistics retrieved successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getMyJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = req.user!.id;
      const jobs = await RecruiterService.getMyPostedJobs(recruiterId);
      return res.status(200).json({
        success: true,
        data: jobs,
        message: 'Posted jobs retrieved successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createOrUpdateCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = req.user!.id;
      const { company, created } = await RecruiterService.createOrUpdateCompany(recruiterId, req.body);
      return res.status(created ? 201 : 200).json({
        success: true,
        data: company,
        message: created ? 'Company profile created successfully' : 'Company profile updated successfully',
      });
    } catch (error) {
      return next(error);
    }
  }
}
