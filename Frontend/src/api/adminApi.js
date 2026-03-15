// src/api/adminApi.js
import API from "./axios";

// Get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// --- Admin Authentication ---
export const loginAdmin = async (data) => {
  const res = await API.post("/admin/login", data);
  return res.data;
};

// --- Users ---
export const getAllUsers = async () => {
  const res = await API.get("/admin/users", getAuthHeaders());
  return res.data;
};

export const verifyUser = async (id) => {
  const res = await API.put(`/admin/verify-user/${id}`, {}, getAuthHeaders());
  return res.data;
};

export const deleteUserAdmin = async (id) => {
  const res = await API.delete(`/admin/delete-user/${id}`, getAuthHeaders());
  return res.data;
};

// --- Orders ---
export const getAdminOrders = async () => {
  const res = await API.get("/admin/orders", getAuthHeaders());
  return res.data;
};

export const updateOrderStatus = async (orderId, data) => {
  const res = await API.put(`/orders/update/${orderId}`, data, getAuthHeaders());
  return res.data;
};