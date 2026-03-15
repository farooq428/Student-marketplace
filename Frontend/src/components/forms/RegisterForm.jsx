import { useState, useContext } from "react";
import { registerUser } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {

      // Basic client-side validation
      const name = (formData.name || "").trim();
      const email = (formData.email || "").trim().toLowerCase();
      const password = (formData.password || "").trim();

      if (!name || !email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

  // send JSON payload for simple registration (no files/university required)
  const res = await registerUser({ name, email, password });

  // Log the user in (any registered user can act as buyer/seller)
  loginUser(res.user, res.token);

  navigate("/");

    } catch (err) {
      // Show detailed server error when available
      console.error("Register error:", err);
      const serverMessage = err.response?.data?.message;
      const status = err.response?.status;
      if (serverMessage) {
        setError(`${status ? status + ": " : ""}${serverMessage}`);
      } else {
        setError("Registration failed. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h2>
          <p className="text-sm text-gray-500 mb-4">Join Green Track — a student marketplace to buy and sell used items</p>

          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input name="name" placeholder="Your name" onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" placeholder="you@university.edu" onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Create a password" onChange={handleChange} className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" required />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600" aria-label="Toggle password visibility">{showPassword ? "Hide" : "Show"}</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div />
              <Link to="/login" className="text-sm text-green-600 hover:underline">Already have an account? Sign in</Link>
            </div>

            <button disabled={loading} className="w-full mt-2 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">{loading ? "Registering..." : "Create account"}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;