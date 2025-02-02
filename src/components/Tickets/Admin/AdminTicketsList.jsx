import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth"; // Para obtener el usuario actual
import "../../../styles/AdminTicketsList.css";

const AdminTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener el usuario actual para filtrar tickets

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:8081/tickets");
        if (!response.ok) throw new Error("Error al cargar los tickets");
        const data = await response.json();
        setTickets(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getFormattedTicketId = (category, id) => {
    const prefixes = {
      "Matrículas": "IUDCM",
      "Pagos": "IUDCP",
      "Certificados": "IUDCC",
    };
    return `${prefixes[category] || "IUDC"}${id}`;
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/tickets/${id}`);
  };

  // Filtrar tickets según el rol del usuario
  const filteredTickets =
    user?.role === "admin"
      ? tickets
      : tickets.filter(
          (ticket) =>
            ticket.category.toLowerCase() === user.role.toLowerCase()
        );

  if (loading) return <p className="loading">Cargando tickets...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="tickets-container">
      <h1 className="title">🎫 Listado de Tickets</h1>
      <div className="tickets-list">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket-card"
              onClick={() => handleViewDetails(ticket.id)}
            >
              <div className="ticket-header">
                <h2 className="ticket-category">
                  {getFormattedTicketId(ticket.category, ticket.id)} -{" "}
                  {ticket.category}
                </h2>
                <span
                  className={`priority ${ticket.priority.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>
              </div>
              <p className="ticket-description">{ticket.description}</p>
              <div className="ticket-footer">
                <span
                  className={`status ${ticket.status
                    .replace(" ", "")
                    .toLowerCase()}`}
                >
                  {ticket.status}
                </span>
                <span className="ticket-date">
                  Creado: {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-tickets">
            No hay tickets disponibles para tu rol.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminTicketsList;
