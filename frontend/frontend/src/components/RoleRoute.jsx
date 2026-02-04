import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait while checking authentication
  if (loading) return null;

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if user doesn't have required role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/properties" replace />;
  }

  // Render protected content
  return children;
};

export default RoleRoute;