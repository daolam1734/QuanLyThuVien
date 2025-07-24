import { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import EditProfileForm from './EditProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import ChangeAvatarForm from './ChangeAvatarForm';
import '../../styles/profile.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

export default function Profile() {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error('Lỗi tải thông tin:', err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  if (!userData) return <p>Đang tải...</p>;

  const avatarSrc = userData.avatar?.trim()
    ? `${API_BASE_URL}/uploads/avatars/${userData.avatar}?t=${Date.now()}`
    : `${API_BASE_URL}/default-avatar.png`;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          key={avatarSrc} // ép React render lại khi avatar thay đổi
          src={avatarSrc}
          alt="Avatar"
          className="profile-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${API_BASE_URL}/default-avatar.png`;
          }}
        />

        <h2>{userData.fullName}</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>SĐT:</strong> {userData.phone}</p>
        <p><strong>Vai trò:</strong> {userData.role}</p>
      </div>

      <EditProfileForm userData={userData} />
      <ChangePasswordForm />
      <ChangeAvatarForm onAvatarUpdated={setUserData} />
    </div>
  );
}
