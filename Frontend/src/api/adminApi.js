// Admin APIs
import API from "./axios";

// --- Admin Authentication ---
export const loginAdmin = async (data) => {
  const res = await API.post("/admin/login", data);
  return res.data;
};

// --- Users ---
export const getAllUsers = async () => {
  const res = await API.get("/admin/all-users");
  return res.data;
};

export const verifyUser = async (id) => {
  const res = await API.put(`/admin/verify-user/${id}`);
  return res.data;
};

export const deleteUserAdmin = async (id) => {
  const res = await API.delete(`/admin/delete-user/${id}`);
  return res.data;
};

// --- Orders ---
export const getAdminOrders = async () => {
  const res = await API.get("/admin/all-orders");
  return res.data;
};

// Update order status (Shipped / Delivered / Cancelled)
export const updateOrderStatus = async (orderId, data) => {
  const res = await API.put(`/orders/update/${orderId}`, data);
  return res.data;
};