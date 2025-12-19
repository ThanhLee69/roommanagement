import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

// Lấy danh sách phòng phân trang, search
export const getRooms = async ({ keyword, roomType, status, buildingId, page, size }) => {
  const response = await axiosClient.get(API_CONFIG.ROOM, {
    params: { keyword, roomType, status, buildingId, page, size },
  });
  return response.data.result;
};

// Lấy toàn bộ phòng
export const getAvailableRooms = async () => {
  const response = await axiosClient.get(`${API_CONFIG.ROOM}/available`);
  return response.data.result;
};

export const getRoomByName = async (code) => {
  const response = await axiosClient.get(`${API_CONFIG.ROOM}/code/${code}`);
  return response.data.result;
};
// Tạo mới phòng
export const createRoom = async (room) => {
  const response = await axiosClient.post(API_CONFIG.ROOM, room);
  return response.data;
};

// Cập nhật phòng
export const updateRoom = async (id, room) => {
  const response = await axiosClient.put(`${API_CONFIG.ROOM}/${id}`, room);
  return response.data;
};

// Xóa phòng
export const deleteRoom = async (id) => {
  const response = await axiosClient.delete(`${API_CONFIG.ROOM}/${id}`);
  return response.data;
};

export const getRoomDashboard = async () => {
  const response = await axiosClient.get(`${API_CONFIG.ROOM}/dashboard`);
  return response.data;
};
