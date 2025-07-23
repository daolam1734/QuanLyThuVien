import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Xác thực token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không có token xác thực' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }

    // Gắn thông tin người dùng vào request
    req.user = {
      id: user._id,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// Middleware: chỉ cho phép Admin
export const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Chỉ quản trị viên mới được phép truy cập' });
};

// Middleware: cho Admin hoặc Thủ thư
export const isAdminOrLibrarian = (req, res, next) => {
  console.log('Role:', req.user.role); // 👈 Debug role
  if (req.user.role === 'admin' || req.user.role === 'librarian') {
    next();
  } else {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
  }
};

export const isLibrarian = (req, res, next) => {
  if (req.user.role !== 'librarian') {
    return res.status(403).json({ message: 'Chỉ thủ thư mới được thực hiện thao tác này' });
  }
  next();
};

