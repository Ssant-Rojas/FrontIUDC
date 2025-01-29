import './HeaderStyles.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica si el token de autenticación está presente en localStorage
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);  // Si hay un token, el usuario está autenticado
  }, []);

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
          </>
        ) : (
          <Link to="/login" className="Header-Link">Login</Link>
        )}
      </div>
    </div>
  );
}

export default Header;
