import axiosClient from './axiosClient'; // ← sử dụng file bạn vừa tạo

const ENDPOINT = '/borrow-requests';

// 📌 Gửi yêu cầu mượn sách
export const createBorrowRequest = async (data) => {
  const res = await axiosClient.post(ENDPOINT, data);
  return res.data;
};

// 📌 Lấy tất cả yêu cầu mượn (cho thủ thư)
export const getAllBorrowRequests = async () => {
  const res = await axiosClient.get(ENDPOINT);
  return res.data;
};

// 📌 Duyệt yêu cầu mượn
export const approveBorrowRequest = async (id) => {
  return axiosClient.patch(`${ENDPOINT}/${id}/approve`);
};

// 📌 Từ chối yêu cầu mượn
export const rejectBorrowRequest = async (id) => {
  return axiosClient.patch(`${ENDPOINT}/${id}/reject`);
};
