import express from 'express';
import { getResearchList, createResearch, summarizeResearchWithAI, deleteResearch } from '../controllers/researchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/', getResearchList);
router.post('/', createResearch);
router.post('/:id/summarize', summarizeResearchWithAI);
router.delete('/:id', deleteResearch);

export default router;
