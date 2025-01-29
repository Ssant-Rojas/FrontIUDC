import "../../styles/PedirAyuda.css"
import Item from "../../components/Items/Items.jsx"

function PedirAyuda() {
    return (
      <div className="main-container">
        
        <div className="content">
          <aside className="categories">
            <h3>Categorías</h3>
            <ul>
              <li><a href="/pqr">PQR</a></li>
              <li><a href="/pqr">Agendamiento</a></li>
              <li><a href="/pqr">Pagos</a></li>
              <li><a href="/pqr">Citas</a></li>
            </ul>
          </aside>
  
          <main className="popular-items">
            <div className="header">
              <h2>Elementos populares</h2>
            </div>
  
            <div className="items-grid">
                <Item 
                    title="Citas" 
                    description="Agenda tus citas para recibir atención personalizada o asistencia académica." 
                    button="Ver detalles" 
                    link="/citas" 
                />
                <Item title="Matriculas" description="Consulta y gestiona el proceso de matrículas para nuevos y antiguos estudiantes." button="Ver detalles" link="/matriculas" />
                <Item title="PQR'S" description="Envía tus peticiones, quejas y reclamos para ser atendidos por la administración." button="Ver detalles" link="/pqr" />
                <Item title="Agendamiento de servicios" description="Solicita la reserva de recursos o servicios académicos y administrativos." button="Ver detalles" link="/agendamiento" />
                <Item title="Aplazar" description="Realiza la solicitud de aplazamiento de cursos o servicios." button="Ver detalles" link="/aplazar"/>
                <Item title="Pagos" description="Consulta y realiza tus pagos pendientes de matrículas o servicios." button="Ver detalles" link="/reportar" />
            </div>
          </main>
        </div>
      </div>
    );
  };
  
  export default PedirAyuda;