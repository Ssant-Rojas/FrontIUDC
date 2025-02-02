import React, { useEffect, useState } from "react";
import TicketItem from "./TicketItem";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";

const AdminTicketsPage = () => {
  const { data: tickets, loading, error } = useFetch("/api/tickets");
  const { token } = useAuth();
  const [filter, setFilter] = useState("todos");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTickets = tickets
    ? tickets.filter(ticket => (filter === "todos" ? true : ticket.estado === filter))
    : [];

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar tickets</p>;

  return (
    <div>
      <h1>Gestión de Tickets</h1>
      <select onChange={handleFilterChange}>
        <option value="todos">Todos</option>
        <option value="pendiente">Pendiente</option>
        <option value="en_proceso">En proceso</option>
        <option value="cerrado">Cerrado</option>
      </select>
      <div className="ticket-list">
        {filteredTickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default AdminTicketsPage;
