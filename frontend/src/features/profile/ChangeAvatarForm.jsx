import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function ChangeAvatarForm({ onAvatarUpdated }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user, token, login } = useAuth();

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn ảnh');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      setIsUploading(true);

      const res = await axios.put('/api/users/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = { ...user, avatar: res.data.avatar };
      login(updatedUser, token); // Cập nhật vào context

      // 🔁 Gửi dữ liệu avatar mới về component cha (Profile)
      if (onAvatarUpdated) {
        onAvatarUpdated(updatedUser);
      }

      alert('Cập nhật avatar thành công!');
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert('Cập nhật avatar thất bại!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="change-avatar-form">
      <h3>Thay đổi ảnh đại diện</h3>

      {selectedFile && (
        <div className="avatar-preview">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Ảnh xem trước"
            width="120"
            style={{ borderRadius: '8px', marginBottom: '10px' }}
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Đang tải...' : 'Tải lên'}
      </button>
    </div>
  );
}
