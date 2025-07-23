// src/routes/auth.routes.js
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Đăng ký tài khoản mới
router.post('/register', register); // POST /api/auth/register
router.post('/login', login);

export default router;
