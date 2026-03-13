import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex flex-col gap-4 max-w-md">
        <Link
          to="/admin/verify-users"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Verify Sellers
        </Link>
        <Link
          to="/admin/all-orders"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;