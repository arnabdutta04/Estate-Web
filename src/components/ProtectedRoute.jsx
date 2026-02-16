// ProtectedRoute.jsx - DEBUG VERSION (Temporary)
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 🐛 DEBUG LOGS - Check browser console!
  console.log("=== ProtectedRoute Debug ===");
  console.log("Loading:", loading);
  console.log("User:", user);
  console.log("Path:", location.pathname);
  console.log("============================");

  if (loading) {
    console.log("⏳ Still loading, returning null");
    return null;
  }

  if (!user) {
    console.log("❌ No user, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log("✅ Rendering protected content");
  return children;
};

export default ProtectedRoute;