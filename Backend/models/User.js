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
      // store emails in lowercase to avoid case-sensitive duplicates
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    university: {
      type: String,
      // Not required at registration; users can add university later when
      // they choose to sell items.
      required: false,
    },

    department: {
      type: String,
    },

    role: {
      type: String,
      // Role value is informational only. New users default to 'buyer'.
      default: "buyer",
    },

    profileImage: {
      type: String,
    },
    studentCardImage: {
      type: String,
    },

    // store the back side of student card if provided during onboarding
    cardBackImage: {
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