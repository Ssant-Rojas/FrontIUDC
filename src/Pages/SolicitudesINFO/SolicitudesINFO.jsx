import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import '../../styles/SolicitudesINFO.css';

const server = 'http://localhost:8080';

function SolicitudesINFO({ ticket }) {
  if (!ticket) return <p>No hay datos del ticket para mostrar.</p>;

  return (
    <div className="ticket-resumen">
      <h2>Resumen del Ticket</h2>
      <div className="field-group">
        <label>Usuario que solicita:</label>
        <div>{ticket.usuario || 'No especificado'}</div>
      </div>
      <div className="field-group">
        <label>Teléfono de contacto:</label>
        <div>{ticket.telefono || 'No especificado'}</div>
      </div>
      <div className="field-group">
        <label>Tipo de matrícula:</label>
        <div>{ticket.tipoSolicitud || 'No especificado'}</div>
      </div>
      <div className="field-group">
        <label>Asunto de la solicitud:</label>
        <div>{ticket.asunto || 'No especificado'}</div>
      </div>
      <div className="field-group large">
        <label>Descripción detallada:</label>
        <pre>{ticket.descripcionDetallada || 'No especificado'}</pre>
      </div>
      {ticket.archivosAdjuntos && ticket.archivosAdjuntos.length > 0 && (
        <div className="field-group">
          <label>Archivos adjuntos:</label>
          <ul>
            {ticket.archivosAdjuntos.map((archivo, index) => (
              <li key={index}>
                <a href={archivo.url} target="_blank" rel="noopener noreferrer">
                  {archivo.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TicketDetails() {
  const { ticketId } = useParams(); 
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Obtener el token almacenado
        const response = await fetch(`${server}/api/pqrs/${ticketId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setTicketData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketId]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return <SolicitudesINFO ticket={ticketData} />;
}

export default TicketDetails;
