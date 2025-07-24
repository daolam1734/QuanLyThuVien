import BorrowRequest from '../models/borrowRequest.model.js';
import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';

export const getAllBorrowRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find()
      .populate('book')
      .populate('reader');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

export const createBorrowRequest = async (req, res) => {
  try {
    const { book, quantity } = req.body;
    const reader = req.user.id;

    if (!book || !reader) {
      return res.status(400).json({ message: 'Thiếu thông tin book hoặc reader' });
    }

    const borrowRequest = new BorrowRequest({
      book,
      reader,
      quantity: quantity || 1, // default 1 nếu không truyền
    });

    await borrowRequest.save();
    res.status(201).json(borrowRequest);
  } catch (err) {
    console.error('❌ Lỗi tạo yêu cầu mượn:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
export const approveBorrowRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const librarianId = req.user._id; // 👈 từ middleware verifyToken
    const request = await BorrowRequest.findById(id).populate('book reader');

    if (!request) return res.status(404).json({ message: 'Không tìm thấy yêu cầu' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Yêu cầu đã được xử lý' });

    const book = await Book.findById(request.book._id);
    if (!book || book.availableQuantity < request.quantity) {
      return res.status(400).json({ message: 'Sách không đủ số lượng' });
    }

    // Tạo phiếu mượn thật
    const borrow = await Borrow.create({
      reader: request.reader._id,
      books: [{ book: request.book._id, quantity: request.quantity }],
      createdBy: librarianId,
    });

    // Trừ số lượng sách
    book.availableQuantity -= request.quantity;
    await book.save();

    // Cập nhật yêu cầu
    request.status = 'approved';
    request.processedAt = new Date();
    request.processedBy = librarianId;
    await request.save();

    res.status(200).json({ message: 'Đã duyệt yêu cầu', borrow });
  } catch (err) {
    console.error('Lỗi duyệt yêu cầu:', err);
    res.status(500).json({ message: 'Lỗi xử lý yêu cầu' });
  }
};

export const rejectBorrowRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await BorrowRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Không tìm thấy yêu cầu' });

    request.status = 'rejected';
    request.processedAt = new Date();
    request.processedBy = req.user._id;

    await request.save();

    res.json({ message: 'Đã từ chối yêu cầu mượn' });
  } catch (err) {
    console.error('Lỗi từ chối yêu cầu:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
