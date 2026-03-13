import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">
        Student Marketplace
      </Link>

      <div className="flex gap-4">

        <Link to="/shop">Shop</Link>

        {user && user.role === "seller" && (
          <Link to="/seller/dashboard">Dashboard</Link>
        )}

        {user && (
          <Link to="/cart">Cart</Link>
        )}

        {user && (
          <Link to="/profile">Profile</Link>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;