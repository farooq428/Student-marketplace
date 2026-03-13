// Orders and Cart
import API from "./axios";

// --- Orders ---
export const createOrder = async (data) => {
  const res = await API.post("/orders/create", data);
  return res.data;
};

export const getUserOrders = async (buyerId) => {
  const res = await API.get(`/orders/user/${buyerId}`);
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await API.get(`/orders/${id}`);
  return res.data;
};

export const updateOrderStatus = async (id, data) => {
  const res = await API.put(`/orders/update/${id}`, data);
  return res.data;
};

export const getAllOrders = async () => {
  const res = await API.get("/orders/all");
  return res.data;
};

// --- Cart ---
export const addToCart = async ({ userId, productId, quantity }) => {
  const res = await API.post("/cart/add", { userId, product: productId, quantity });
  return res.data;
};

export const updateCart = async (userId, { productId, quantity }) => {
  const res = await API.put(`/cart/update/${userId}`, { product: productId, quantity });
  return res.data;
};

export const getUserCart = async (userId) => {
  const res = await API.get(`/cart/user/${userId}`);
  return res.data;
};

export const clearCart = async (userId) => {
  const res = await API.delete(`/cart/clear/${userId}`);
  return res.data;
};