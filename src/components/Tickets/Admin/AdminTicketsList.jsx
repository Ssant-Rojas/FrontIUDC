import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth"; 
import "../../../styles/AdminTicketsList.css";
import apiService from "../../../services/api.js";

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
        setLoading(true);
        const data = await apiService.get('/tickets');
        let filteredData = data;

        if (user.rol !== "admin" && user.rol !== "ADMIN") {
          filteredData = data.filter(ticket => {
            if (!ticket.category || !ticket.category.assignedArea) {
              console.warn("⚠️ Ticket con estructura incorrecta:", ticket);
              return false;
            }

            const areaMatch = ticket.category.assignedArea.nombre === user.rol;
            const categoryMatch = ticket.category.name === user.rol;

            console.log(`🔍 Ticket ${ticket.id} - Area: ${ticket.category.assignedArea.nombre}, Categoría: ${ticket.category.name}, Coincide: ${areaMatch || categoryMatch}`);

            return areaMatch || categoryMatch;
          });
        }

        console.log("🔄 Tickets filtrados para el usuario:", filteredData);
        setTickets(filteredData);
        setFilteredTickets(filteredData);
      } catch (err) {
        console.error("❌ Error al obtener los tickets:", err);
        setError("Error al cargar tickets: " + (err.message || "Error desconocido"));
      } finally {
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
        <h1 className="title">🎫 Listado de Tickets ({filteredTickets.length})</h1>
        {tickets.length === 0 && !loading && !error && <p className="no-tickets">No se encontraron tickets en el sistema.</p>}

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
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Resuelto">Resuelto</option>
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
            const isClosed = ticket.status?.toLowerCase() === "cerrado" || ticket.status?.toLowerCase() === "resuelto";

            return (
              <div 
                key={ticket.id} 
                className={`ticket-card ${isExpired ? "expired" : ""} ${isClosed ? "closed" : ""}`} 
                onClick={() => handleViewDetails(ticket.id)}
              >

                <div className="ticket-header">
                  <h2 className="ticket-category">
                    {ticket.category.name} - {ticket.id}
                  </h2>
                  <span className={`priority ${ticket.priority?.toLowerCase() || "media"}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="ticket-description">{ticket.description}</p>
                {ticket.messages && ticket.messages.length > 0 && (
                    <div className="ticket-messages">
                      <p className="messages-count">Mensajes: {ticket.messages.length}</p>
                    </div>
                )}
                <div className="ticket-footer">
                  <span className={`status ${ticket.status?.toLowerCase() || "desconocido"}`}>
                    {ticket.status}
                  </span>
                  <span className="ticket-date">
                    Creado: {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                  </span>
                  <span className="ticket-area">
                    Área: {ticket.category.assignedArea.nombre}
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
