import express from 'express';
import {
  getAllReaders,
  updateReaderById,
  deleteReaderById,
} from '../controllers/user.controller.js';

import {
  verifyToken,
  isAdminOrLibrarian,
  isLibrarian,
} from '../middlewares/auth.middleware.js';

const router = express.Router();

// 📚 Lấy danh sách độc giả (Admin + Thủ thư)
router.get('/', verifyToken, isAdminOrLibrarian, getAllReaders);

// ✅ Cập nhật thông tin độc giả (Thủ thư)
router.put('/:id', verifyToken, isLibrarian, updateReaderById);

// ❌ Xoá độc giả (Thủ thư)
router.delete('/:id', verifyToken, isLibrarian, deleteReaderById);

export default router;
