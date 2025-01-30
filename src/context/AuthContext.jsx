import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(!!token);

    if (token) {
      try {
        // ✅ Verificar si el token tiene tres partes separadas por "."
        const parts = token.split(".");
        if (parts.length !== 3) {
          throw new Error("El token no tiene el formato correcto de un JWT.");
        }

        // ✅ Decodificar de forma segura
        const decodedToken = JSON.parse(atob(parts[1]));
        setUser(decodedToken);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setUser(null);
        setToken(null);
        localStorage.removeItem("authToken"); // ✅ Elimina el token inválido
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  
    try {
      const decodedToken = JSON.parse(atob(newToken.split(".")[1]));
      setUser(decodedToken);
      navigate("/principal"); 
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  };
  
  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
