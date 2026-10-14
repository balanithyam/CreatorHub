import express from 'express';
import { getAdminOverview, getAllUsers, updateUserRole, toggleUserStatus } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.use(protect);
router.use(authorizeRoles('ADMIN'));

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', toggleUserStatus);

export default router;
