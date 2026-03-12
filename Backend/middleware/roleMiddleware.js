// Admin-only middleware
export const admin = (req, res, next) => {
  if ((req.user && req.user.role === "admin") || req.admin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// Seller-only middleware
export const seller = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    next();
  } else {
    res.status(403).json({ message: "Seller access only" });
  }
};

// Buyer-only middleware
export const buyer = (req, res, next) => {
  if (req.user && req.user.role === "buyer") {
    next();
  } else {
    res.status(403).json({ message: "Buyer access only" });
  }
};

// Allow multiple roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied for this role" });
    }
  };
};