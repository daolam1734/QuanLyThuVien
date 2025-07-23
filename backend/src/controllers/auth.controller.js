import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const generateReaderCode = async () => {
  const count = await User.countDocuments({ role: 'reader' });
  return 'DG' + String(count + 1).padStart(4, '0'); // VD: DG0001
};

const generateUniqueReaderCode = async () => {
  let code;
  let exists = true;
  let count = await User.countDocuments({ role: 'reader' });

  do {
    count += 1;
    code = 'DG' + String(count).padStart(4, '0');
    exists = await User.findOne({ readerCode: code });
  } while (exists);

  return code;
};

// 📌 Đăng ký tài khoản độc giả
export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, address, dob } = req.body;

    // 1. Kiểm tra trường bắt buộc
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: '❌ Vui lòng điền đầy đủ thông tin.' });
    }

    // 2. Kiểm tra email đã tồn tại
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: '❗ Email đã được sử dụng.' });
    }

    // 3. Kiểm tra số điện thoại đã tồn tại
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(409).json({ message: '❗ Số điện thoại đã được sử dụng.' });
    }

    // 4. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Sinh mã độc giả không trùng
    const readerCode = await generateUniqueReaderCode();

    // 6. Tạo user mới
    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: 'reader',
      readerCode,
      address,
      dob,
    });

    await newUser.save();

    return res.status(201).json({
      message: '✅ Đăng ký thành công.',
      readerCode,
    });

  } catch (error) {
    console.error('❌ Lỗi server khi đăng ký:', error);
    return res.status(500).json({ message: 'Lỗi server khi xử lý đăng ký.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Email không tồn tại' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        readerCode: user.readerCode,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Đăng nhập thất bại', error: err.message });
  }
};