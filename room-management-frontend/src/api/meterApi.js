import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

// Lấy danh sách điện nước phân trang, search
export const getMeterReadings = async ({ keyword, roomId, month, year, page, size }) => {
  const response = await axiosClient.get(API_CONFIG.METER, {
    params: { keyword, roomId, month, year, page, size },
  });
  return response.data.result;
};

// Lấy toàn bộ điện nước theo room
export const getByRoomAndMonthYear = async (roomId, month, year) => {
  const response = await axiosClient.get(`${API_CONFIG.METER}/by-room`, {
    params: {  roomId, month, year },
  });
  return response.data.result;
};

// Tạo mới điện nước
export const createMeterReading = async (room) => {
  const response = await axiosClient.post(API_CONFIG.METER, room);
  return response.data;
};

// // Cập nhật điện nước
// export const updateRoom = async (id, room) => {
//   const response = await apiClient.put(`${API_CONFIG.ROOMS}/${id}`, room);
//   return response.data;
// };

// // Xóa điện nước
// export const deleteRoom = async (id) => {
//   const response = await apiClient.delete(`${API_CONFIG.ROOMS}/${id}`);
//   return response.data;
// };
