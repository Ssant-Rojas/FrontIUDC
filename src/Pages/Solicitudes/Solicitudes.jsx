import React, { useState, useEffect } from 'react';
import "../../styles/Solicitudes.css"

//const server = 'http://localhost:8080';  

function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setTimeout(() => {
          const mockData = [
            {
              id: 1,
              estado: 'Pendiente',
              descripcion: 'Solicitud de informe mensual',
              creado: '2024-11-25T12:00:00Z',
            },
            {
              id: 2,
              estado: 'Completada',
              descripcion: 'Consulta sobre el sistema de reportes',
              creado: '2024-11-20T08:00:00Z',
            },
            {
              id: 3,
              estado: 'En proceso',
              descripcion: 'Solicitud de nueva funcionalidad en la app',
              creado: '2024-11-22T14:30:00Z',
            },
          ];
          
          setSolicitudes(mockData);
          setLoading(false);
        }, 1000); 
      } catch (err) {
        setError(err.message);
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
