import React, { useEffect } from "react";
import TicketItem from "./TicketItem";
import { mostrarNotificacion, configurarNotificaciones } from "../utils/notifications";

const TicketsPage = ({ tickets }) => {
  useEffect(() => {
    configurarNotificaciones(); // Configura las notificaciones al cargar

    tickets.forEach((ticket) => {
      const horasRestantes = (new Date(ticket.fechaVencimiento) - new Date()) / 36e5;

      if (horasRestantes < 0) {
        mostrarNotificacion(`¡El ticket ${ticket.id} ha vencido!`, "error");
      } else if (horasRestantes < 2) {
        mostrarNotificacion(`El ticket ${ticket.id} vence en menos de 2 horas`, "warn");
      }
    });
  }, [tickets]);

  return (
    <div className="tickets-container">
      <h2>Lista de Tickets</h2>
      {tickets.map((ticket) => (
        <TicketItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default TicketsPage;
