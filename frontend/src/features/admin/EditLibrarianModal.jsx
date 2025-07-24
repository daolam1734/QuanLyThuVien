import { useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';

export default function EditLibrarianModal({ librarian, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    fullName: librarian.fullName,
    phone: librarian.phone || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.put(`/api/admin/librarians/${librarian._id}`, formData);
      alert('✅ Cập nhật thủ thư thành công!');
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi cập nhật thủ thư!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>✏️ Chỉnh sửa thủ thư</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            name="fullName"
            placeholder="Họ tên"
            value={formData.fullName}
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
            placeholder="Mật khẩu mới (để trống nếu không đổi)"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
