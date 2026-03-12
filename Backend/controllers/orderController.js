import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Create order (Buyer)
export const createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    // Optional: Check stock
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: "Product not found" });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      buyer: req.user._id,
      products,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders by buyer
export const getOrdersByBuyer = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.buyerId }).populate(
      "products.product",
      "name price"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("products.product", "name price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("products.product", "name price");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};