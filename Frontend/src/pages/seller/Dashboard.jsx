import { useEffect, useState, useContext } from "react";
import { getSellerProducts } from "../../api/productApi";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getSellerProducts(user._id);
      setProducts(data || []);
      setLoading(false);
    };
    if (user?._id) fetchProducts();
  }, [user?._id]);

  const total = products.length;
  const lowStock = products.filter((p) => (p.stock ?? 0) < 5).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
        <Link
          to="/seller/my-products"
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded shadow hover:opacity-95"
        >
          Manage Products
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-semibold mt-1">{total}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Low Stock (&lt; 5)</p>
          <p className="text-2xl font-semibold mt-1 text-amber-600">{lowStock}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-2xl font-semibold mt-1">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-3">My Products</h2>

        {loading ? (
          <div className="text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-6 bg-white dark:bg-gray-800 border rounded-lg text-center text-gray-600">
            You haven't added any products yet. Start by adding your first product in Manage Products.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm flex flex-col">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">Stock: {p.stock ?? 0}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Link to={`/seller/edit-product/${p._id}`} className="text-indigo-600 hover:underline text-sm">
                    Edit
                  </Link>
                  <Link to={`/product/${p._id}`} className="text-sm text-gray-500 hover:underline">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;