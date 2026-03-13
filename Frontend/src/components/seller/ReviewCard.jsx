const ReviewCard = ({ review }) => {
  return (
    <div className="border rounded p-3 shadow mb-3">
      <p className="font-semibold">{review.buyer.name}</p>
      <p className="text-yellow-500">
        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
      </p>
      <p>{review.comment}</p>
      <p className="text-gray-500 text-sm mt-1">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ReviewCard;