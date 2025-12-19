import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

export const getPayments= async ({ keyword,paymentMethod, payDateFrom,payDateTo,page, size}) => {
  const response = await axiosClient.get(API_CONFIG.PAYMENT, {
    params: { keyword,paymentMethod, payDateFrom,payDateTo,page, size},
  });
  return response.data.result;
};

export const getPaymentInvoiceId = async (invoiceId) => {
  const response = await axiosClient.get(`${API_CONFIG.PAYMENT}/${invoiceId}`);
  return response.data.result;
};

// export const getInvoiceDashboard = async () => {
//   const response = await apiClient.get(`${API_CONFIG.INVOICE}/dashboard`);
//   return response.data;
// };

export const createPayment = async (payment) => {
  const response = await axiosClient.post(API_CONFIG.PAYMENT, payment);
  return response.data;
};

export const updatePayment = async (id,payment) => {
  const response = await axiosClient.post(`${API_CONFIG.PAYMENT}/${id}`, payment);
  return response.data;
};