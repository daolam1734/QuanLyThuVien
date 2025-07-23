import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// ✅ GET /users/me
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// ✅ PUT /users/me
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, email, phone },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Cập nhật thất bại' });
  }
};

// ✅ PUT /users/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi đổi mật khẩu' });
  }
};

// ✅ PUT /users/avatar
export const updateAvatar = async (req, res) => {
  try {
    const avatarFileName = req.file?.filename;
    if (!avatarFileName) {
      return res.status(400).json({ message: 'Không tìm thấy tệp ảnh' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    if (user.avatar) {
      const oldPath = path.join('uploads/avatars', user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.avatar = avatarFileName;
    await user.save();

    res.json({
      message: 'Cập nhật avatar thành công',
      avatar: avatarFileName,
    });
  } catch (error) {
    console.error('❌ Lỗi cập nhật avatar:', error.message);
    res.status(500).json({ message: 'Lỗi cập nhật avatar' });
  }
};

// ✅ GET /users/current
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách độc giả (reader)
export const getAllReaders = async (req, res) => {
  const { search = '', page = 1, limit = 8 } = req.query;

  try {
    const query = {
      role: 'reader',
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { readerCode: { $regex: search, $options: 'i' } },
      ],
    };

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const readers = await User.find(query)
      .select('readerCode fullName email phone address dob createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ data: readers, totalPages });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách độc giả', error });
  }
};

// ✅ Sửa thông tin độc giả
export const updateReaderById = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, address, dob } = req.body;

  try {
    const updatedReader = await User.findByIdAndUpdate(
      id,
      { fullName, email, phone, address, dob },
      { new: true, runValidators: true }
    );

    if (!updatedReader) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }

    res.status(200).json({
      message: 'Cập nhật thành công',
      reader: updatedReader,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật độc giả', error });
  }
};

// ✅ Xoá độc giả
export const deleteReaderById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReader = await User.findByIdAndDelete(id);

    if (!deletedReader) {
      return res.status(404).json({ message: 'Không tìm thấy độc giả' });
    }

    res.status(200).json({ message: 'Xoá độc giả thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi xoá độc giả', error });
  }
};