// ProtectedRoute.jsx - CORRECTED VERSION
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // Show loading state while checking authentication
if (loading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/properties" replace />;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
