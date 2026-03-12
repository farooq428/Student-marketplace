import Review from "../models/Review.js";

// Create review (Buyer)
export const createReview = async (req, res) => {
  try {
    const { seller, rating, comment } = req.body;

    // Check if buyer already reviewed seller
    const existing = await Review.findOne({ buyer: req.user._id, seller });
    if (existing) return res.status(400).json({ message: "You already reviewed this seller" });

    const review = await Review.create({
      seller,
      buyer: req.user._id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews of a seller
export const getReviewsBySeller = async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId }).populate(
      "buyer",
      "name email"
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews by a buyer
export const getReviewsByBuyer = async (req, res) => {
  try {
    const reviews = await Review.find({ buyer: req.params.buyerId }).populate(
      "seller",
      "name email"
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review (Admin or owner)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (req.user && req.user._id.toString() === review.buyer.toString()) {
      await review.remove();
      return res.json({ message: "Review deleted" });
    }

    if (req.admin) {
      await review.remove();
      return res.json({ message: "Review deleted by admin" });
    }

    return res.status(403).json({ message: "Not authorized to delete this review" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};