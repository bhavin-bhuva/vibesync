import express, { Router } from 'express';
import { ConversationController } from '../controllers/conversation.controller';
import { MessageController } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const conversationController = new ConversationController();
const messageController = new MessageController();

router.use(authenticate as express.RequestHandler);

// Conversations
router.get('/', conversationController.listConversations as express.RequestHandler);
router.post('/', conversationController.createConversation as express.RequestHandler);
router.get('/:id', conversationController.getConversation as express.RequestHandler);

// Messages (nested under conversations usually, or separate. Let's keep nested REST style here)
router.get('/:id/messages', messageController.getMessages as express.RequestHandler);
router.post('/:id/messages', messageController.sendMessage as express.RequestHandler);

export default router;
