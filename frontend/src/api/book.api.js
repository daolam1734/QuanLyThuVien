import axiosClient from './axiosClient';

// 📥 Lấy danh sách sách (chỉ dành cho quản lý)
export const getBooks = async () => {
  const res = await axiosClient.get('/books/manage');
  return res.data;
};

// ➕ Tạo sách mới (có upload ảnh bìa)
export const createBook = async (formData) => {
  const res = await axiosClient.post('/books', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 📝 Cập nhật sách
export const updateBook = async (id, formData) => {
  const res = await axiosClient.put(`/books/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// ❌ Xoá sách
export const deleteBook = async (id) => {
  const res = await axiosClient.delete(`/books/${id}`);
  return res.data;
};

// 📊 Lấy thống kê sách
export const getBookSummary = async () => {
  const res = await axiosClient.get('/books/summary');
  return res.data;
};

// 📚 Lấy danh sách sách public cho độc giả
export const getPublicBooks = async () => {
  const res = await axiosClient.get('/books');
  return res.data;
};
