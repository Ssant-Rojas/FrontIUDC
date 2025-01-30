import { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "./TicketCard";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:8080/tickets");
      setTickets(response.data);
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="space-y-4">
      {tickets.length > 0 ? (
        tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
      ) : (
        <p>No hay tickets creados.</p>
      )}
    </div>
  );
};

export default TicketList;
