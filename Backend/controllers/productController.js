import Product from "../models/Product.js";
import { uploadImage } from "../services/imagekitService.js";

// Create product (seller)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, images, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      images,
      stock,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    // Populate seller with more profile fields so the frontend can show seller info
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email university department profileImage isVerified"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by id:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get products by seller
export const getProductsBySeller = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.images = req.body.images || product.images;
    product.stock = req.body.stock || product.stock;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    // Find and delete in one operation to avoid relying on instance methods
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Upload a single product image and return its URL
export const uploadProductImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const url = await uploadImage(file);
    res.json({ url });
  } catch (error) {
    console.error("Product image upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};