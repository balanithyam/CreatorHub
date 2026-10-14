import express from 'express';
import { getContentFamilyTree, createDerivativeContent, findReusableSectionsWithAI, auditFreshnessWithAI } from '../controllers/contentFamilyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/', getContentFamilyTree);
router.get('/tree', getContentFamilyTree);
router.get('/tree/:parentId', getContentFamilyTree);
router.post('/derivative', createDerivativeContent);
router.post('/reusable', findReusableSectionsWithAI);
router.post('/audit-freshness', auditFreshnessWithAI);

export default router;
