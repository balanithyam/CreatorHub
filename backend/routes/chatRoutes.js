import express from 'express';
import { handleChatQuery } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.post('/message', handleChatQuery);

export default router;
