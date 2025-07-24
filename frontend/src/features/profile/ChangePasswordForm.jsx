import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function ChangePasswordForm() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return alert('Mật khẩu mới không khớp');
    }
    try {
      await axios.put('/api/users/change-password', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Đổi mật khẩu thành công');
    } catch (err) {
      alert('Lỗi đổi mật khẩu');
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h3>Đổi mật khẩu</h3>
      <input type="password" name="currentPassword" placeholder="Mật khẩu hiện tại" onChange={handleChange} />
      <input type="password" name="newPassword" placeholder="Mật khẩu mới" onChange={handleChange} />
      <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu mới" onChange={handleChange} />
      <button type="submit">Đổi mật khẩu</button>
    </form>
  );
}
