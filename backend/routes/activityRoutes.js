import express from 'express';
import { getWorkspaceActivity } from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/', getWorkspaceActivity);

export default router;
