import "./HeaderStyles.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);

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
