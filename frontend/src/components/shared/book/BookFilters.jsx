// 📁 src/features/shared/book/BookFilters.jsx

import { useState, useEffect } from 'react';
import './bookCatalog.css';

export default function BookFilters({ filters, setFilters, categories = [] }) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');
  const [category, setCategory] = useState(filters.category || 'all');

  // Cập nhật filters ra parent
  useEffect(() => {
    setFilters({ search, status, category });
  }, [search, status, category]);

  return (
    <div className="book-filters">
      <input
        type="text"
        placeholder="🔍 Tìm theo tên sách hoặc tác giả..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">📚 Tất cả thể loại</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">📖 Tất cả tình trạng</option>
        <option value="available">✅ Còn sách</option>
        <option value="borrowed">🚫 Đã mượn</option>
      </select>
    </div>
  );
}
