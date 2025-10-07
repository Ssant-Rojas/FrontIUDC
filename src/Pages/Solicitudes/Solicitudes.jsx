import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/api.js";

const SolicitudesPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await apiService.get("/tickets");
        setTickets(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user.email]);

  const calculateExpiration = (priority) => {
    const expirationDays = {
      Alta: 1,
      Media: 3,
      Baja: 7,
    };
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + (expirationDays[priority] || 3));
    return expirationDate.toISOString();
  };

  const handleTicketClick = (id) => {
    navigate("/admin/tickets/" + id);
  };

  const handleCreateTicket = async (nuevoTicket) => {
    try {
      const newTicket = {
        ...nuevoTicket,
        status: "Pendiente",
        createdAt: new Date().toISOString(),
        expiration: calculateExpiration(nuevoTicket.priority),
        owner: user.email,
      };

      const response = await fetch("http://localhost:8081/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      if (!response.ok) throw new Error("Error al crear el ticket");

      setTickets((prev) => [...prev, newTicket]);
    } catch (err) {
      console.error("Error al guardar el ticket:", err);
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Cargando tickets...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">📄 Mis Tickets</h1>

        {tickets.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket) => (
                  <div
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket.id)}
                      className="cursor-pointer bg-white shadow-md rounded-xl p-6 transition hover:shadow-xl"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {ticket.title || "Sin título"}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ticket.description}</p>

                    <div className="flex items-center justify-between text-sm mb-2">
                <span
                    className={`px-2 py-1 rounded-lg font-medium ${
                        ticket.status === "Pendiente"
                            ? "bg-yellow-100 text-yellow-700"
                            : ticket.status === "Resuelto"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {ticket.status}
                </span>
                      <span className="text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
                    </div>

                    <p className="text-gray-500 text-xs">
                      Expira:{" "}
                      <span className="font-medium text-gray-700">
                  {new Date(ticket.expiration).toLocaleDateString()}
                </span>
                    </p>
                  </div>
              ))}
            </div>
        ) : (
            <p className="text-center text-gray-500">No tienes tickets creados.</p>
        )}
      </div>
  );
};

export default SolicitudesPage;
