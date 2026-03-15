import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin as loginAdminApi } from "../../api/adminApi";
import { AuthContext } from "../../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginAdmin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginAdminApi({ email, password });

      // Use AuthContext to store admin and token so ProtectedRoute/VerificationGuard
      // see the admin immediately (AuthContext.loginAdmin saves to localStorage and state)
      if (loginAdmin) {
        loginAdmin(res, res.token);
      } else {
        // fallback: store token + admin in localStorage
        localStorage.setItem("adminToken", res.token);
        localStorage.setItem("admin", JSON.stringify(res));
      }

      // Redirect to dashboard
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Admin Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;