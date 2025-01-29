import '../../styles/Principal.css';
import { useNavigate } from 'react-router-dom';

function PrincipalPage() {
  const navigate = useNavigate();

  const handleSolicitarAyudaClick = () => {
    navigate('/pedirAyuda');
  };

  return (
    <>
      {/* Contenedor principal */}
      <div className="main-container">
        {/* Sección de búsqueda */}
        <header className="header-search">
          <h1>¿Cómo podemos asistirte?</h1>
          <div className="search-box">
            <input type="text" placeholder="¿Qué estás buscando?" />
            <button className="search-button">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </header>

        {/* Sección de opciones */}
        <section className="options-section">
          {/* Botón activo */}
          <div className="option" onClick={handleSolicitarAyudaClick}>
            <i className="fa fa-shopping-bag option-icon"></i>
            <h2>Solicitar asistencia</h2>
            <p>Accede a servicios y recursos disponibles.</p>
          </div>

          {/* Botones desactivados */}
          <div className="option disabled-option">
            <i className="fa fa-hands-helping option-icon"></i>
            <h2>Soporte académico</h2>
            <p>Resuelve dudas académicas o administrativas.</p>
          </div>
          <div className="option disabled-option">
            <i className="fa fa-book option-icon"></i>
            <h2>Base de conocimiento</h2>
            <p>Consulta guías y recursos informativos.</p>
          </div>
        </section>
      </div>
    </>
  );
}

export default PrincipalPage;
