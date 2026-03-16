import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hideIfActive = (path) => {
    if (!path) return false;
    // hide when exact match or when current path is a subpath of the link
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center font-bold">G</div>
              <span className="font-semibold text-lg text-gray-800">Green Track</span>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-gray-600">
              {!hideIfActive('/shop') && (
                <Link to="/shop" className="hover:text-green-600">Shop</Link>
              )}
              {!hideIfActive('/seller/my-products') && (
                <Link to="/seller/my-products" className="hover:text-green-600">My Products</Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <input
                type="search"
                placeholder="Search products..."
                className="px-3 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="hidden md:flex items-center gap-3">
              {!hideIfActive('/cart') && (
                <Link to="/cart" className="text-gray-600 hover:text-green-600">Cart</Link>
              )}
              {user ? (
                <>
                  {!hideIfActive('/profile') && (
                    <Link to="/profile" className="text-gray-600 hover:text-green-600">{user.name}</Link>
                  )}
                  <button
                    onClick={() => { setOpen(false); logoutUser(); navigate('/'); }}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  {!hideIfActive('/login') && (
                    <Link to="/login" className="text-gray-600 hover:text-green-600">Sign in</Link>
                  )}
                  {!hideIfActive('/register') && (
                    <Link to="/register" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Sign up</Link>
                  )}
                </>
              )}
            </div>

            <button className="md:hidden p-2 rounded-lg border" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3 flex flex-col gap-2">
            {!hideIfActive('/shop') && (
              <Link to="/shop" onClick={() => setOpen(false)} className="py-2">Shop</Link>
            )}

            {!hideIfActive('/seller/my-products') && (
              <Link to="/seller/my-products" onClick={() => setOpen(false)} className="py-2">My Products</Link>
            )}

            {!hideIfActive('/cart') && (
              <Link to="/cart" onClick={() => setOpen(false)} className="py-2">Cart</Link>
            )}

            {user ? (
              <>
                {!hideIfActive('/profile') && (
                  <Link to="/profile" onClick={() => setOpen(false)} className="py-2">Profile</Link>
                )}
                <button onClick={() => { setOpen(false); logoutUser(); navigate('/'); }} className="py-2 text-left text-red-500">Logout</button>
              </>
            ) : (
              <>
                {!hideIfActive('/login') && (
                  <Link to="/login" onClick={() => setOpen(false)} className="py-2">Login</Link>
                )}
                {!hideIfActive('/register') && (
                  <Link to="/register" onClick={() => setOpen(false)} className="py-2">Register</Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;