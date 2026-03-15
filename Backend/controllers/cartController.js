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
    let cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Support two payload formats:
    // 1) { products: [ { product, quantity }, ... ] } -> replace entire cart
    // 2) { product, quantity } -> update a single product's quantity (add/update/remove)
    const { products, product, quantity } = req.body;

    if (products) {
      cart.products = products;
    } else if (product) {
      const idx = cart.products.findIndex((p) => p.product.toString() === product);
      if (idx > -1) {
        if (quantity > 0) {
          cart.products[idx].quantity = quantity;
        } else {
          // remove item when quantity is 0
          cart.products.splice(idx, 1);
        }
      } else if (quantity > 0) {
        cart.products.push({ product, quantity });
      }
    }

    await cart.save();
    // return populated cart for convenience
    const populated = await Cart.findById(cart._id).populate('products.product', 'name price images');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart by user
export const getCartByUser = async (req, res) => {
  try {
    // Populate images so frontend can show thumbnails
    const cart = await Cart.findOne({ user: req.params.userId }).populate(
      "products.product",
      "name price images"
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