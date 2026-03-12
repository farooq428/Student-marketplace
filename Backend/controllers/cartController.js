import Cart from "../models/Cart.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, products: [{ product, quantity }] });
    } else {
      const itemIndex = cart.products.findIndex((p) => p.product.toString() === product);
      if (itemIndex > -1) {
        // Update quantity if already exists
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ product, quantity });
      }
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart
export const updateCart = async (req, res) => {
  try {
    const { products } = req.body;
    let cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = products;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart by user
export const getCartByUser = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate(
      "products.product",
      "name price"
    );
    res.json(cart || { products: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = [];
    await cart.save();
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};