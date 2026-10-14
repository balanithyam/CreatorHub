import express from 'express';
import { getDiscoverFeed, saveSource, getSavedSources, importSourceUrl } from '../controllers/feedController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/', getDiscoverFeed);
router.get('/trends', getDiscoverFeed);
router.get('/discover', getDiscoverFeed);
router.get('/feed', getDiscoverFeed);
router.post('/import-url', importSourceUrl);
router.post('/save', saveSource);
router.get('/saved', getSavedSources);

export default router;
