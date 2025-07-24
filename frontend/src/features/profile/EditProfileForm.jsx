import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function EditProfileForm({ userData }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put('/api/users/me', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Cập nhật thành công!');
    } catch (err) {
      alert('Lỗi cập nhật!');
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h3>Chỉnh sửa thông tin</h3>
      <input name="fullName" value={form.fullName} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="phone" value={form.phone} onChange={handleChange} />
      <button type="submit">Lưu thay đổi</button>
    </form>
  );
}
