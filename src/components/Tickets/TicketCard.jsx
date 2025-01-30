const TicketCard = ({ ticket }) => {
    return (
      <div className="border p-4 rounded shadow">
        <h3 className="text-lg font-bold">{ticket.title}</h3>
        <p>{ticket.description}</p>
        <span className="text-sm text-gray-500">{ticket.status}</span>
      </div>
    );
  };
  
  export default TicketCard;
  