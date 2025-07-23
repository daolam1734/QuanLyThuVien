import express from 'express';
import {
  getStats,
  getLibrarians,
  createLibrarian,
  updateLibrarian,
  deleteLibrarian
} from '../controllers/admin.controller.js';

import { verifyToken } from '../middlewares/auth.middleware.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

// 📊 Thống kê
router.get('/stats', verifyToken, isAdmin, getStats);

// 📋 Quản lý thủ thư
router.get('/librarians', verifyToken, isAdmin, getLibrarians);
router.post('/librarians', verifyToken, isAdmin, createLibrarian);
router.put('/librarians/:id', verifyToken, isAdmin, updateLibrarian);
router.delete('/librarians/:id', verifyToken, isAdmin, deleteLibrarian);

export default router;
