import Book from '../models/Book.js';
import Borrow from '../models/Borrow.js';
import fs from 'fs';
import path from 'path';

// 📚 Lấy danh sách tất cả sách kèm số lượng đang được mượn
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    const activeBorrows = await Borrow.find({ status: { $ne: 'returned' } });

    const borrowedMap = new Map();
    activeBorrows.forEach((borrow) => {
      borrow.books.forEach((b) => {
        const bookId = b.book.toString();
        borrowedMap.set(bookId, (borrowedMap.get(bookId) || 0) + b.quantity);
      });
    });

    const booksWithBorrowed = books.map((book) => ({
      ...book.toObject(),
      currentlyBorrowed: borrowedMap.get(book._id.toString()) || 0,
    }));

    res.json(booksWithBorrowed);
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách sách:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sách' });
  }
};

// ➕ Tạo mới sách
export const createBook = async (req, res) => {
  try {
    let bookCode = req.body.bookCode?.trim()?.toUpperCase();

    if (!bookCode) {
      const latestBook = await Book.findOne().sort({ createdAt: -1 });
      const lastCodeNumber = latestBook?.bookCode?.match(/\d+/)?.[0];
      const nextNumber = lastCodeNumber ? parseInt(lastCodeNumber) + 1 : 1;
      bookCode = 'BK' + String(nextNumber).padStart(3, '0');
    }

    const existing = await Book.findOne({ bookCode });
    if (existing) {
      return res.status(400).json({ message: 'Mã sách đã tồn tại' });
    }

    const newBook = new Book({
      bookCode,
      title: req.body.title?.trim(),
      author: req.body.author?.trim(),
      category: req.body.category?.trim(),
      publisher: req.body.publisher?.trim(),
      year: req.body.year ? Number(req.body.year) : undefined,
      description: req.body.description?.trim(),
      quantity: req.body.quantity ? Number(req.body.quantity) : 0,
      coverImage: req.file?.filename || null,
      createdBy: req.user?.id || null,
    });

    const saved = await newBook.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Lỗi khi tạo sách:', err.message);
    res.status(400).json({ message: 'Lỗi tạo sách', error: err.message });
  }
};

// 📝 Cập nhật sách
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Sách không tồn tại' });

    const newQuantity = Number(req.body.quantity) || 0;

    const borrows = await Borrow.find({ 'books.book': book._id, status: { $ne: 'returned' } });
    const borrowedCount = borrows.reduce((total, borrow) => {
      const match = borrow.books.find(b => b.book.toString() === book._id.toString());
      return match ? total + match.quantity : total;
    }, 0);

    if (newQuantity < borrowedCount) {
      return res.status(400).json({
        message: `Không thể giảm số lượng sách xuống ${newQuantity}. Hiện đang có ${borrowedCount} sách đang được mượn.`,
      });
    }

    if (req.file && book.coverImage) {
      const oldPath = path.join('uploads/covers', book.coverImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updates = {
      title: req.body.title?.trim(),
      author: req.body.author?.trim(),
      category: req.body.category?.trim(),
      publisher: req.body.publisher?.trim(),
      year: req.body.year ? Number(req.body.year) : undefined,
      description: req.body.description?.trim(),
      quantity: newQuantity,
      ...(req.file && { coverImage: req.file.filename }),
    };

    const updated = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('❌ Lỗi cập nhật sách:', err.message);
    res.status(400).json({ message: 'Cập nhật sách thất bại', error: err.message });
  }
};

// ❌ Xóa sách (kèm kiểm tra đang mượn + xóa ảnh bìa nếu có)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Sách không tồn tại' });
    }

    // 📦 Kiểm tra sách đang được mượn chưa
    const isBorrowed = await Borrow.exists({
      'books.book': book._id,
      status: { $ne: 'returned' },
    });

    if (isBorrowed) {
      return res.status(400).json({ message: 'Sách đang được mượn, không thể xóa' });
    }

    // 🖼️ Xóa ảnh bìa nếu có
    if (book.coverImage) {
      try {
        const imgPath = path.resolve('uploads/covers', book.coverImage);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
          console.log(`🧹 Đã xóa ảnh bìa: ${book.coverImage}`);
        } else {
          console.warn('⚠️ File ảnh không tồn tại:', imgPath);
        }
      } catch (err) {
        console.error('❌ Lỗi khi xóa ảnh bìa:', err.message);
      }
    }

    // 🗑️ Xóa sách khỏi DB
    await Book.findByIdAndDelete(book._id);
    res.json({ message: 'Đã xóa sách và ảnh bìa (nếu có)' });
  } catch (error) {
    console.error('❌ Lỗi khi xóa sách:', error.message);
    res.status(500).json({ message: 'Lỗi khi xóa sách', error: error.message });
  }
};

// 📊 Thống kê sách
export const getBookSummary = async (req, res) => {
  try {
    const totalTitles = await Book.countDocuments();
    const books = await Book.find();
    const totalInStock = books.reduce((sum, book) => sum + book.quantity, 0);

    const activeBorrows = await Borrow.find({ status: { $ne: 'returned' } });

    let totalBorrowedBooks = 0;
    activeBorrows.forEach((borrow) => {
      borrow.books.forEach((b) => {
        totalBorrowedBooks += b.quantity;
      });
    });

    const totalAvailableBooks = totalInStock - totalBorrowedBooks;

    res.json({
      totalTitles,
      totalInStock,
      totalBorrowedBooks,
      totalAvailableBooks,
    });
  } catch (error) {
    console.error('❌ Lỗi khi lấy thống kê sách:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy thống kê sách', error: error.message });
  }
};
