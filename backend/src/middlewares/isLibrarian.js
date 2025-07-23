// ✅ Cách dùng export default nếu muốn import mặc định
const isLibrarian = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực người dùng' });
  }

  if (req.user.role !== 'librarian') {
    return res.status(403).json({ message: 'Chỉ thủ thư mới được phép truy cập' });
  }

  next();
};

export default isLibrarian;
