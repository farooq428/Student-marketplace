import User from "../models/User.js";

export const verified = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Your registration is under process. Please wait until admin verification.",
      });
    }

    // User is verified, allow access
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};