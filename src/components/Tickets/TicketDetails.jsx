import React, { useEffect, useState } from "react";

const AdminTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const { getTickets } = await import('../../services/api.js');
        const data = await getTickets();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p>Cargando tickets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="tickets-container">
      <h1>Listado de Tickets</h1>
      <table className="tickets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.category}</td>
              <td>{ticket.description}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.status}</td>
              <td>
                <button>Ver Detalles</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTicketsList;
