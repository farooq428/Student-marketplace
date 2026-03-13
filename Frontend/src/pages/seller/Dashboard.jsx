import { useEffect, useState, useContext } from "react";
import { getSellerProducts } from "../../api/productApi";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getSellerProducts(user._id);
      setProducts(data);
    };
    fetchProducts();
  }, [user._id]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
      <Link
        to="/seller/my-products"
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Manage Products
      </Link>

      <div>
        <h2 className="text-2xl font-semibold mt-6">My Products</h2>
        {products.length === 0 && <p>No products added yet</p>}
        <ul className="mt-2">
          {products.map((p) => (
            <li key={p._id} className="border p-2 mb-2 flex justify-between">
              <span>{p.name}</span>
              <span>Stock: {p.stock}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;