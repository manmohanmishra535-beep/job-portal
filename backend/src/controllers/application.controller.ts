import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';

export class ApplicationController {
  static async applyToJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: jobId } = req.params;
      const userId = req.user!.id;
      const application = await ApplicationService.applyToJob(jobId, userId, req.body);
      return res.status(201).json({
        success: true,
        data: application,
        message: 'Application submitted successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getCandidateApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const applications = await ApplicationService.getCandidateApplications(userId);
      return res.status(200).json({
        success: true,
        data: applications,
        message: 'Applications retrieved successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getJobApplicantsForRecruiter(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: jobId } = req.params;
      const recruiterId = req.user!.id;
      const applicants = await ApplicationService.getJobApplicantsForRecruiter(jobId, recruiterId);
      return res.status(200).json({
        success: true,
        data: applicants,
        message: 'Applicants retrieved successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateApplicationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: applicationId } = req.params;
      const recruiterId = req.user!.id;
      const { status } = req.body;
      const updated = await ApplicationService.updateStatus(applicationId, recruiterId, status);
      return res.status(200).json({
        success: true,
        data: updated,
        message: `Application status updated to ${status}`,
      });
    } catch (error) {
      return next(error);
    }
  }
}
