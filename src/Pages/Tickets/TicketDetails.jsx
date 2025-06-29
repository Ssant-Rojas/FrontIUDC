import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "../../styles/TicketDetails.css";
import apiService from "../../services/api.js";

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [roles, setRoles] = useState([]);
  const [response, setResponse] = useState("");
  const [internalMessage, setInternalMessage] = useState("");
  const [showInternal, setShowInternal] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await apiService.get(`/tickets/${id}`);
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
        const data = await apiService.get('/areas');
        setRoles(data);
      } catch (err) {
        console.error("Error cargando áreas:", err.message);
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

    const messageDTO = {
      author: user.email,
      text: `El usuario ${user.name} escaló el ticket de ${ticket.category?.assignedArea?.nombre || "Sin Asignar"} a ${selectedArea}.`,
      internal: true
    };

    try {
      await apiService.post(`/tickets/${id}/escalate`, {
        message: messageDTO,
        targetArea: selectedArea
      });

      const updatedTicket = {
        ...ticket,
        category: {
          ...ticket.category,
          assignedArea: roles.find(role => role.nombre === selectedArea) || ticket.category.assignedArea
        },
        messages: ticket.messages ? [...ticket.messages, {
          ...messageDTO,
          timestamp: new Date().toISOString()
        }] : [{...messageDTO, timestamp: new Date().toISOString()}],
      };

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

    const messageDTO = {
      author: user.email,
      text: messageText,
      internal: isInternal
    };

    try {
      await apiService.post(`/tickets/${id}/messages`, messageDTO);

      const updatedTicket = {
        ...ticket,
        messages: ticket.messages ? [
          ...ticket.messages,
          {...messageDTO, timestamp: new Date().toISOString()}
        ] : [
          {...messageDTO, timestamp: new Date().toISOString()}
        ],
      };

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
            <h2>{ticket.category?.name || 'Sin categoría'} - {ticket.id}</h2>
            <p><strong>Estado:</strong> {ticket.status}</p>
            <p><strong>Prioridad:</strong> {ticket.priority}</p>
            <p><strong>Área asignada:</strong> {ticket.category?.assignedArea?.nombre || "Sin asignar"}</p>
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


          {["admin", "Tecnología", "Financiera"].includes(user.role) && (
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

          {["admin", "Tecnología", "Financiera"].includes(user.role) && showInternal && (
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
                      <option key={role.id} value={role.nombre}>{role.nombre}</option>
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
