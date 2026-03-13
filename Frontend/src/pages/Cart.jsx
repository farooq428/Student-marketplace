import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { cart, updateItem, clearAll } = useCart(user?._id);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!cart.length) return <p className="p-6">Your cart is empty</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.map((item) => (
        <div key={item.product._id} className="flex justify-between items-center border-b py-3">
          <p>{item.product.name}</p>
          <input
            type="number"
            value={item.quantity}
            min={1}
            onChange={(e) => updateItem(item.product._id, Number(e.target.value))}
            className="w-16 border p-1 rounded"
          />
          <p>₹ {item.price * item.quantity}</p>
        </div>
      ))}
      <div className="mt-4 flex justify-between items-center">
        <p className="font-bold text-xl">Total: ₹ {totalAmount}</p>
        <button onClick={clearAll} className="bg-red-500 text-white px-4 py-2 rounded">
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;