import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import { createOrder } from "../api/orderApi";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, clearAll } = useCart(user?._id);
  const navigate = useNavigate();

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      await createOrder({
        buyer: user._id,
        products: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
        status: "Pending",
      });
      clearAll();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (!cart.length) return <p className="p-6">Cart is empty</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <p>Total Amount: ₹ {totalAmount}</p>
      <button
        onClick={handleCheckout}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;