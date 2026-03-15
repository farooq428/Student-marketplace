import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Add auth token if exists
API.interceptors.request.use((config) => {
  // If the request already set an Authorization header (for example
  // adminApi passes an admin token), don't overwrite it. Otherwise
  // fall back to the regular user token stored at `localStorage.token`.
  const hasAuthHeader = config.headers && (config.headers.Authorization || config.headers.authorization);
  if (!hasAuthHeader) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;