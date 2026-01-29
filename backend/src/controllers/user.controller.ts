import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const user = await userService.getUserById(req.user.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const { name, status, avatar } = req.body;
      const user = await userService.updateProfile(req.user.userId, {
        name,
        status,
        avatar,
      });

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
