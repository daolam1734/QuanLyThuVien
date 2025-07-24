// src/api/librarian.api.js
import axiosClient from './axiosClient';

export const updateLibrarian = async (id, data) => {
  const res = await axiosClient.put(`/api/admin/librarians/${id}`, data);
  return res.data;
};
