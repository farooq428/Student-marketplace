import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    university: {
      type: String,
      required: true,
    },

    department: {
      type: String,
    },

    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },

    profileImage: {
      type: String,
    },

    studentCardImage: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);