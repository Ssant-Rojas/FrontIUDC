import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ element, requiredTipoUsuario }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (requiredTipoUsuario && user.tipoUsuario !== requiredTipoUsuario) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;
