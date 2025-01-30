import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TicketDetailsPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/tickets/${ticketId}`);
        setTicket(response.data);
      } catch (error) {
        console.error("Error al obtener el ticket:", error);
        navigate("/admin/tickets");
      }
    };

    fetchTicket();
  }, [ticketId, navigate]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(`http://localhost:8080/tickets/${ticketId}`, { status: newStatus });
      setTicket({ ...ticket, status: newStatus });
      toast.success(`Estado cambiado a ${newStatus}`);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast.error("No se pudo actualizar el estado");
    }
  };

  if (!ticket) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{ticket.title}</h1>
      <p>{ticket.description}</p>
      <p className="text-sm text-gray-500">Estado: {ticket.status}</p>

      <div className="mt-4 space-x-2">
        <button onClick={() => handleStatusChange("En proceso")} className="bg-yellow-500 text-white p-2 rounded">
          Marcar como En proceso
        </button>
        <button onClick={() => handleStatusChange("Cerrado")} className="bg-red-500 text-white p-2 rounded">
          Cerrar Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
