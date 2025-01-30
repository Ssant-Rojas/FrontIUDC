import '../../styles/PedirAyuda.css';
import { useNavigate } from 'react-router-dom';

function PedirAyuda() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="main-container">
      {/* Categorías a la izquierda */}
    

      {/* Elementos populares al lado derecho */}
      <section className="popular-section">
        <div className="popular-card">
          <h4>Citas</h4>
          <p>Agenda tus citas para recibir atención personalizada.</p>
          <button onClick={() => handleNavigate('/citas')}>Ver detalles</button>
        </div>
        <div className="popular-card">
          <h4>PQR'S</h4>
          <p>Envía tus peticiones, quejas y reclamos para ser atendidos.</p>
          <button onClick={() => handleNavigate('/pqr')}>Ver detalles</button>
        </div>
        <div className="popular-card">
          <h4>Pagos</h4>
          <p>Consulta y realiza tus pagos pendientes de matrículas o servicios.</p>
          <button onClick={() => handleNavigate('/pagos')}>Ver detalles</button>
        </div>
      </section>
    </div>
  );
}

export default PedirAyuda;
