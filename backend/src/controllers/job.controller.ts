import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service';

export class JobController {
  static async listJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await JobService.listJobs(req.query as any, req.user?.id);
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Jobs fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const job = await JobService.getJobById(id, userId);
      return res.status(200).json({
        success: true,
        data: job,
        message: 'Job details fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = req.user!.id;
      const job = await JobService.createJob(recruiterId, req.body);
      return res.status(201).json({
        success: true,
        data: job,
        message: 'Job created successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const recruiterId = req.user!.id;
      const isAdmin = req.user!.role === 'ADMIN';
      const job = await JobService.updateJob(id, recruiterId, req.body, isAdmin);
      return res.status(200).json({
        success: true,
        data: job,
        message: 'Job updated successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const recruiterId = req.user!.id;
      const isAdmin = req.user!.role === 'ADMIN';
      const result = await JobService.deleteJob(id, recruiterId, isAdmin);
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Job deleted successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async toggleSaveJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const result = await JobService.toggleSaveJob(userId, id);
      return res.status(200).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getSavedJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const jobs = await JobService.getSavedJobs(userId);
      return res.status(200).json({
        success: true,
        data: jobs,
        message: 'Saved jobs fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }
}
