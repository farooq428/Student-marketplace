import { useEffect, useState, useContext } from "react";
import { getSellerProducts, deleteProduct } from "../../api/productApi";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const MyProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const data = await getSellerProducts(user._id);
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [user._id]);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Products</h1>
      <Link
        to="/seller/add-product"
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Add Product
      </Link>

      {products.length === 0 && <p>No products added yet</p>}

      <ul>
        {products.map((p) => (
          <li key={p._id} className="border p-2 mb-2 flex justify-between items-center">
            <span>{p.name} (Stock: {p.stock})</span>
            <div className="flex gap-2">
              <Link
                to={`/seller/edit-product/${p._id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProducts;