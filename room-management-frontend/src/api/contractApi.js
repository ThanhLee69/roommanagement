import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

export const getContracts= async ({ keyword, status,buildingId,roomId, page, size}) => {
  const response = await axiosClient.get(API_CONFIG.CONTRACT, {
    params: { keyword, status,buildingId,roomId, page, size },
  });
  return response.data.result;
};

export const getActiveContracts = async () => {
  const response = await axiosClient.get(`${API_CONFIG.CONTRACT}/active `);
  return response.data.result;
};

export const createContract = async (contract) => {
  const response = await axiosClient.post(API_CONFIG.CONTRACT, contract);
  return response.data;
};
export const updateContract = async (id, contract) => {
  const response = await axiosClient.put(
    `${API_CONFIG.CONTRACT}/${id}`,
    contract,
  );
  return response.data;
};

export const deleteContract = async (id) => {
  const response = await axiosClient.delete(`${API_CONFIG.CONTRACT}/${id}`);
  return response.data;
};
export const getContractDashboard = async () => {
  const response = await axiosClient.get(`${API_CONFIG.CONTRACT}/dashboard`);
  return response.data;
};