import { useState, useContext, useRef } from "react";
import { createProduct, updateProduct, uploadProductImage } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SellerOnboardingModal from "../common/SellerOnboardingModal";

const ProductForm = ({ existingProduct }) => {
  const [formData, setFormData] = useState(
    existingProduct || {
      name: "",
      description: "",
      price: 0,
      images: [],
      stock: 0,
    }
  );
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    setFormData({ ...formData, images: e.target.value.split(",") });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadProductImage(file);
      // res.url expected
      setFormData({ ...formData, images: [...(formData.images || []), res.url] });
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
      // clear file input
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx) => {
    const next = [...formData.images];
    next.splice(idx, 1);
    setFormData({ ...formData, images: next });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // If user lacks seller onboarding info, prompt them first
      const needsOnboarding = !user?.university || !user?.department || !user?.studentCardImage;
      if (needsOnboarding && !showOnboarding) {
        setShowOnboarding(true);
        return;
      }

      if (existingProduct) {
        await updateProduct(existingProduct._id, formData);
      } else {
        await createProduct(formData);
      }
      navigate("/seller/my-products");
    } catch (err) {
      setError(err.response?.data?.message || "Product action failed");
    }
  };

  // If user is not a seller, show CTA to become seller and open onboarding modal.
  if (!user || user.role !== "seller") {
    return (
      <>
        <SellerOnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={() => setShowOnboarding(false)}
        />
        <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-2">Create a seller account</h2>
          <p className="mb-4">You currently have a buyer account. To sell items you need to complete seller onboarding.</p>
          <div className="flex gap-2">
            <button onClick={() => setShowOnboarding(true)} className="bg-green-600 text-white px-4 py-2 rounded">Create seller account</button>
            <button onClick={() => navigate("/")} className="px-4 py-2 border rounded">Back to shop</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SellerOnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} onComplete={() => setShowOnboarding(false)} />
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product name</label>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 mb-3"
              required
            />

            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Describe your product"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 mb-3 h-32"
              required
            />

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Price (PKR)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>

              <div className="w-40">
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <div className="mt-1 flex flex-col gap-2">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="" />
              {uploading && <p className="text-sm text-gray-500">Uploading...</p>}

              <div className="mt-2 grid grid-cols-3 gap-2">
                {(formData.images || []).map((src, idx) => (
                  <div key={idx} className="relative border rounded overflow-hidden">
                    <img src={src} alt={`img-${idx}`} className="w-full h-24 object-cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded px-1 text-xs">Remove</button>
                  </div>
                ))}
              </div>

              <label className="text-xs text-gray-500 mt-2">You can upload images (server stores them) or paste image URLs separated by commas below.</label>
              <input
                type="text"
                name="images"
                placeholder="Image URLs (comma separated)"
                value={(formData.images || []).join(",")}
                onChange={handleImagesChange}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
            {existingProduct ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </>
  );
};

export default ProductForm;