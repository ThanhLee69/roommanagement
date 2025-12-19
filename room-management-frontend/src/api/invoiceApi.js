import axiosClient from "./axiosClient";
import API_CONFIG from "../config/apiConfig";

export const getInvoices= async ({ keyword, month,year,invoiceStatus, dueDateFrom,dueDateTo,page, size}) => {
  const response = await axiosClient.get(API_CONFIG.INVOICE, {
    params: { keyword, month,year,invoiceStatus, dueDateFrom,dueDateTo,page, size},
  });
  return response.data.result;
};

export const getInvoiceById = async (id) => {
  const response = await axiosClient.get(`${API_CONFIG.INVOICE}/${id}`);
  return response.data.result;
};

export const getAllInvoicesForPayment = async () => {
  const response = await axiosClient.get(`${API_CONFIG.INVOICE}/payment/all`);
  return response.data.result;
};

export const getInvoiceDashboard = async () => {
  const response = await axiosClient.get(`${API_CONFIG.INVOICE}/dashboard`);
  return response.data;
};

export const createInvoice = async (invoice) => {
  const response = await axiosClient.post(API_CONFIG.INVOICE, invoice);
  return response.data;
};
export const updateInvoice = async (id, invoice) => {
  const response = await axiosClient.put(
    `${API_CONFIG.INVOICE}/${id}`,
    invoice,
  );
  return response.data;
};