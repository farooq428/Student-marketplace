import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "../../api/adminApi";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const data = await getAdminOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, { status });
    fetchOrders();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Orders</h1>
      {orders.length === 0 && <p>No orders found</p>}
      <ul>
        {orders.map((o) => (
          <li key={o._id} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              <p>Buyer: {o.buyer.name}</p>
              <p>Total: ₹ {o.totalAmount}</p>
              <p>Status: {o.status}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange(o._id, "Shipped")}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Shipped
              </button>
              <button
                onClick={() => handleStatusChange(o._id, "Delivered")}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                Delivered
              </button>
              <button
                onClick={() => handleStatusChange(o._id, "Cancelled")}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllOrders;