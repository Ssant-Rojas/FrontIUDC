import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth"; 
import "../../../styles/AdminTicketsList.css";

const AdminTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("");
  const [expirationFilter, setExpirationFilter] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); 

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        console.log("📡 Fetching tickets desde:", "http://localhost:8081/tickets");
        const response = await fetch("http://localhost:8081/tickets");
        if (!response.ok) throw new Error("⚠️ Error al cargar los tickets");

        const data = await response.json();
        console.log("✅ Tickets cargados:", data);

        let filteredData;
        if (user.role === "admin") {
          filteredData = data; // Admin ve todos los tickets
        } else {
          filteredData = data.filter(ticket => ticket.assignedArea === user.role || ticket.category === user.role);
        }

        setTickets(filteredData);
        setFilteredTickets(filteredData);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error al obtener los tickets:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchTickets();
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    let filtered = tickets;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    if (dateFilter === "hoy") {
      filtered = filtered.filter(ticket => new Date(ticket.createdAt).toDateString() === today.toDateString());
    } else if (dateFilter === "ayer") {
      filtered = filtered.filter(ticket => new Date(ticket.createdAt).toDateString() === yesterday.toDateString());
    } else if (dateFilter === "ultimos7") {
      filtered = filtered.filter(ticket => new Date(ticket.createdAt) >= last7Days);
    } else if (dateFilter === "ultimos30") {
      filtered = filtered.filter(ticket => new Date(ticket.createdAt) >= last30Days);
    }

    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    if (expirationFilter === "Expirado") {
      filtered = filtered.filter(ticket => ticket.expiration && new Date(ticket.expiration) < new Date());
    }

    setFilteredTickets(filtered);
  }, [dateFilter, statusFilter, expirationFilter, tickets]);

  const handleViewDetails = (id) => {
    console.log(`🔍 Navegando al ticket ${id}`);
    navigate(`/admin/tickets/${id}`);
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  if (loading) return <p className="loading">Cargando tickets...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="tickets-container">
      <h1 className="title">🎫 Listado de Tickets</h1>

      <div className="filters">
        <label>Filtrar por fecha:</label>
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="hoy">Hoy</option>
          <option value="ayer">Ayer</option>
          <option value="ultimos7">Últimos 7 días</option>
          <option value="ultimos30">Últimos 30 días</option>
        </select>

        <label>Filtrar por estado:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Cerrado">Cerrado</option>
        </select>

        <label>Filtrar expiración:</label>
        <select value={expirationFilter} onChange={(e) => setExpirationFilter(e.target.value)}>
          <option value="">Todos</option>
          <option value="Expirado">Expirado</option>
        </select>
      </div>

      <div className="tickets-list">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
            const isExpired = ticket.expiration && new Date(ticket.expiration) < new Date();
            const isClosed = ticket.status?.toLowerCase() === "cerrado";

            return (
              <div 
                key={ticket.id} 
                className={`ticket-card ${isExpired ? "expired" : ""} ${isClosed ? "closed" : ""}`} 
                onClick={() => handleViewDetails(ticket.id)}
              >
                <div className="ticket-header">
                  <h2 className="ticket-category">
                    {ticket.category} - {ticket.id}
                  </h2>
                  <span className={`priority ${ticket.priority?.toLowerCase() || "media"}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="ticket-description">{ticket.description}</p>
                <div className="ticket-footer">
                  <span className={`status ${ticket.status?.toLowerCase() || "desconocido"}`}>
                    {ticket.status}
                  </span>
                  <span className="ticket-date">
                    Creado: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  {ticket.expiration && (
                    <span className={`ticket-expiration ${isExpired ? "expired-text" : ""}`}>
                      {isExpired ? "Expirado" : `Expira: ${new Date(ticket.expiration).toLocaleDateString()}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-tickets">No hay tickets disponibles para tu área.</p>
        )}
      </div>
    </div>
  );
};

export default AdminTicketsList;
