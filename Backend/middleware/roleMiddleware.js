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
  // Allow any authenticated user to act as a seller. Previously this
  // required req.user.role === 'seller'. Now any logged-in user is allowed.
  if (req.user) {
    return next();
  }
  res.status(403).json({ message: "Authenticated users only" });
};

// Buyer-only middleware
export const buyer = (req, res, next) => {
  // Allow any authenticated user to act as a buyer as well.
  if (req.user) {
    return next();
  }
  res.status(403).json({ message: "Authenticated users only" });
};

// Allow multiple roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // If the requested roles include buyer/seller, allow any authenticated
    // user (we treat buyer/seller behavior as available to all logged-in users).
    if (roles.includes("buyer") || roles.includes("seller")) {
      if (req.user) return next();
      return res.status(403).json({ message: "Authenticated users only" });
    }

    // Admin role still requires explicit admin permission or req.user.role === 'admin'.
    if ((req.user && roles.includes(req.user.role)) || (req.admin && roles.includes("admin"))) {
      return next();
    }

    res.status(403).json({ message: "Access denied for this role" });
  };
};