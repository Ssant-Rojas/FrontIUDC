import { useFetch } from "../../hooks/useFetch";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import "../../styles/Dashboard/Dashboard.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext); // Obtenemos el usuario actual del contexto
  const { data: stats, loading, error } = useFetch("http://localhost:8081/stats");
  const { data: ticketStats } = useFetch("http://localhost:8081/ticketStats");
  const { data: categoryStats } = useFetch("http://localhost:8081/categoryStats");

  // Filtrar los tickets según el rol del usuario
  const filteredTicketStats = ticketStats
    ? ticketStats.map((item) => {
        if (user.role === "matriculas") {
          return { month: item.month, matriculas: item.matriculas };
        } else if (user.role === "pagos") {
          return { month: item.month, pagos: item.pagos };
        } else if (user.role === "certificados") {
          return { month: item.month, certificados: item.certificados };
        } else {
          return item; // Si es admin, no filtramos
        }
      })
    : [];

  const filteredCategoryStats = categoryStats
    ? categoryStats.filter((category) => {
        if (user.role === "matriculas") return category.category === "Matriculas";
        if (user.role === "pagos") return category.category === "Pagos";
        if (user.role === "certificados") return category.category === "Certificados";
        return true; // Si es admin, no filtramos
      })
    : [];

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar datos</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Dashboard Administrativo</h1>

      {/* Resumen General */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h2>Usuarios Registrados</h2>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h2>Tickets Abiertos</h2>
            <p className="stat-value">{stats.openTickets}</p>
          </div>
          <div className="stat-card">
            <h2>Tickets Resueltos</h2>
            <p className="stat-value">{stats.resolvedTickets}</p>
          </div>
          <div className="stat-card">
            <h2>Promedio Resolución</h2>
            <p className="stat-value">{stats.avgResolutionTime} días</p>
          </div>
        </div>
      </div>

      {/* Tickets por Mes */}
      <div className="chart-section">
        <h2 className="chart-title">Tickets por Mes</h2>
        <BarChart width={600} height={300} data={filteredTicketStats} className="chart">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          {user.role === "matriculas" && <Bar dataKey="matriculas" fill="#8884d8" />}
          {user.role === "pagos" && <Bar dataKey="pagos" fill="#82ca9d" />}
          {user.role === "certificados" && <Bar dataKey="certificados" fill="#ffc658" />}
          {user.role === "admin" && (
            <>
              <Bar dataKey="matriculas" fill="#8884d8" />
              <Bar dataKey="pagos" fill="#82ca9d" />
              <Bar dataKey="certificados" fill="#ffc658" />
            </>
          )}
        </BarChart>
      </div>

      {/* Distribución de Tickets por Categoría */}
      <div className="chart-section">
        <h2 className="chart-title">Distribución de Tickets por Categoría</h2>
        <PieChart width={400} height={400} className="chart">
          <Pie
            data={filteredCategoryStats}
            cx={200}
            cy={200}
            outerRadius={100}
            dataKey="resolved"
            label
          >
            {filteredCategoryStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;
