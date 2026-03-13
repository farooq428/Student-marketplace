// User authentication and profile
import API from "./axios";

// Register new user
export const registerUser = async (data) => {
  const res = await API.post("/users/register", data);
  return res.data;
};

// Login user
export const loginUser = async (data) => {
  const res = await API.post("/users/login", data);
  return res.data;
};

// Get user profile
export const getUserProfile = async (id) => {
  const res = await API.get(`/users/profile/${id}`);
  return res.data;
};

// Update user profile
export const updateUserProfile = async (id, data) => {
  const res = await API.put(`/users/profile/${id}`, data);
  return res.data;
};

// Get all sellers
export const getAllSellers = async () => {
  const res = await API.get("/users/all-sellers");
  return res.data;
};