import { useState } from "react";
import { createProduct, updateProduct } from "../../api/productApi";
import { useNavigate } from "react-router-dom";

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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    setFormData({ ...formData, images: e.target.value.split(",") });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
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

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <input
        type="text"
        name="images"
        placeholder="Image URLs (comma separated)"
        value={formData.images.join(",")}
        onChange={handleImagesChange}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        {existingProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;