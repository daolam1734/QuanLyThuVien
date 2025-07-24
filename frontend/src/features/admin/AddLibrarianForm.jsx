import { useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';

export default function AddLibrarianForm({ onAdd }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password } = formData;

    if (!fullName || !email || !password) {
      alert('⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/admin/librarians', {
        ...formData,
        role: 'librarian',
      });

      alert('✅ Thêm thủ thư thành công!');
      setFormData({ fullName: '', email: '', phone: '', password: '' });
      onAdd?.(); // reload danh sách nếu có callback
    } catch (err) {
      console.error('❌ Lỗi khi thêm thủ thư:', err);
      const msg = err.response?.data?.message || 'Đã xảy ra lỗi';
      alert(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>➕ Thêm thủ thư mới</h3>

      <div className="form-group">
        <input
          type="text"
          name="fullName"
          placeholder="Họ tên *"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu *"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Đang thêm...' : 'Thêm thủ thư'}
      </button>
    </form>
  );
}
