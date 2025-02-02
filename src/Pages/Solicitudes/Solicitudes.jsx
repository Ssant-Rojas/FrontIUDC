import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth"; // Para obtener el usuario autenticado
import "../../styles/SolicitudesPage.css";

const SolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Obtener datos del usuario autenticado

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch("http://localhost:8081/solicitudes");
        if (!response.ok) throw new Error("Error al cargar las solicitudes");
        const data = await response.json();

        // Filtrar solicitudes por el usuario autenticado
        const filteredSolicitudes = data.filter(
          (solicitud) => solicitud.owner === user.email
        );
        setSolicitudes(filteredSolicitudes);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [user.email]);

  if (loading) return <p className="loading">Cargando solicitudes...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="solicitudes-container">
      <h1 className="title">📄 Mis Solicitudes</h1>
      <div className="solicitudes-list">
        {solicitudes.length > 0 ? (
          solicitudes.map((solicitud) => (
            <div key={solicitud.id} className="solicitud-card">
              <h2 className="solicitud-title">{solicitud.title}</h2>
              <p className="solicitud-description">{solicitud.description}</p>
              <p className="solicitud-status">
                Estado: <strong>{solicitud.status}</strong>
              </p>
              <p className="solicitud-date">
                Fecha: {new Date(solicitud.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="no-solicitudes">No tienes solicitudes creadas.</p>
        )}
      </div>
    </div>
  );
};

export default SolicitudesPage;
