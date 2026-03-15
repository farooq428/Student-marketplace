// src/components/common/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, admin } = useContext(AuthContext);
  const { loadingAuth } = useContext(AuthContext);

  // Wait for auth initialization to finish to avoid redirecting during refresh
  if (loadingAuth) return null;

  // Admins can access any protected route
  if (admin) return children;

  // Require a logged-in user for non-admin routes
  if (!user) return <Navigate to="/login" replace />;

  // We no longer enforce buyer/seller role checks here — any authenticated
  // user can access buyer/seller functionality. If `roles` is provided and
  // includes a non-role value, fall back to basic role check for backward
  // compatibility.
  // Sellers must be verified by admin before accessing seller features.
  if (user?.role === "seller" && !user?.isVerified) {
    return <Navigate to="/under-review" replace />;
  }
  if (roles && roles.length > 0) {
    // If the route explicitly requires admin, it was already handled above.
    // For other specific role requirements, allow if the user's role matches.
    if (!roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;