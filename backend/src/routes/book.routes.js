// 📁 backend/src/routes/book.routes.js

import express from 'express';
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookSummary,
} from '../controllers/book.controller.js';

import { verifyToken } from '../middlewares/auth.middleware.js';
import isLibrarian from '../middlewares/isLibrarian.js';
import uploadCover from '../middlewares/uploadCover.js';

const router = express.Router();

/* ---------- 📖 PUBLIC ROUTES ---------- */
router.get('/public', getAllBooks); // ✅ Public route

/* ---------- 🔐 PROTECTED ROUTES ---------- */
router.get('/', verifyToken, getAllBooks); // shared
router.get('/summary', verifyToken, getBookSummary);
router.get('/manage', verifyToken, isLibrarian, getAllBooks);

router.post(
  '/',
  verifyToken,
  isLibrarian,
  uploadCover.single('coverImage'),
  createBook
);

router.put(
  '/:id',
  verifyToken,
  isLibrarian,
  uploadCover.single('coverImage'),
  updateBook
);

router.delete('/:id', verifyToken, isLibrarian, deleteBook);

export default router;
