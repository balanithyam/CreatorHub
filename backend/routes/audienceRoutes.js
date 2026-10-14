import express from 'express';
import { getAudienceFeed, convertFeedbackToIdea, summarizeAudienceWithAI } from '../controllers/audienceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/', getAudienceFeed);
router.post('/:feedbackId/convert', convertFeedbackToIdea);
router.post('/summarize', summarizeAudienceWithAI);

export default router;
