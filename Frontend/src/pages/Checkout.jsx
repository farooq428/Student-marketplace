import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import { createOrder } from "../api/orderApi";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, clearAll } = useCart(user?._id);
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({ name: user?.name || "", address: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handleCheckout = async () => {
    if (!shipping.address || !shipping.phone) {
      alert("Please provide shipping address and phone number");
      return;
    }

    try {
      setLoading(true);
      const res = await createOrder({
        products: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount,
        paymentMethod: "COD",
        shippingInfo: shipping,
      });

      // If backend provided a receipt as base64, trigger download
      if (res?.receiptBase64) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${res.receiptBase64}`;
        link.download = `order-${res.order._id}-receipt.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      clearAll();
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert(err?.message || "Failed to place order");
    }
  };

  if (!cart.length) return <p className="p-6">Cart is empty</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shipping Form */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

          <label className="block mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">Full name</span>
            <input
              className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
              placeholder="Full name"
              value={shipping.name}
              onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
            />
          </label>

          <label className="block mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">Address</span>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 h-28 resize-none"
              placeholder="Street, City, Postal code, Country"
              value={shipping.address}
              onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
            />
          </label>

          <label className="block mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">Phone</span>
            <input
              className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
              placeholder="e.g. 03XXXXXXXXX"
              value={shipping.phone}
              onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
            />
          </label>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded shadow hover:opacity-95 disabled:opacity-60"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              <span>{loading ? "Placing order..." : "Place Order (Cash on Delivery)"}</span>
            </button>

            <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Back</button>
          </div>
        </div>

        {/* Order Summary */}
        <aside className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

          <div className="space-y-3 max-h-72 overflow-auto pr-2">
            {cart.map((item) => (
              <div key={item.product?._id || Math.random()} className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={
                      item.product?.images?.[0]?.url || item.product?.images?.[0] || item.product?.image || 
                      item.product?.thumbnail || 
                      "/placeholder-image.png"
                    }
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800 dark:text-gray-100">{item.product?.name}</div>
                  <div className="text-xs text-gray-500">{item.quantity} × Rs{item.product?.price}</div>
                </div>

                <div className="font-semibold">Rs {(item.product?.price * item.quantity || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-lg font-bold">Rs {totalAmount.toFixed(2)}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;