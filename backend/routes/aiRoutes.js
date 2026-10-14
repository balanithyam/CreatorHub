import express from 'express';
import {
  handleExplainTopic,
  handleSummarizeResearch,
  handleRefineIdea,
  handleImproveHook,
  handleTitlesAndThumbnails,
  handleShortScript,
  handleSummarizeFeedback,
  handleFindReusable,
  handleAuditFreshness,
  handleAiGenerate,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/explain', handleExplainTopic);
router.post('/summarize-research', handleSummarizeResearch);
router.post('/refine-idea', handleRefineIdea);
router.post('/improve-hook', handleImproveHook);
router.post('/titles-thumbnails', handleTitlesAndThumbnails);
router.post('/short-script', handleShortScript);
router.post('/summarize-feedback', handleSummarizeFeedback);
router.post('/find-reusable', handleFindReusable);
router.post('/audit-freshness', handleAuditFreshness);
router.post('/generate', handleAiGenerate);

export default router;
