import { Request, Response, NextFunction } from 'express';
import { QuizService } from '../services/quiz.service';

export class QuizController {
  static async listQuizzes(_req: Request, res: Response, next: NextFunction) {
    try {
      const quizzes = await QuizService.listQuizzes();
      return res.status(200).json({
        success: true,
        data: quizzes,
        message: 'Quizzes fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getQuizById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const quiz = await QuizService.getQuizById(id);
      return res.status(200).json({
        success: true,
        data: quiz,
        message: 'Quiz questions fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async submitQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const result = await QuizService.submitQuiz(id, userId, req.body);
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Quiz submitted and evaluated successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getMyAttempts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const attempts = await QuizService.getCandidateAttempts(userId);
      return res.status(200).json({
        success: true,
        data: attempts,
        message: 'Past quiz attempts fetched successfully',
      });
    } catch (error) {
      return next(error);
    }
  }
}
