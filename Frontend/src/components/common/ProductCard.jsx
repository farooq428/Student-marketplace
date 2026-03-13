import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded shadow hover:shadow-lg p-3">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="font-bold mt-1">₹ {product.price}</p>
      <Link
        to={`/product/${product._id}`}
        className="bg-green-600 text-white px-3 py-1 mt-2 inline-block rounded"
      >
        View
      </Link>
    </div>
  );
};

export default ProductCard;