import mongoose from 'mongoose';
import Violation from '../models/Violation.js';
import User from '../models/User.js'; // ✅ Model người dùng

// 📌 Tạo vi phạm mới
export const createViolation = async (req, res) => {
  try {
    const { readerId, violationType, description, fineAmount } = req.body;

    // 🧪 Kiểm tra ObjectId
    if (!mongoose.Types.ObjectId.isValid(readerId)) {
      return res.status(400).json({ message: 'ID độc giả không hợp lệ' });
    }

    // 🔍 Kiểm tra độc giả tồn tại và đúng role
    const reader = await User.findOne({ _id: readerId, role: 'reader' });
    if (!reader) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả hợp lệ' });
    }

    // 💵 Kiểm tra số tiền phạt
    if (fineAmount < 0) {
      return res.status(400).json({ message: 'Số tiền phạt không được âm' });
    }

    // 🆕 Tạo vi phạm
    const violation = await Violation.create({
      reader: readerId,
      violationType,
      description,
      fineAmount,
      status: 'unpaid',
    });

    // 📌 Populate để trả về đầy đủ
    const populatedViolation = await violation.populate('reader', 'fullName readerCode');

    res.status(201).json({ message: 'Tạo vi phạm thành công', data: populatedViolation });
  } catch (err) {
    res.status(400).json({ message: 'Tạo vi phạm thất bại', error: err.message });
  }
};

// 📌 Lấy danh sách vi phạm
export const getViolations = async (req, res) => {
  try {
    const violations = await Violation.find()
      .populate('reader', 'fullName readerCode')
      .sort({ createdAt: -1 });

    res.json({ data: violations });
  } catch (err) {
    res.status(500).json({ message: 'Không thể lấy danh sách vi phạm', error: err.message });
  }
};

// 📌 Xoá vi phạm
export const deleteViolation = async (req, res) => {
  try {
    const deleted = await Violation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy vi phạm' });
    }
    res.json({ message: 'Xoá vi phạm thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Xoá thất bại', error: err.message });
  }
};

export const payViolation = async (req, res) => {
  const { id } = req.params;
  try {
    const violation = await Violation.findById(id);
    if (!violation) return res.status(404).json({ message: 'Không tìm thấy vi phạm' });

    violation.status = 'paid'; // cập nhật trạng thái đã nộp
    await violation.save();

    res.json({ message: 'Cập nhật trạng thái thành công', violation });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái', error });
  }
};