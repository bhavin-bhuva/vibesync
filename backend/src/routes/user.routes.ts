import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();
const userController = new UserController();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  status: z.string().max(100).optional(),
  avatar: z.string().url().optional(),
});

router.get('/me', authenticate as any, userController.getMe.bind(userController) as any);
router.put('/me', authenticate as any, validate(updateProfileSchema), userController.updateProfile.bind(userController) as any);

export default router;
