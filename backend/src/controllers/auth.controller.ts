import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async handleClerkWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const headers = {
        'svix-id': req.headers['svix-id'] as string,
        'svix-timestamp': req.headers['svix-timestamp'] as string,
        'svix-signature': req.headers['svix-signature'] as string,
      };

      const result = await AuthService.handleWebhook(headers, req.body);
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Clerk webhook processed successfully',
      });
    } catch (error) {
      return next(error);
    }
  }
}
