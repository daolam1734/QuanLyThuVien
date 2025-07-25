import User from '../models/User.js';
import Book from '../models/Book.js';

export const getPublicStats = async (req, res) => {
  try {
    const [members, books] = await Promise.all([
      User.countDocuments({ role: 'reader' }),
      Book.countDocuments(),
    ]);

    // 👥 Demo tạm: Online và guest random
    const online = Math.floor(Math.random() * (members / 2));
    const guests = Math.floor(Math.random() * 30) + 5;

    res.json({
      members,
      online,
      guests,
      books,
    });
  } catch (err) {
    console.error('Lỗi thống kê:', err);
    res.status(500).json({ message: 'Lỗi server thống kê' });
  }
};
