import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 

const ProtectedRoute = ({ element, requiredRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;
