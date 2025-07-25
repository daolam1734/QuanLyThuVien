import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

export default function Header() {
  const { user, logout, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache',
            },
          });
          setUserData(res.data);
        } catch (error) {
          console.error('Lỗi tải avatar:', error);
        }
      }
    };
    fetchUserData();
  }, [token]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (location.pathname === '/') {
        const params = new URLSearchParams();
        if (searchQuery.trim()) {
          params.set('search', searchQuery.trim());
        }
        navigate({
          pathname: '/',
          search: params.toString(),
        });
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, navigate, location.pathname]);

  const avatarSrc = userData?.avatar?.trim()
    ? `${API_BASE_URL}/uploads/avatars/${userData.avatar}?t=${Date.now()}`
    : `${API_BASE_URL}/default-avatar.png`;

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <Link to="/">
            <img src="/image/logo.png" alt="TVU Logo" className="logo-img" />TVU Library
          </Link>
        </div>
        <div className="right-section">
          {user ? (
            <div className="user-info">
              <img
                src={avatarSrc}
                alt="Avatar"
                className="header-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${API_BASE_URL}/default-avatar.png`;
                }}
              />
              <div className="dropdown">
                <span>{user.fullName}</span>
                <div className="dropdown-content">
                  <Link to="/profile">👤 Hồ sơ</Link>

                  {user.role === 'reader' && (
                    <Link to="/borrowed">📖 Sách đã mượn</Link>
                  )}

                  {user.role === 'librarian' && (
                    <Link to="/librarian">📘 Trang quản lý</Link>
                  )}

                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin">🛠 Admin</Link>
                    </>
                  )}

                  <button onClick={handleLogout}>🚪 Đăng xuất</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register" className="btn-register">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>

      <div className="header-bottom">
        <nav className="menu">
          <Link to="/">🏠 Trang chủ</Link>
          <Link to="/about">📖 Giới thiệu</Link>
          <Link to="/contact">📬 Liên hệ</Link>
        </nav>
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Tìm sách, tác giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <span className="clear-search" onClick={() => setSearchQuery('')}>×</span>
          )}
        </div>
      </div>
    </header>
  );
}
