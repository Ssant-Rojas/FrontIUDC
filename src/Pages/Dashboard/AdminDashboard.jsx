import React from "react";
import Charts from "../../components/Dashboard/Charts";
import Stats from "../../components/Dashboard/Stats";
import "../../styles/Dashboard.css";

function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <h1>Panel de Administración</h1>

      {/* Estadísticas rápidas */}
      <div className="stats-section">
        <Stats title="Tickets Abiertos" value={120} />
        <Stats title="Tickets Resueltos" value={300} />
        <Stats title="Promedio Resolución (Días)" value={2.4} />
        <Stats title="Tickets Vencidos" value={15} />
      </div>

      {/* Gráficos */}
      <div className="charts-section">
        <Charts />
      </div>
    </div>
  );
}

export default AdminDashboard;
