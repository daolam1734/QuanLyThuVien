import axiosClient from './axiosClient';

// Lấy danh sách độc giả với phân trang và tìm kiếm
export const getReaders = async ({ token, search = '', page = 1, limit = 8 }) => {
  const response = await axiosClient.get('/users/readers', {
    headers: { Authorization: `Bearer ${token}` },
    params: { search, page, limit },
  });
  return response.data;
};

// Lấy toàn bộ độc giả (dành cho dropdown chọn nhanh)
export const getAllReaders = async (token) => {
  const response = await axiosClient.get('/users/readers/all', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Cập nhật thông tin độc giả
export const updateReader = async (id, readerData, token) => {
  const response = await axiosClient.put(`/users/${id}`, readerData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Xoá độc giả
export const deleteReader = async (id, token) => {
  const response = await axiosClient.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
