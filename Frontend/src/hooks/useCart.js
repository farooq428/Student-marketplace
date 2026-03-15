import { useState, useEffect } from "react";
import { getUserCart, addToCart, updateCart, clearCart } from "../api/orderApi";

export const useCart = (userId) => {
  const [cart, setCart] = useState([]);

  // Fetch cart safely
  const fetchCart = async () => {
    if (!userId) {
      setCart([]);
      return;
    }
    try {
      const data = await getUserCart(userId);
      setCart(data?.products || []); // safely handle undefined
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    }
  };

  // Add item to cart
  const addItem = async (productId, quantity = 1) => {
    if (!userId) return;
    try {
      const res = await addToCart({ userId, productId, quantity });
      // backend returns the updated cart (populated). Use it to update local state
      if (res && res.products) {
        setCart(res.products);
        return res;
      }
      // fallback to refetch
      await fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Update item quantity
  const updateItem = async (productId, quantity) => {
    if (!userId) return;
    try {
      const res = await updateCart(userId, { productId, quantity });
      if (res && res.products) {
        setCart(res.products);
        return res;
      }
      await fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  // Clear entire cart
  const clearAll = async () => {
    if (!userId) return;
    try {
      await clearCart(userId);
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  return { cart, fetchCart, addItem, updateItem, clearAll };
};