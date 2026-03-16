import { useEffect, useState, useContext } from "react";
import { getAllProducts } from "../api/productApi";
import ProductCard from "../components/common/ProductCard";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        if (mounted) setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        if (mounted) setError(err?.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Featured Products</h1>
        <div className="text-sm text-gray-500">{loading ? "Loading…" : `${products.length} item${products.length !== 1 ? 's' : ''}`}</div>
      </div>

      <FeaturedSellerCTA />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse p-4 bg-white dark:bg-gray-800 border rounded-lg">
              <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded">Error: {error}</div>
      ) : products.length === 0 ? (
        <div className="p-8 bg-yellow-50 border rounded text-center">
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-sm text-gray-600 mb-4">There are no products listed yet. Check back later or be the first to list an item.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/shop" className="px-4 py-2 border rounded">Browse</Link>
            <Link to="/seller/add-product" className="px-4 py-2 bg-green-600 text-white rounded">List an item</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

const FeaturedSellerCTA = () => {
  const { user } = useContext(AuthContext);

  // Show CTA to non-sellers
  if (!user) {
    return (
      <div className="mb-6 p-4 bg-yellow-100 rounded">
        <p className="mb-2">Want to sell items? Create an account and become a seller.</p>
        <Link to="/register" className="bg-green-600 text-white px-3 py-1 rounded">Create account</Link>
      </div>
    );
  }

  if (user.role !== "seller") {
    return (
      <div className="mb-6 p-4 bg-yellow-100 rounded">
        <p className="mb-2">Want to sell items? Create a seller account to list products.</p>
        <Link to="/seller/add-product" className="bg-green-600 text-white px-3 py-1 rounded">Create seller account</Link>
      </div>
    );
  }

  return null;
};