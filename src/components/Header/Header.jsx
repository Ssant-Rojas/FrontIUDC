import "./HeaderStyles.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // ✅ Verifica la ruta

function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <div className="Header-TopBar">
      <div className="Logo-Space">
        <div className="Logo">
          <Link to="/principal">
            <img src="src/assets/Logo_universitaria_white.webp" alt="Logo Universitaria" />
          </Link>
        </div>
      </div>
      <div className="Header-Menu">
        {isAuthenticated ? (
          <>
            <Link to="/solicitud" className="Header-Link">Solicitudes</Link>
            <Link to="/admin/tickets" className="Header-Link">Admin Tickets</Link>

            {/* ✅ Si el usuario es admin, mostrar botón Dashboard */}
            {isAuthenticated && user?.rol === "admin" && (
              <Link to="/admin/dashboard" className="Header-Link">
                Dashboard General
              </Link>
            )}

            {/* ✅ Si el usuario es área de ventas, mostrar botón Dashboard ventas */}
            {isAuthenticated && user?.tipoUsuario === "a" && user?.tipoArea === "Ventas" && (
              <Link to="/area/ventas/dashboard" className="Header-Link">
                Dashboard Ventas
              </Link>
            )}

            {/* ✅ Si el usuario es área de pagos, mostrar botón Dashboard pagos */}

            {isAuthenticated && user?.tipoUsuario === "a" && user?.tipoArea === "Pagos" && (
              <Link to="/area/pagos/dashboard" className="Header-Link">
                Dashboard Pagos
              </Link>
            )}
            
            <button onClick={logout} className="Header-Link-Button">Cerrar Sesión</button>

          </>
        ) : (
          <Link to="/" className="Header-Link">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Header;
