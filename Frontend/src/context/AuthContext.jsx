// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // buyer/seller
  const [admin, setAdmin] = useState(null);     // admin
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Load user
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (tokenPayload.exp < currentTime) {
          logoutUser();
        } else {
          setUser(parsedUser);
        }
      } catch {
        logoutUser();
      }
    }

    // Load admin
    const storedAdmin = localStorage.getItem("admin");
    const adminToken = localStorage.getItem("adminToken");

    if (storedAdmin && adminToken) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        const tokenPayload = JSON.parse(atob(adminToken.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (tokenPayload.exp < currentTime) {
          logoutAdmin();
        } else {
          setAdmin(parsedAdmin);
        }
      } catch {
        logoutAdmin();
      }
    }
    // finished initialization
    setLoadingAuth(false);
  }, []);

  // --- User functions ---
  const loginUser = (userData, token) => {
    const verifiedUser = { ...userData, isVerified: userData.isVerified ?? false };
    localStorage.setItem("user", JSON.stringify(verifiedUser));
    localStorage.setItem("token", token);
    setUser(verifiedUser);
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };


  // --- Admin functions ---
  const loginAdmin = (adminData, token) => {
    localStorage.setItem("admin", JSON.stringify(adminData));
    localStorage.setItem("adminToken", token);
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loadingAuth,
        loginUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        setUser,
        setAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};