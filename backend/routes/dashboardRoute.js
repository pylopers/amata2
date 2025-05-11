// backend/routes/dashboardRoute.js
import express from 'express';
import {
  getDashboardStats,
  getFrequentUsers,
  downloadFrequentUsers
} from '../controllers/dashboardController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// main stats
router.get('/all', adminAuth, getDashboardStats);

// frequent users
router.get('/frequent-users', adminAuth, getFrequentUsers);
router.get('/frequent-users/download', adminAuth, downloadFrequentUsers);

export default router;
