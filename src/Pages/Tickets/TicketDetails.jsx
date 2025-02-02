import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/TicketDetails.css";
import { toast } from "react-toastify";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`http://localhost:8081/tickets/${id}`);
        if (!response.ok) throw new Error("Error al cargar el ticket");
        const data = await response.json();
        setTicket(data);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  const getFormattedTicketId = (category, id) => {
    const prefixes = {
      "Matrículas": "IUDCM",
      "Pagos": "IUDCP",
      "Certificados": "IUDCC"
    };
    return `${prefixes[category] || "IUDC"}${id}`;
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();

    if (ticket.status === "Cerrado") return;

    const newMessage = {
      author: "Admin",
      text: response,
      timestamp: new Date().toISOString(),
    };

    const updatedTicket = {
      ...ticket,
      messages: ticket.messages ? [...ticket.messages, newMessage] : [newMessage],
    };

    try {
      const res = await fetch(`http://localhost:8081/tickets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTicket),
      });

      if (!res.ok) throw new Error("Error al actualizar el ticket");
      toast.success("Respuesta enviada exitosamente");
      setTicket(updatedTicket);
      setResponse("");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleCloseTicket = async () => {
    if (!ticket) return;

    const updatedTicket = {
      ...ticket,
      status: "Cerrado",
    };

    try {
      const res = await fetch(`http://localhost:8081/tickets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTicket),
      });

      if (!res.ok) throw new Error("Error al cerrar el ticket");
      toast.success("El ticket ha sido cerrado.");
      setTicket(updatedTicket);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Cargando los detalles del ticket... Por favor, espera.</p>;
  if (error) return <p>Error al cargar los detalles del ticket: {error}</p>;

  return (
    <div className="ticket-details-container">
      <h1>Detalles del Ticket</h1>
      {ticket && (
        <>
          <div className="ticket-details-card">
            <h2>
              {getFormattedTicketId(ticket.category, ticket.id)} - {ticket.category}
            </h2>
            <p>
              <strong>Descripción:</strong> {ticket.description}
            </p>
            <p>
              <strong>Estado:</strong> {ticket.status}
            </p>
            <p>
              <strong>Fecha de Creación:</strong>{" "}
              {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="conversation-history">
            <h2>Historial de la Conversación</h2>
            <ul>
              {ticket.messages && ticket.messages.length > 0 ? (
                ticket.messages.map((message, index) => (
                  <li key={index}>
                    <p>
                      <strong>{message.author}:</strong> {message.text}
                    </p>
                    <p className="timestamp">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </li>
                ))
              ) : (
                <p>No hay mensajes en este ticket.</p>
              )}
            </ul>
          </div>
          {ticket.status !== "Cerrado" && (
            <form className="response-form" onSubmit={handleResponseSubmit}>
              <label htmlFor="response">Escribe tu respuesta:</label>
              <textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                required
              ></textarea>
              <button type="submit">Enviar Respuesta</button>
            </form>
          )}
          {ticket.status !== "Cerrado" && (
            <button className="close-ticket-button" onClick={handleCloseTicket}>
              Cerrar Ticket
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TicketDetails;
