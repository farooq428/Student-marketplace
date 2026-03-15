import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Notification from "../models/Notification.js";
import PDFDocument from "pdfkit";

// Create order (Buyer)
export const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, paymentMethod = "COD", shippingInfo = {} } = req.body;

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
      paymentMethod,
      shippingInfo,
    });

    // Create notifications for sellers involved
    const sellerIds = new Set();
    for (let item of products) {
      const prod = await Product.findById(item.product);
      if (prod && prod.seller) sellerIds.add(prod.seller.toString());
    }

    for (let sid of sellerIds) {
      await Notification.create({
        user: sid,
        order: order._id,
        message: `New order ${order._id} placed. Check your orders.`,
      });
    }

    // Generate a simple PDF receipt and return base64 to frontend for download
    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);
      // return order and receipt base64
      res.status(201).json({ order, receiptBase64: pdfData.toString("base64") });
    });

    // Write receipt content
    doc.fontSize(20).text("Order Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Buyer: ${req.user.name} (${req.user.email})`);
    doc.text(`Payment: ${paymentMethod}`);
    doc.moveDown();
    doc.text("Products:");
    for (let item of products) {
      const prod = await Product.findById(item.product);
      doc.text(`- ${prod?.name || item.product} x ${item.quantity} @ ${item.price || prod?.price || 0}`);
    }
    doc.moveDown();
    doc.text(`Total: ${totalAmount}`);
    doc.end();
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