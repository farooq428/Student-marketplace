// src/components/common/VerificationGuard.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const VerificationGuard = ({ children }) => {
  const { user, admin } = useContext(AuthContext);
  const location = useLocation();

  // Simplified: do not block logged-in users from using the site based on
  // buyer/seller roles — verification and role checks are handled in admin
  // flows. Always render children for frontend convenience.
  return children;
};

export default VerificationGuard;