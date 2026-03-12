import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);