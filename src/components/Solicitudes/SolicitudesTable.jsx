import React from 'react';

function SolicitudesTable({ solicitudes, onSelectSolicitud }) {
  return (
    <div className="table-container">
      <h3>Solicitudes</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Estado</th>
            <th>Descripción</th>
            <th>Creado</th>
            <th>Expira</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.numero} onClick={() => onSelectSolicitud(solicitud)}>
              <td>{solicitud.numero}</td>
              <td>{solicitud.estado}</td>
              <td>{solicitud.descripcion}</td>
              <td>{solicitud.creado}</td>
              <td>{solicitud.expiration	}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SolicitudesTable;
