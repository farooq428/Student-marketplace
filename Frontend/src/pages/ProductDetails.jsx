import { useEffect, useState, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";

const pickImageUrl = (p) => {
  if (!p || !p.images || p.images.length === 0) return "";
  const first = p.images[0];
  if (!first) return "";
  if (typeof first === "string") return first;
  return first.url || "";
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = useContext(AuthContext);
  const { addItem } = useCart(user?._id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [showOwnModal, setShowOwnModal] = useState(false);
  const [addedMsg, setAddedMsg] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const imageUrls = useMemo(() => {
    if (!product || !product.images) return [];
    return product.images.map((img) => (typeof img === "string" ? img : img.url || "")).filter(Boolean);
  }, [product]);

  if (!product) return <p className="p-6">Loading...</p>;

  const seller = product.seller || {};

  return (
    <>
  <div className="p-6 max-w-4xl mx-auto">
  <div className="grid md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
        <div>
          <div className="rounded overflow-hidden">
            {imageUrls.length > 0 ? (
              <img
                src={imageUrls[selectedImage]}
                alt={product.name}
                className="w-full h-72 md:h-80 object-cover rounded"
              />
            ) : (
              <div className="w-full h-72 md:h-80 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded text-gray-500">No image</div>
            )}
          </div>

          {imageUrls.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {imageUrls.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-sm flex-shrink-0 overflow-hidden border ${selectedImage === i ? 'ring-2 ring-emerald-500' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  <img src={src} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Listed by <span className="font-medium text-gray-900 dark:text-gray-100">{seller.name || 'Unknown'}</span></p>
            {seller.university && <p className="text-sm text-gray-500">{seller.university}{seller.department ? ` • ${seller.department}` : ''}</p>}

            <p className="text-gray-700 dark:text-gray-200 mt-4 whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Price</p>
                <p className="text-2xl font-bold text-gray-900">Rs {product.price}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Stock</p>
                <p className={`font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>{product.stock ?? 0}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="inline-flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <div className="px-4 py-2">{qty}</div>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock ?? 1, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

                  {user ? (
                <>
                  <button
                    onClick={async () => {
                      // Prevent adding own product
                      if (seller.email && user.email && seller.email.toLowerCase() === user.email.toLowerCase()) {
                        setShowOwnModal(true);
                        return;
                      }
                      try {
                        await addItem(product._id, qty);
                        setAddedMsg('Added to cart ✅');
                        setTimeout(() => setAddedMsg(''), 2000);
                      } catch (err) {
                        console.error('Add to cart failed', err);
                        window.alert('Failed to add to cart');
                      }
                    }}
                    disabled={product.stock <= 0}
                    className={`px-3 py-1 rounded bg-gradient-to-r from-green-500 to-emerald-600 text-white ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Add to Cart
                  </button>
                  {addedMsg && <span className="ml-3 text-sm text-emerald-600">{addedMsg}</span>}
                </>
              ) : (
                <p className="text-sm text-gray-500">Log in to add to cart</p>
              )}
            </div>

            <div className="mt-4 border-t pt-4 flex items-center gap-4">
              <div className="flex items-center gap-3">
                {seller.profileImage ? (
                  <img src={seller.profileImage} alt={seller.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">{(seller.name || 'U').slice(0,2).toUpperCase()}</div>
                )}
                <div>
                  <p className="text-sm font-medium">{seller.name || 'Unknown Seller'}</p>
                </div>
              </div>

              <div className="ml-auto text-sm">
                {seller.isVerified ? (
                  <span className="inline-flex items-center gap-2 text-emerald-600 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified seller
                  </span>
                ) : (
                  <span className="text-muted">Not verified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Own-product modal */}
      {showOwnModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-md p-6 w-80 text-center">
            <h3 className="text-lg font-semibold">Whoa there! 😄</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">You can't add your own product to the cart — that's like putting your sandwich in your own lunchbox!</p>
            <div className="mt-4">
              <button onClick={() => setShowOwnModal(false)} className="px-3 py-1 rounded btn-primary">Got it</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;