import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

export const getRoomImages = async (roomId) => {
  const response = await axiosClient.get(
    `${API_CONFIG.ROOM_IMAGE}/room/${roomId}`
  );
  return response.data.result;
};


export const uploadRoomImages = async (roomId, files) => {
  
  const formData = new FormData();

  files.forEach(file => formData.append("files", file));

  const response = await axiosClient.post(
    `${API_CONFIG.ROOM_IMAGE}/upload/${roomId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        
      },
      timeout: 30000
    }
  );

  return response.data;
};

export const deleteRoomImages = async (imageIds) => {
  const response = await axiosClient.delete(
    `${API_CONFIG.ROOM_IMAGE}/${imageIds}`
  );
  return response.data;
};
