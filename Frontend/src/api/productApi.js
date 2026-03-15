// CRUD for products
import API from "./axios";

// Create new product
export const createProduct = async (data) => {
  const res = await API.post("/products/create", data);
  return res.data;
};

// Upload single product image (multipart/form-data)
export const uploadProductImage = async (file) => {
  const form = new FormData();
  form.append("image", file);
  const res = await API.post("/products/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Get all products
export const getAllProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

// Get product by ID
export const getProductById = async (id) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

// Get products of a seller
export const getSellerProducts = async (sellerId) => {
  const res = await API.get(`/products/seller/${sellerId}`);
  return res.data;
};

// Update product
export const updateProduct = async (id, data) => {
  const res = await API.put(`/products/update/${id}`, data);
  return res.data;
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const res = await API.delete(`/products/delete/${id}`);
    return res.data;
  } catch (err) {
    // Re-throw a more informative error so the UI can surface backend messages
    if (err.response && err.response.data) {
      const e = new Error(err.response.data.message || 'Server error');
      e.response = err.response;
      throw e;
    }
    throw err;
  }
};