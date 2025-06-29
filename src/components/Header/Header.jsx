import "./HeaderStyles.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext"; 

function Header() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  return (
    <div className="Header-TopBar">
      <div className="Logo-Space">
        <div className="Logo">
          <Link to="/principal">
            <img src="src/assets/Logo_universitaria_white.webp" alt="Logo Universitaria" />
          </Link>
        </div>
      </div>

        <div className="Hamburger" onClick={toggleMenu}>
        <div/>
        <div/>
        <div/>
      </div>

      <div className={`Header-Menu ${menuOpen ? "open" : ""}`}>
        {isAuthenticated ? (
          <>
            <Link to="/solicitud/crear" className="Header-Link">Crear Solicitud</Link>
            <Link to="/solicitud" className="Header-Link">Mis Solicitudes</Link>

          {isAuthenticated && user?.rol === "admin" && (
          <>
            <Link to="/admin/tickets" className="Header-Link">
              Admin Tickets
            </Link>
            <Link to="/admin/dashboard" className="Header-Link">
              Dashboard General
            </Link>
            <Link to="/admin/users" className="Header-Link">
              Gestión de Usuarios
            </Link>
          </>
        )}
        {isAuthenticated && user?.rol === "Matrículas" && (
          <div>
            <Link to="/admin/tickets" className="Header-Link">
            Admin Tickets
          </Link>
       
          </div>
        )}
        {isAuthenticated && user?.rol === "pagos" && (
          <div>
          <Link to="/admin/tickets" className="Header-Link">
          Admin Tickets
        </Link>

          </div>
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
