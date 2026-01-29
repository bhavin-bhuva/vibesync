import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { env } from '../config/env';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register(name, email, password);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already exists') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'EMAIL_EXISTS',
            message: error.message,
          },
        });
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid email or password') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: error.message,
          },
        });
      }
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as any; // Type assertion since Express.User might not be fully typed yet

      if (!user) {
        throw new Error('User not found after Google Auth');
      }

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      const refreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      // Redirect to frontend with tokens
      // Ensure CORS_ORIGIN does not have trailing slash
      const frontendUrl = env.CORS_ORIGIN.replace(/\/$/, '');
      res.redirect(`${frontendUrl}/auth/google/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
      next(error);
    }
  }
}
