import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:8080/tickets");
        setTickets(response.data);
      } catch (error) {
        console.error("Error al obtener los tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tickets de Soporte</h1>
      <Link to="/admin/tickets/new" className="bg-blue-500 text-white p-2 rounded">
        Crear Nuevo Ticket
      </Link>
      <div className="mt-4 space-y-2">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">{ticket.title}</h3>
              <p>{ticket.description}</p>
              <span className="text-sm text-gray-500">{ticket.status}</span>
              <Link to={`/admin/tickets/${ticket.id}`} className="text-blue-500 ml-2">
                Ver detalles
              </Link>
            </div>
          ))
        ) : (
          <p>No hay tickets creados.</p>
        )}
      </div>
    </div>
  );
};

export default TicketListPage;
