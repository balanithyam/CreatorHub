import express from 'express';
import { getIdeas, createIdea, updateIdea, updateStageAndOrder, refineIdeaWithAI, deleteIdea } from '../controllers/ideaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/', getIdeas);
router.post('/', createIdea);
router.put('/:id', updateIdea);
router.patch('/:id/stage', updateStageAndOrder);
router.post('/:id/refine', refineIdeaWithAI);
router.delete('/:id', deleteIdea);

export default router;
