import { useEffect, useState, useContext, useMemo } from "react";
import { getSellerProducts, deleteProduct } from "../../api/productApi";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

// Small helper to pick an image URL whether the product stores strings or objects with `url`.
const pickImageUrl = (p) => {
  if (!p || !p.images || p.images.length === 0) return "";
  const first = p.images[0];
  if (!first) return "";
  if (typeof first === "string") return first;
  return first.url || "";
};

const MyProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // precompute a map of image URLs so we can avoid repeated checks in render
  const imageMap = useMemo(() => {
    const m = {};
    products.forEach((p) => {
      m[p._id] = pickImageUrl(p);
    });
    return m;
  }, [products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getSellerProducts(user._id);
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchProducts();
  }, [user?._id]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this product? This action cannot be undone.");
    if (!ok) return;
    try {
      await deleteProduct(id);
      // optimistic update: remove the product locally for snappier UI
      setProducts((prev) => prev.filter((x) => x._id !== id));
    } catch (error) {
      console.error("Delete product error:", error);
      const serverMsg = error.response?.data?.message || error.message;
      window.alert(`Failed to delete product: ${serverMsg}`);
      // refetch to stay in sync
      fetchProducts();
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">My Products</h1>
        <Link to="/seller/add-product" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded shadow">
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="p-6 bg-white dark:bg-gray-800 border rounded-lg text-center text-gray-600">
          You have no products yet. Click "Add Product" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((p) => {
            const imgSrc = imageMap[p._id];
            return (
              <div
                key={p._id}
                className="card-small flex flex-col hover:shadow transition-shadow duration-150"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-sm bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center text-gray-400"
                    style={imgSrc ? { backgroundImage: `url(${imgSrc})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                  >
                    {!imgSrc && <span className="text-xs">No</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{p.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">{p.description || "No description"}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${ (p.stock ?? 0) > 5 ? 'bg-emerald-100 text-emerald-800' : (p.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800') }`}>
                        {p.stock ?? 0} in stock
                      </span>

                      {p.price != null && (
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">${Number(p.price).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Link to={`/seller/edit-product/${p._id}`} className="inline-flex items-center gap-2 btn-primary px-2 py-0.5 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2M12 7v10m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Edit</span>
                  </Link>

                  <button onClick={() => handleDelete(p._id)} className="inline-flex items-center gap-2 bg-red-500 text-white px-2 py-0.5 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-xs">Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProducts;