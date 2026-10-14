import express from 'express';
import { getBlueprints, getBlueprintById, createBlueprint, assignToProducer, improveHookWithAI } from '../controllers/blueprintController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/', getBlueprints);
router.get('/:id', getBlueprintById);
router.post('/', createBlueprint);
router.post('/:id/assign', assignToProducer);
router.post('/improve-hook', improveHookWithAI);

export default router;
