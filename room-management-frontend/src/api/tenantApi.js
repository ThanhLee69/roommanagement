import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

// Lấy danh sách tenant phân trang, search
export const getTenants = async ({ keyword, status, page, size }) => {
  const response = await axiosClient.get(API_CONFIG.TENANT, {
    params: { keyword, status, page, size },
  });
  return response.data.result;
};

// Lấy toàn bộ tenant
export const getTenantAll = async () => {
  const response = await axiosClient.get(`${API_CONFIG.TENANT}/all`);
  return response.data.result;
};
// Lấy toàn bộ tenant
export const getAvailableTenants = async () => {
  const response = await axiosClient.get(`${API_CONFIG.TENANT}/available`);
  return response.data.result;
};
// Tạo mới tenant
export const createTenant = async (tenant) => {
  const response = await axiosClient.post(API_CONFIG.TENANT, tenant);
  return response.data;
};

// Cập nhật tenant
export const updateTenant = async (id, tenant) => {
  const response = await axiosClient.put(`${API_CONFIG.TENANT}/${id}`, tenant);
  return response.data;
};

// Xóa tenant
export const deleteTenant = async (id) => {
  const response = await axiosClient.delete(`${API_CONFIG.TENANT}/${id}`);
  return response.data;
};

export const getTenantDashboard = async () => {
  const response = await axiosClient.get(`${API_CONFIG.TENANT}/dashboard`);
  return response.data;
};
