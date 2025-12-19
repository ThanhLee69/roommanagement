import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

// Lấy danh sách phân trang, search
export const getBuildings = async ({ keyword, page, size }) => {
  const response = await axiosClient.get(API_CONFIG.BUILDING, {
    params: { keyword, page, size },
  });
  return response.data.result;
};

// Lấy toàn bộ danh sách
export const getBuildingAll = async () => {
  const response = await axiosClient.get(`${API_CONFIG.BUILDING}/all`);
  return response.data.result;
};

// Tạo mới tòa nhà
export const createBuilding = async (building) => {
  const response = await axiosClient.post(API_CONFIG.BUILDING, building);
  return response.data;
};

// Cập nhật tòa nhà
export const updateBuilding = async (id, building) => {
  const response = await axiosClient.put(`${API_CONFIG.BUILDING}/${id}`, building);
  return response.data;
};

// Xóa tòa nhà
export const deleteBuilding = async (id) => {
  const response = await axiosClient.delete(`${API_CONFIG.BUILDING}/${id}`);
  return response.data;
};
