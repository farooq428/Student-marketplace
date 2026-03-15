import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function UnderReview() {
  const { user, setUser, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loadingAuth) return; // wait until auth initialized

    if (!user) {
      // Not logged in — send to login
      navigate("/login", { replace: true });
      return;
    }

    // If already verified, go to seller dashboard immediately
    if (user.isVerified) {
      navigate("/seller/dashboard", { replace: true });
      return;
    }

    let isMounted = true;
    let elapsed = 0;
    const intervalMs = 5000; // poll every 5s
    const maxMs = 5 * 60 * 1000; // stop after 5 minutes

    const check = async () => {
      if (!user) return;
      setChecking(true);
      setError(null);
      try {
        // backend route: GET /api/users/profile/:id (protect)
        const id = user._id || user.id;
        const res = await API.get(`/users/profile/${id}`);
        if (!isMounted) return;
        const latest = res.data;
        // update local auth state so rest of app sees isVerified change
        if (latest && latest.isVerified) {
          setUser((prev) => ({ ...(prev || {}), ...latest }));
          navigate("/seller/dashboard", { replace: true });
          return;
        }
      } catch (err) {
        // If unauthorized, force login
        if (err?.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        // show non-fatal error and continue polling
        setError("Unable to check verification status. Retrying...");
      } finally {
        setChecking(false);
      }
    };

    // Run immediately then on interval until timeout or verified
    check();
    const timer = setInterval(() => {
      elapsed += intervalMs;
      if (elapsed >= maxMs) {
        clearInterval(timer);
        return;
      }
      check();
    }, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [user, loadingAuth, navigate, setUser]);

  return (
    <div className="max-w-xl mx-auto text-center mt-20 px-4">
      <h1 className="text-2xl font-semibold">Registration Under Review</h1>
      <p className="mt-4 text-gray-600">
        Your registration is under review by the admin. We will redirect you when your
        account is approved.
      </p>

      <div className="mt-6">
        {checking ? (
          <div className="inline-flex items-center space-x-2 text-sm text-gray-700">
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span>Checking verification status...</span>
          </div>
        ) : (
          <div className="text-sm text-gray-500">We will check every few seconds.</div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default UnderReview;
