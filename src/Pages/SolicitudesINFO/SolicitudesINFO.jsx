import React from "react";
import "../../styles/SolicitudesINFO.css";

function SolicitudesINFO({ ticket }) {
  if (!ticket) {
    return (
      <div className="ticket-resumen">
        <h2>No hay información del ticket</h2>
        <p>Por favor, intenta nuevamente o verifica el ID del ticket.</p>
      </div>
    );
  }

  return (
    <div className="ticket-resumen">
      <h2>Resumen del Ticket</h2>
      <div className="field-group">
        <label>Usuario que solicita:</label>
        <div>{ticket.usuario || "No especificado"}</div>
      </div>
      <div className="field-group">
        <label>Teléfono de contacto:</label>
        <div>{ticket.telefono || "No especificado"}</div>
      </div>
      <div className="field-group">
        <label>Tipo de matrícula:</label>
        <div>{ticket.tipoSolicitud || "No especificado"}</div>
      </div>
      <div className="field-group">
        <label>Asunto de la solicitud:</label>
        <div>{ticket.asunto || "No especificado"}</div>
      </div>
      <div className="field-group large">
        <label>Descripción detallada:</label>
        <pre>{ticket.descripcionDetallada || "No especificado"}</pre>
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

export default SolicitudesINFO;
