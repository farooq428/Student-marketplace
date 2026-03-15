import { useEffect, useState, useContext } from "react";
import { getAllProducts } from "../api/productApi";
import ProductCard from "../components/common/ProductCard";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>
      {/* Prompt buyers to become sellers */}
      <FeaturedSellerCTA />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
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