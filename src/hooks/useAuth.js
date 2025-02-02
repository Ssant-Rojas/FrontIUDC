// import { useContext, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export const useAuth = () => {
//   const { token, isAuthenticated, login, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Función para obtener el token almacenado
//   const getAuthToken = () => {
//     return token || localStorage.getItem("authToken");
//   };

//   // Verificar si el usuario sigue autenticado cuando la app se monta
//   useEffect(() => {
//     if (!getAuthToken()) {
//       logout(); // Si el token no está, cerrar sesión automáticamente
//     }
//   }, []);

//   return { token, isAuthenticated, login, logout, getAuthToken };
// };


import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ Importación correcta

export const useAuth = () => {
  return useContext(AuthContext);
};
