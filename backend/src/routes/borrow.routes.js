import express from 'express';
import {
  createBorrow,
  getAllBorrows,
  returnBooks,
  extendBorrow,
  getBorrowsByReader,
  getMyBorrows,
} from '../controllers/borrow.controller.js';
import { verifyToken, isLibrarian } from '../middlewares/auth.middleware.js';
import Borrow from '../models/Borrow.js';

const router = express.Router();

// ===============================
// 📚 API Quản lý Phiếu Mượn Sách
// ===============================

// ✅ [GET] Lấy tất cả phiếu mượn (chỉ người đăng nhập)
router.get('/', verifyToken, getAllBorrows);

// ✅ [POST] Tạo phiếu mượn mới (chỉ thủ thư)
router.post('/', verifyToken, isLibrarian, createBorrow);

// ✅ [PUT] Trả sách (chỉ thủ thư)
router.put('/:id/return', verifyToken, isLibrarian, returnBooks);

// ✅ [PUT] Gia hạn mượn sách (chỉ thủ thư)
router.put('/:id/extend', verifyToken, isLibrarian, extendBorrow);

// ✅ [GET] Kiểm tra số lượng sách chưa trả của độc giả
// 📌 Ví dụ: /api/borrows/active/<readerId>
router.get('/active/:readerId', verifyToken, async (req, res) => {
  try {
    const { readerId } = req.params;

    const activeBorrows = await Borrow.find({
      reader: readerId,
      returned: false,
    });

    const borrowedBooksCount = activeBorrows.reduce((total, borrow) => {
      const count = borrow.books.reduce((sum, item) => sum + item.quantity, 0);
      return total + count;
    }, 0);

    res.json({ borrowedBooksCount });
  } catch (err) {
    console.error('❌ Lỗi kiểm tra sách chưa trả:', err.message);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});
  router.get('/reader/:readerId', verifyToken, getBorrowsByReader);
  // Route lấy sách đã mượn của user hiện tại
router.get('/my-borrows', verifyToken, getMyBorrows);

export default router;
