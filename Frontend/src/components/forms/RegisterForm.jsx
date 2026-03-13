import { useState, useContext } from "react";
import { registerUser } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    department: "",
    role: "buyer",
    profileImage: "",
    studentCardImage: "",
  });

  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await registerUser(formData);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <input
        type="text"
        name="university"
        placeholder="University"
        value={formData.university}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>

      <input
        type="text"
        name="profileImage"
        placeholder="Profile Image URL"
        value={formData.profileImage}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="text"
        name="studentCardImage"
        placeholder="Student Card Image URL"
        value={formData.studentCardImage}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;