import express from 'express';
import { getReviewStudioData, addComment, updateCommentStatus, summarizeReviewWithAI } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/:contentId', getReviewStudioData);
router.post('/comment', addComment);
router.patch('/comment/:commentId/status', updateCommentStatus);
router.post('/:contentId/summarize', summarizeReviewWithAI);

export default router;
