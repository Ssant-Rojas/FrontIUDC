import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Usuario cargado desde localStorage:", parsedUser); // 🔍 Depuración
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    console.log("Guardando usuario en contexto:", userData); // 🔍 Depuración
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext(); // ✅ Exportación correcta

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("authToken") || null);
//   const [isAuthenticated, setIsAuthenticated] = useState(!!token);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setIsAuthenticated(!!token);
//     if (token) {
//       try {
//         const decodedToken = JSON.parse(atob(token.split(".")[1]));
//         setUser(decodedToken);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         logout();
//       }
//     }
//   }, [token]);

//   const login = (newToken) => {
//     localStorage.setItem("authToken", newToken);
//     setToken(newToken);
//     setIsAuthenticated(true);
//     const decodedToken = JSON.parse(atob(newToken.split(".")[1]));
//     setUser(decodedToken);
//     navigate("/admin/tickets");
//   };

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     setToken(null);
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
