import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// ✅ Helper: Chỉ giữ tên file từ đường dẫn avatar
const extractFileName = (avatarPath) => {
  if (!avatarPath) return null;
  return avatarPath.split('/').pop(); // giữ lại phần tên file
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ Load từ localStorage khi app khởi động
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.avatar = extractFileName(parsedUser.avatar);
        setUser(parsedUser);
        setToken(storedToken);
      } catch {
        setUser(null);
        setToken(null);
      }
    }
  }, []);

  // ✅ Dùng khi login hoặc cập nhật avatar
  const login = (userData, tokenData) => {
    const cleanedUser = {
      ...userData,
      avatar: extractFileName(userData.avatar),
    };

    setUser(cleanedUser);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(cleanedUser));
    localStorage.setItem('token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
