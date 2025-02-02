import TicketForm from "../../components/Tickets/TicketForm";
import TicketList from "../../components/Tickets/TicketList";
import { TicketProvider } from "../../context/TicketContext";

const TicketsPage = () => {
  return (
    <TicketProvider>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Sistema de Tickets</h1>
        <TicketForm />
        <TicketList />
      </div>
    </TicketProvider>
  );
};

export default TicketsPage;