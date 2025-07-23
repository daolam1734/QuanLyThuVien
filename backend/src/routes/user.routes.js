import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  getCurrentUser,
  getAllReaders,
  updateReaderById,
  deleteReaderById,
} from '../controllers/user.controller.js';

import { verifyToken } from '../middlewares/auth.middleware.js';
import uploadAvatar from '../middlewares/uploadAvatar.js';

const router = express.Router();

// Hồ sơ người dùng hiện tại
router.get('/me', verifyToken, getProfile);
router.put('/me', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);
router.put('/avatar', verifyToken, uploadAvatar.single('avatar'), updateAvatar);
router.get('/current', verifyToken, getCurrentUser);

// 📚 Quản lý Độc giả (Reader)
router.get('/readers', verifyToken, getAllReaders); // ✅ Danh sách độc giả
router.put('/readers/:id', verifyToken, updateReaderById); // ✅ Sửa độc giả
router.delete('/readers/:id', verifyToken, deleteReaderById); // ✅ Xoá độc giả

export default router;
