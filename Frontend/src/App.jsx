import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Common Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

// Auth Forms
import LoginForm from "./components/forms/LoginForm";
import RegisterForm from "./components/forms/RegisterForm";

// Seller Pages
import Dashboard from "./pages/seller/Dashboard";
import MyProducts from "./pages/seller/MyProducts";
import ProductForm from "./components/forms/ProductForm";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import VerifyUsers from "./pages/admin/VerifyUsers";
import AllOrders from "./pages/admin/AllOrders";

const App = () => {
  return (
    <AuthProvider>
      {/* Flex container to push footer to bottom */}
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* Main content grows to fill remaining space */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Protected Routes (Buyer) */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute roles={["buyer", "seller"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute roles={["buyer", "seller"]}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute roles={["buyer", "seller", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Seller Routes */}
            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute roles={["seller"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/my-products"
              element={
                <ProtectedRoute roles={["seller"]}>
                  <MyProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/add-product"
              element={
                <ProtectedRoute roles={["seller"]}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/edit-product/:id"
              element={
                <ProtectedRoute roles={["seller"]}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/verify-users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <VerifyUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/all-orders"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AllOrders />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Sticky footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;