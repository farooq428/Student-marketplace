import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const img = (product.images && product.images[0]) || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect fill='%23f3f4f6' width='100%' height='100%'/></svg>";

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-lg overflow-hidden">
      <div className="relative">
        <img src={img} alt={product.name} className="w-full h-48 object-cover" />
        <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded">₹ {product.price}</div>
      </div>

      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <Link to={`/product/${product._id}`} className="text-sm text-green-600 font-medium">View details</Link>
          <span className="text-xs text-gray-500">Stock: {product.stock ?? 0}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;