import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

// Lấy danh sách user phân trang + search + filter
export const getUsers = async ({ keyword, role, status, page, size }) => {
  const response = await axiosClient.get(API_CONFIG.USER, {
    params: { keyword, role, status, page, size },
  });
  return response.data.result;
};

// Lấy user theo id
export const getUserById = async (id) => {
  const response = await axiosClient.get(`${API_CONFIG.USER}/${id}`);
  return response.data.result;
};

// Tạo mới user
export const createUser = async (user) => {
  const response = await axiosClient.post(API_CONFIG.USER, user);
  return response.data;
};

// Cập nhật user
export const updateUser = async (id, user) => {
  const response = await axiosClient.put(`${API_CONFIG.USER}/${id}`, user);
  return response.data;
};

// Xóa user (soft delete)
export const deleteUser = async (id) => {
  const response = await axiosClient.delete(`${API_CONFIG.USER}/${id}`);
  return response.data;
};
