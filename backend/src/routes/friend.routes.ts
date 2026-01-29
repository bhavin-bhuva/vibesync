import { Router } from 'express';
import { FriendController } from '../controllers/friend.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();
const friendController = new FriendController();

// All friend routes require authentication
router.use(authenticate as any);

// Validation schemas
const sendFriendRequestSchema = z.object({
  friendCode: z.string().length(17, 'Friend code must be exactly 17 characters'),
});

// Routes
router.get('/', friendController.getFriends.bind(friendController) as any);
router.post('/request', validate(sendFriendRequestSchema), friendController.sendFriendRequest.bind(friendController) as any);
router.get('/requests', friendController.getPendingRequests.bind(friendController) as any);
router.put('/request/:id/accept', friendController.acceptFriendRequest.bind(friendController) as any);
router.put('/request/:id/decline', friendController.declineFriendRequest.bind(friendController) as any);
router.delete('/:id', friendController.removeFriend.bind(friendController) as any);

export default router;
