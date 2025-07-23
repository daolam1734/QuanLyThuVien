import express from 'express';
import {
  createBorrow,
  getAllBorrows,
  returnBooks,
  extendBorrow,
} from '../controllers/borrow.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 📌 Lấy tất cả phiếu mượn
router.get('/', verifyToken, getAllBorrows);

// 📌 Tạo phiếu mượn mới
router.post('/', verifyToken, createBorrow);

// 📌 Trả sách
router.put('/:id/return', verifyToken, returnBooks);

// 📌 Gia hạn mượn sách
router.put('/:id/extend', verifyToken, extendBorrow);

export default router;
