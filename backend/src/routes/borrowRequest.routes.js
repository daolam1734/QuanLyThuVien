import express from 'express';
import {
  createBorrowRequest,
  getAllBorrowRequests,
  approveBorrowRequest,
  rejectBorrowRequest,
} from '../controllers/borrowRequest.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, createBorrowRequest);
router.get('/', verifyToken, getAllBorrowRequests);
router.patch('/:id/approve', verifyToken, approveBorrowRequest);
router.patch('/:id/reject', verifyToken, rejectBorrowRequest);
router.post('/', verifyToken, createBorrowRequest);
export default router;
