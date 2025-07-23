import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

router.post('/create-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'admin@tvu.edu.vn' });
    if (existing) return res.status(400).json({ message: 'Admin đã tồn tại' });

    const hashedPassword = await bcrypt.hash('123456', 10);
    const newAdmin = new User({
      fullName: 'Admin TVU',
      email: 'admin@tvu.edu.vn',
      phone: '0900000000',
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Tạo admin thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tạo admin' });
  }
});

export default router;
