import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import '../../styles/DatasDetails.css';

const server = 'http://localhost:8080';

function TicketDetails() {
  const { ticketId } = useParams(); 
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${server}/api/pqrs/${ticketId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer <token>' //falta token de auth D:
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setTicketData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [ticketId]);

  if (error) return <p>Error: {error}</p>;
  if (!ticketData) return <p>Cargando...</p>;

  return (
    <div className="ticket-details">
      <h1>Detalles del Ticket</h1>
      <div className="field-group">
        <label>Usuario que solicita:</label>
        <div>{ticketData.usuario || "No especificado"}</div>
      </div>
      <div className="field-group">
        <label>¿En qué carrera te encuentras?</label>
        <div>{ticketData.carrera || "No especificado"}</div>
      </div>
      <div className="field-group">
        <label>Teléfono de contacto:</label>
        <div>{ticketData.telefono || "No especificado"}</div>
      </div>
      <div className="field-group">
        <label>Ubicación física detallada:</label>
        <div>{ticketData.solicitud || "No especificado"}</div>
      </div>
      <div className="field-group large">
        <label>Detalles de la solicitud:</label>
        <pre>{ticketData.detallesSolicitud || "No especificado"}</pre>
      </div>
      {ticketData.archivosAdjuntos && ticketData.archivosAdjuntos.length > 0 && (
        <div className="field-group large">
          <label>Archivos Adjuntos:</label>
          <ul className="attachment-list">
            {ticketData.archivosAdjuntos.map((archivo, index) => (
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

export default TicketDetails;
