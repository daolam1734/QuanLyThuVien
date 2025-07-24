import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';

const MAX_EXTEND_TIMES = 1;
const EXTEND_DAYS = 15;
const DEFAULT_BORROW_DAYS = 20;
const MAX_BOOKS_PER_BORROW = 3;

// 📌 Tạo phiếu mượn sách
export const createBorrow = async (req, res) => {
  try {
    const { reader, books } = req.body;

    if (!reader || !books || books.length === 0) {
      return res.status(400).json({ message: 'Thiếu thông tin mượn sách.' });
    }

    const totalBooks = books.reduce((sum, item) => sum + item.quantity, 0);
    if (totalBooks > MAX_BOOKS_PER_BORROW) {
      return res.status(400).json({ message: `Chỉ được mượn tối đa ${MAX_BOOKS_PER_BORROW} quyển sách.` });
    }

    for (const item of books) {
      const book = await Book.findById(item.book);
      if (!book) return res.status(404).json({ message: 'Sách không tồn tại.' });
      if (book.quantity < item.quantity) {
        return res.status(400).json({ message: `Sách "${book.title}" không đủ số lượng.` });
      }
      book.quantity -= item.quantity;
      await book.save();
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + DEFAULT_BORROW_DAYS);

    const borrow = new Borrow({
      reader,
      books,
      borrowDate,
      dueDate,
      createdBy: req.user._id,
      status: 'borrowed',
    });

    await borrow.save();
    res.status(201).json({ message: 'Tạo phiếu mượn thành công', data: borrow });
  } catch (err) {
    res.status(400).json({ message: 'Tạo phiếu mượn thất bại', error: err.message });
  }
};

// 📌 Lấy danh sách phiếu mượn
export const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate('reader', 'readerCode fullName email')
      .populate('books.book', 'title author')
      .sort({ createdAt: -1 });

    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách mượn sách', error: err.message });
  }
};

// 📌 Trả sách
export const returnBooks = async (req, res) => {
  try {
    const { id } = req.params;

    const borrow = await Borrow.findById(id).populate('books.book');
    if (!borrow) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });

    if (borrow.status === 'returned') {
      return res.status(400).json({ message: 'Phiếu mượn đã được trả trước đó.' });
    }

    for (const item of borrow.books) {
      const book = await Book.findById(item.book._id);
      book.quantity += item.quantity;
      await book.save();
    }

    borrow.returnDate = new Date();
    borrow.status = 'returned';

    await borrow.save();
    res.json({ message: 'Trả sách thành công', data: borrow });
  } catch (err) {
    res.status(400).json({ message: 'Trả sách thất bại', error: err.message });
  }
};

// 📌 Gia hạn mượn sách
export const extendBorrow = async (req, res) => {
  try {
    const { id } = req.params;

    const borrow = await Borrow.findById(id);
    if (!borrow) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });

    // ✅ Bổ sung kiểm tra an toàn
    if (borrow.status !== 'borrowed') {
      return res.status(400).json({ message: 'Chỉ có thể gia hạn khi phiếu đang trong trạng thái mượn' });
    }

    if (!borrow.extendedTimes) {
      borrow.extendedTimes = 0;
    }

    if (borrow.extendedTimes >= MAX_EXTEND_TIMES) {
      return res.status(400).json({ message: `Đã vượt quá số lần gia hạn (${MAX_EXTEND_TIMES})` });
    }

    if (!borrow.dueDate) {
      return res.status(400).json({ message: 'Phiếu mượn không có hạn trả, không thể gia hạn' });
    }

    // ✅ Gia hạn hạn trả
    borrow.dueDate = new Date(borrow.dueDate.getTime() + EXTEND_DAYS * 24 * 60 * 60 * 1000);
    borrow.extendedTimes += 1;

    await borrow.save();

    res.json({ message: 'Gia hạn thành công', data: borrow });
  } catch (err) {
    console.error('❌ Lỗi gia hạn:', err);
    res.status(400).json({ message: 'Gia hạn thất bại', error: err.message });
  }
};

// 📌 Lấy tất cả phiếu mượn chưa trả của 1 độc giả
export const getBorrowsByReader = async (req, res) => {
  try {
    const { readerId } = req.params;
    const borrows = await Borrow.find({ reader: readerId, status: 'Đang mượn' }).populate('books.book');
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy phiếu mượn' });
  }
};

export const createBorrowRequest = async (req, res) => {
  try {
    const { books } = req.body; // [{ book: bookId, quantity: x }, ...]
    const readerId = req.user.id;

    // Kiểm tra sách còn đủ không
    for (const item of books) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({ message: `Sách với id ${item.book} không tồn tại.` });
      }
      if (book.quantity < item.quantity) {
        return res.status(400).json({
          message: `Sách "${book.title}" chỉ còn ${book.quantity} cuốn, không đủ để mượn ${item.quantity} cuốn.`,
        });
      }
    }

    // Tạo phiếu mượn mới
    const borrow = new Borrow({
      reader: readerId,
      books,
      createdBy: readerId,
    });

    await borrow.save();

    // TODO: Gửi thông báo cho thủ thư (qua WebSocket, email, hoặc hệ thống thông báo nội bộ)

    res.status(201).json({ message: 'Yêu cầu mượn sách đã được gửi thành công.', borrow });
  } catch (err) {
    console.error('Lỗi tạo phiếu mượn:', err);
    res.status(500).json({ message: 'Lỗi hệ thống khi tạo phiếu mượn.' });
  }
};

export const getMyBorrows = async (req, res) => {
  try {
    const readerId = req.user.id; // From verifyToken middleware
    const borrows = await Borrow.find({ reader: readerId })
      .populate('books.book') // Populate book info inside the borrow's books array
      .sort({ createdAt: -1 });
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sách đã mượn' });
  }
};