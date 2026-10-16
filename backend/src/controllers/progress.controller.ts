import { Request, Response, NextFunction } from 'express';
import { ProgressService } from '../services/progress.service';

export class ProgressController {
  static async updateQuestionProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: questionId } = req.params;
      const userId = req.user!.id;
      const { status } = req.body;
      const progress = await ProgressService.updateQuestionProgress(userId, questionId, status);
      return res.status(200).json({
        success: true,
        data: progress,
        message: 'Question progress updated',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getMyProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const progress = await ProgressService.getMyProgress(userId);
      return res.status(200).json({
        success: true,
        data: progress,
        message: 'Progress metrics calculated successfully',
      });
    } catch (error) {
      return next(error);
    }
  }
}
