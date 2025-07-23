import bcrypt from 'bcryptjs';
import Book from '../models/Book.js';
import User from '../models/User.js';
import Borrow from '../models/Borrow.js';

// GET danh sách thủ thư
export const getLibrarians = async (req, res) => {
  try {
    const librarians = await User.find({ role: 'librarian' }).select('-password');
    res.json(librarians);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách thủ thư' });
  }
};

// POST tạo mới thủ thư
export const createLibrarian = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashed,
      role: 'librarian',
    });

    await newUser.save();
    res.status(201).json({ message: 'Thêm thủ thư thành công' });
  } catch (err) {
    console.error('Lỗi tạo thủ thư:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// PUT cập nhật thủ thư
export const updateLibrarian = async (req, res) => {
  const { id } = req.params;
  const { fullName, phone, password } = req.body;

  try {
    const updateData = { fullName, phone };

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await User.findByIdAndUpdate(id, updateData);
    res.json({ message: 'Cập nhật thủ thư thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật thủ thư' });
  }
};

// DELETE xóa thủ thư
export const deleteLibrarian = async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.json({ message: 'Xóa thủ thư thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa thủ thư' });
  }
};

// GET thống kê
export const getStats = async (req, res) => {
  try {
    const bookCount = await Book.countDocuments();
    const readerCount = await User.countDocuments({ role: 'reader' });
    const librarianCount = await User.countDocuments({ role: 'librarian' });
    const borrowCount = await Borrow.countDocuments();

    res.json({
      totalBooks: bookCount,
      totalReaders: readerCount,
      totalLibrarians: librarianCount,
      totalBorrowed: borrowCount,
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy thống kê' });
  }
};
