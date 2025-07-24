import axios from 'axios';

// 🔧 Lấy baseURL từ biến môi trường hoặc fallback về window.origin
const API_BASE_URL = process.env.REACT_APP_API_URL || window.location.origin;

// ✅ Tạo axios instance dùng chung
const axiosClient = axios.create({
  baseURL: `${API_BASE_URL}/api`, // → Ví dụ: http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor Request: Tự động gắn token từ localStorage
axiosClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('❌ Lỗi khi gắn token vào request:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor Response: Bắt lỗi 401/403 để xử lý tập trung
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn('⚠️ Token không hợp lệ hoặc đã hết hạn.');
        // 👉 Tuỳ bạn xử lý: chuyển về login, xoá token,...
        // localStorage.removeItem('token');
        // window.location.href = '/login';
      }

      if (status === 403) {
        console.warn('⛔ Không có quyền truy cập tài nguyên.');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
