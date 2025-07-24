import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddLibrarianForm from './AddLibrarianForm';
import LibrarianList from './LibrarianList';
import SystemSettings from './SystemSettings';
import { useAuth } from '../../contexts/AuthContext'; // 👈 import AuthContext
import '../../styles/admin.css';

export default function AdminDashboard() {
  const { token } = useAuth(); // 👈 lấy token từ context
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReaders: 0,
    totalLibrarians: 0,
    totalBorrowed: 0,
  });

  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 đính kèm token
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy thống kê:', err);
        alert('Không thể tải thống kê hệ thống!');
      }
    };

    if (token) fetchStats(); // 👈 chỉ gọi API khi đã có token
  }, [token, reloadFlag]);

  return (
    <div className="admin-dashboard">
      <h2>🛠 Trang quản trị hệ thống</h2>

      <section className="stats">
        <div className="card">📚 Tổng số sách: {stats.totalBooks}</div>
        <div className="card">👤 Độc giả: {stats.totalReaders}</div>
        <div className="card">👨‍💼 Thủ thư: {stats.totalLibrarians}</div>
        <div className="card">🔁 Lượt mượn: {stats.totalBorrowed}</div>
      </section>

      <section>
        <h3>👩‍💼 Quản lý thủ thư</h3>
        <AddLibrarianForm onLibrarianAdded={() => setReloadFlag(!reloadFlag)} />
        <LibrarianList key={reloadFlag} />
      </section>

      <section>
        <h3>⚙️ Cài đặt hệ thống</h3>
        <SystemSettings />
      </section>
    </div>
  );
}
