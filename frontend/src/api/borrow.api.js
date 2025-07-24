import axiosClient from './axiosClient'; // ✅ đã có baseURL = /api

const API_URL = '/borrows'; // chỉ cần đường dẫn tương đối từ /api

export const createBorrow = async (data) => {
  return axiosClient.post(API_URL, data);
};

export const returnBook = async (borrowId, returnDate) => {
  return axiosClient.put(`${API_URL}/${borrowId}/return`, { returnDate });
};

export const extendBorrow = async (borrowId) => {
  return axiosClient.put(`${API_URL}/${borrowId}/extend`);
};

export const getAllBorrows = async () => {
  return axiosClient.get(API_URL);
};

export const getBorrowById = async (borrowId) => {
  return axiosClient.get(`${API_URL}/${borrowId}`);
};

export const deleteBorrow = async (borrowId) => {
  return axiosClient.delete(`${API_URL}/${borrowId}`);
};
