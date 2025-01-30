import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import { toast } from "react-toastify";

const server = "http://localhost:8080";

const Dashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // Redirige al login si no está autenticado
    }

    if (user?.rol === "admin") {
      fetchGlobalStats(); // Cargar estadísticas globales para admin
    } else if (user?.tipoArea) {
      fetchAreaStats(user.tipoArea, user.rol); // Cargar estadísticas por área y rol
    }
  }, [isAuthenticated, user, navigate]);

  const fetchGlobalStats = async () => {
    try {
      const response = await fetch(`${server}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error("No se pudieron cargar las estadísticas globales");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAreaStats = async (area, rol) => {
    try {
      const response = await fetch(`${server}/api/area/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error("No se pudieron cargar las estadísticas del área");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bienvenido, {user?.sub || "Usuario"}</h1>
        <p>{user?.rol === "admin" ? "Admin Dashboard" : `Dashboard - Área: ${user?.tipoArea}`}</p>
      </header>

      <div className="dashboard-content">
        {stats ? (
          <div className="stats-grid">
            {Object.keys(stats).map((key) => (
              <div className="stat-card" key={key}>
                <h3>{key.replace(/([a-z])([A-Z])/g, "$1 $2")}</h3>
                <p>{stats[key]}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Cargando estadísticas...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
