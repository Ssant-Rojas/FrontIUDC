import { Link } from "react-router-dom";
import "../../styles/Unauthorized.css";

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <h1>Acceso Denegado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <Link to="/" className="unauthorized-link">
        Volver al inicio
      </Link>
    </div>
  );
};

export default Unauthorized;
