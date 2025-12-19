import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

export const getAmenities = async () => {
  const res = await axiosClient.get(API_CONFIG.AMENITIE);
  return res.data.result;
};

export const getBuildingAmenities = async () => {
  const res = await axiosClient.get(`${API_CONFIG.AMENITIE}/building`);
  return res.data.result;
};

export const getRoomAmenities = async () => {
  const res = await axiosClient.get(`${API_CONFIG.AMENITIE}/room`);
  return res.data.result;
};

export const createAmenity = async (data) => {
  const res = await axiosClient.post(API_CONFIG.AMENITIE, data);
  return res.data.result;
};

export const updateAmenity = async (id, data) => {
  const res = await axiosClient.put(`${API_CONFIG.AMENITIE}/${id}`, data);
  return res.data.result;
};

export const deleteAmenity = async (id) => {
  const res = await axiosClient.delete(`${API_CONFIG.AMENITIE}/${id}`);
  return res.data;
};
