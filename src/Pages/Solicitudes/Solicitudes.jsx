import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../../styles/SolicitudesPage.css";
import apiService from "../../services/api.js";

const SolicitudesPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await apiService.get('/tickets');
        setTickets(data);
        setLoading(false);

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user.email]);

  const calculateExpiration = (priority) => {
    const expirationDays = {
      Alta: 1,
      Media: 3,
      Baja: 7,
    };
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + (expirationDays[priority] || 3));
    return expirationDate.toISOString();
  };
  const handleTicketClick = (id) => {
    navigate('/admin/tickets/'+ id );
  };

  const handleCreateTicket = async (nuevoTicket) => {
    try {
      const newTicket = {
        ...nuevoTicket,
        status: "Pendiente",
        createdAt: new Date().toISOString(),
        expiration: calculateExpiration(nuevoTicket.priority),
        owner: user.email,
      };

      const response = await fetch("http://localhost:8081/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      if (!response.ok) throw new Error("Error al crear el ticket");

      setTickets((prev) => [...prev, newTicket]);
    } catch (err) {
      console.error("Error al guardar el ticket:", err);
    }
  };

  if (loading) return <p className="loading">Cargando tickets...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="solicitudes-container">
      <h1 className="title">📄 Mis Tickets</h1>
      <div className="solicitudes-list">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket.id} className="solicitud-card" onClick={() => handleTicketClick(ticket.id)} style={{cursor: "pointer"}}>
              <h2 className="solicitud-title">{ticket.title || "Sin título"}</h2>
              <p className="solicitud-description">{ticket.description}</p>
              <p className="solicitud-status">
                Estado: <strong>{ticket.status}</strong>
              </p>
              <p className="solicitud-date">
                Creado: {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
              <p className="solicitud-date">
                Expira: {new Date(ticket.expiration).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="no-solicitudes">No tienes tickets creados.</p>
        )}
      </div>
    </div>
  );
};

export default SolicitudesPage;
