import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "../../styles/TicketDetails.css";

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [roles, setRoles] = useState([]); // ✅ Lista de roles para escalación
  const [response, setResponse] = useState("");
  const [internalMessage, setInternalMessage] = useState("");
  const [showInternal, setShowInternal] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
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

    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:8081/roles");
        if (!response.ok) throw new Error("Error al cargar los roles");
        const data = await response.json();
        setRoles(data);
      } catch (err) {
        console.error("Error al obtener los roles:", err.message);
      }
    };

    if (id) {
      fetchTicket();
      fetchRoles();
    }
  }, [id]);

  const handleEscalateTicket = async () => {
    if (!selectedArea) {
      toast.error("Debes seleccionar un área para escalar el ticket.");
      return;
    }

    if (!internalMessage.trim()) {
      toast.error("Debes agregar un mensaje privado antes de escalar el ticket.");
      return;
    }

    const escalationComment = {
      author: user.email,
      text: `El usuario ${user.name} escaló el ticket de ${ticket.assignedArea || "Sin Asignar"} a ${selectedArea}.`,
      timestamp: new Date().toISOString(),
      internal: true,
    };

    const updatedTicket = {
      ...ticket,
      assignedArea: selectedArea,
      messages: ticket.messages ? [...ticket.messages, escalationComment] : [escalationComment],
    };

    try {
      const response = await fetch(`http://localhost:8081/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTicket),
      });

      if (!response.ok) throw new Error("Error al escalar el ticket");

      setTicket(updatedTicket);
      setInternalMessage("");
      setSelectedArea("");

      toast.success(`Ticket escalado a ${selectedArea}.`);
    } catch (error) {
      console.error("Error al escalar el ticket:", error);
      toast.error("Error al escalar el ticket.");
    }
  };

  const handleAddMessage = async (isInternal) => {
    const messageText = isInternal ? internalMessage : response;
    if (!messageText.trim()) return;

    const newMessage = {
      author: user.email,
      text: messageText,
      timestamp: new Date().toISOString(),
      internal: isInternal,
    };

    const updatedTicket = {
      ...ticket,
      messages: ticket.messages ? [...ticket.messages, newMessage] : [newMessage],
    };

    try {
      const response = await fetch(`http://localhost:8081/tickets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTicket),
      });

      if (!response.ok) throw new Error("Error al agregar el mensaje");

      setTicket(updatedTicket);

      if (isInternal) {
        setInternalMessage("");
      } else {
        setResponse("");
      }

      toast.success("Mensaje agregado correctamente.");
    } catch (error) {
      console.error("Error al agregar mensaje:", error);
      toast.error("Error al agregar mensaje.");
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
            <h2>{ticket.category} - {ticket.id}</h2>
            <p><strong>Descripción:</strong> {ticket.description}</p>
            <p><strong>Estado:</strong> {ticket.status}</p>
            <p><strong>Fecha de Creación:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
            <p><strong>Fecha de vencimiento:</strong> {new Date(ticket.expiration).toLocaleDateString()}</p>
          </div>

          <div className="conversation-history">
            <h2>Historial de la Conversación</h2>
            <ul>
              {ticket.messages && ticket.messages.length > 0 ? (
                ticket.messages.map((message, index) => (
                  <li key={index} className={message.internal ? "internal-message" : "public-message"}>
                    <p><strong>{message.author}:</strong> {message.text}</p>
                    <p className="timestamp">{new Date(message.timestamp).toLocaleString()}</p>
                    {message.internal && <span className="admin-tag">(Mensaje Privado)</span>}
                  </li>
                ))
              ) : (
                <p>No hay mensajes en este ticket.</p>
              )}
            </ul>
          </div>

          <form className="response-form" onSubmit={(e) => { e.preventDefault(); handleAddMessage(false); }}>
            <label htmlFor="response">Escribe tu respuesta:</label>
            <textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
            ></textarea>
            <button type="submit">Enviar Respuesta</button>
          </form>

          {/* 🔹 Sección de mensajes privados y escalamiento */}
          {/* 🔹 Verificar si el usuario tiene permisos para mensajes privados y escalamiento */}
          {["admin", "Matrículas", "Pagos"].includes(user.role) && (
            <div className="internal-message-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={showInternal}
                  onChange={() => setShowInternal(!showInternal)}
                />
                Agregar mensaje privado
              </label>
            </div>
          )}

          {["admin", "Matrículas", "Pagos"].includes(user.role) && showInternal && (
            <div>
              <div className="response-form">
                <h2>Mensaje Privado para Administradores</h2>
                <textarea
                  placeholder="Escribe un mensaje interno..."
                  value={internalMessage}
                  onChange={(e) => setInternalMessage(e.target.value)}
                />
                <button onClick={() => handleAddMessage(true)}>Agregar Mensaje Privado</button>
              </div>

              <div className="escalation-form">
                <h2>Escalar Ticket</h2>
                <label>Seleccionar área:</label>
                <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                  <option value="">Seleccionar área...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
                <button onClick={handleEscalateTicket} disabled={!internalMessage.trim()}>
                  Escalar Ticket
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TicketDetails;
