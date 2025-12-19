import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

// Lấy danh sách phân trang, search
// export const getSERVICE = async ({ keyword, page, pageSize }) => {
//   const response = await apiClient.get(API_CONFIG.SERVICE, {
//     params: { keyword, page, pageSize },
//   });
//   return response.data.data;
// };

// Lấy toàn bộ danh sách
export const getServiceAll = async () => {
  const response = await axiosClient.get(API_CONFIG.SERVICE);
  return response.data.result;
};

// Tạo mới dịch vụ 
export const createService = async (service) => {
  const response = await axiosClient.post(API_CONFIG.SERVICE, service);
  return response.data;
};

// Cập nhật địch vụ
export const updateService = async (id, service) => {
  const response = await axiosClient.put(`${API_CONFIG.SERVICE}/${id}`, service);
  return response.data;
};

// Xóa dịch vụ
export const deleteService = async (id) => {
  const response = await axiosClient.delete(`${API_CONFIG.SERVICE}/${id}`);
  return response.data;
};
