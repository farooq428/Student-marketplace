import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import { Link, useNavigate } from "react-router-dom";

const formatCurrency = (v) => `Rs ${Number(v || 0).toFixed(2)}`;

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { cart, updateItem, clearAll, fetchCart } = useCart(user?._id);

  const totalAmount = cart.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0), 0);

  if (!cart.length) return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      <div className="p-6 bg-white dark:bg-gray-800 border rounded-lg text-center text-gray-600">
        Your cart is empty. <Link to="/shop" className="text-indigo-600 hover:underline">Shop now</Link>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => {
          const product = item.product || {};
          const thumb = Array.isArray(product.images) && product.images.length ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url) : null;
          return (
            <div key={product._id} className="flex items-center gap-4 bg-white dark:bg-gray-800 border rounded-lg p-3">
              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                {thumb ? <img src={thumb} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No</div>}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateItem(product._id, Math.max(1, (item.quantity || 1) - 1))}
                  className="px-2 py-1 bg-gray-100 rounded"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => {
                    const q = Math.max(1, Number(e.target.value) || 1);
                    updateItem(product._id, q);
                  }}
                  className="w-14 text-center border rounded px-1 py-1 bg-white dark:bg-gray-700"
                />
                <button
                  onClick={() => updateItem(product._id, (item.quantity || 1) + 1)}
                  className="px-2 py-1 bg-gray-100 rounded"
                >
                  +
                </button>
              </div>

              <div className="w-28 text-right">
                <p className="font-semibold">{formatCurrency((product.price || 0) * (item.quantity || 0))}</p>
                <button onClick={() => updateItem(product._id, 0)} className="text-xs text-red-600 mt-1">Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 border rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={clearAll} className="bg-red-500 text-white px-4 py-2 rounded">Clear Cart</button>
          <CheckoutButton />
        </div>
      </div>
    </div>
  );
};

const CheckoutButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/checkout')}
      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded"
    >
      Checkout
    </button>
  );
};

export default Cart;