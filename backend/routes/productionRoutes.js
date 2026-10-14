import express from 'express';
import { getProductionWorkspaces, getContentDetails, updateChecklist, uploadAsset, uploadNewVersion, restoreVersion } from '../controllers/productionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();
router.use(protect);
router.get('/', getProductionWorkspaces);
router.get('/:id', getContentDetails);
router.patch('/version/:versionId/checklist', updateChecklist);
router.post('/asset', upload.single('file'), uploadAsset);
router.post('/version', upload.single('file'), uploadNewVersion);
router.post('/version/:versionId/restore', restoreVersion);

export default router;
