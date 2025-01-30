import React, { useEffect, useState } from "react";
import "../../styles/Solicitudes.css";

const server = "http://localhost:8080";

function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = localStorage.getItem("authToken"); // ✅ Obtener token

        const response = await fetch(`${server}/api/pqrs`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setSolicitudes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="solicitudes-page">
      <h1>Solicitudes</h1>
      {solicitudes.length === 0 ? (
        <p>No hay solicitudes disponibles</p>
      ) : (
        <table className="solicitudes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Descripción</th>
              <th>Fecha de Creación</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id}>
                <td>{solicitud.id}</td>
                <td>{solicitud.estado}</td>
                <td>{solicitud.descripcion}</td>
                <td>{new Date(solicitud.creado).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SolicitudesPage;
