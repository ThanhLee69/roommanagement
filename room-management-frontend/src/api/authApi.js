import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

export const getAmenities = async () => {
  const response = await axiosClient.get(API_CONFIG.AMENITIE);
  return response.data.data;
};
