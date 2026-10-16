import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const profile = await UserService.getProfile(userId);
      return res.status(200).json({
        success: true,
        data: profile,
        message: 'Profile retrieved successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updated = await UserService.updateProfile(userId, req.body);
      return res.status(200).json({
        success: true,
        data: updated,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async uploadResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { resumeUrl } = req.body;
      if (!resumeUrl) {
        return res.status(400).json({
          success: false,
          message: 'resumeUrl is required in request body',
          errors: ['Missing resumeUrl'],
        });
      }
      const updated = await UserService.updateResume(userId, resumeUrl);
      return res.status(200).json({
        success: true,
        data: updated,
        message: 'Resume saved to profile',
      });
    } catch (error) {
      return next(error);
    }
  }
}
