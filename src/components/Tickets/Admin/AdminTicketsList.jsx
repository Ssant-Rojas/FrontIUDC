import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import apiService from "../../../services/api.js";

const AdminTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("");
  const [expirationFilter, setExpirationFilter] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await apiService.get("/tickets");
        let filteredData = data;

        if (user.rol !== "admin" && user.rol !== "ADMIN") {
          filteredData = data.filter((ticket) => {
            if (!ticket.category || !ticket.category.assignedArea) return false;
            const areaMatch = ticket.category.assignedArea.nombre === user.rol;
            const categoryMatch = ticket.category.name === user.rol;
            return areaMatch || categoryMatch;
          });
        }

        setTickets(filteredData);
        setFilteredTickets(filteredData);
      } catch (err) {
        setError("Error al cargar tickets: " + (err.message || "Error desconocido"));
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchTickets();
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    let filtered = tickets;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);

    if (dateFilter === "hoy") {
      filtered = filtered.filter(
          (ticket) => new Date(ticket.createdAt).toDateString() === today.toDateString()
      );
    } else if (dateFilter === "ayer") {
      filtered = filtered.filter(
          (ticket) => new Date(ticket.createdAt).toDateString() === yesterday.toDateString()
      );
    } else if (dateFilter === "ultimos7") {
      filtered = filtered.filter((ticket) => new Date(ticket.createdAt) >= last7Days);
    } else if (dateFilter === "ultimos30") {
      filtered = filtered.filter((ticket) => new Date(ticket.createdAt) >= last30Days);
    }

    if (statusFilter) {
      filtered = filtered.filter(
          (ticket) => ticket.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (expirationFilter === "Expirado") {
      filtered = filtered.filter(
          (ticket) => ticket.expiration && new Date(ticket.expiration) < new Date()
      );
    }

    setFilteredTickets(filtered);
  }, [dateFilter, statusFilter, expirationFilter, tickets]);

  const handleViewDetails = (id) => {
    navigate(`/admin/tickets/${id}`);
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  if (loading) return <p className="text-center text-gray-500 mt-10">Cargando tickets...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🎫 Listado de Tickets ({filteredTickets.length})
        </h1>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-gray-700 shadow-sm"
          >
            <option value="todos">Todos</option>
            <option value="hoy">Hoy</option>
            <option value="ayer">Ayer</option>
            <option value="ultimos7">Últimos 7 días</option>
            <option value="ultimos30">Últimos 30 días</option>
          </select>

          <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-gray-700 shadow-sm"
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Resuelto">Resuelto</option>
            <option value="Cerrado">Cerrado</option>
          </select>

          <select
              value={expirationFilter}
              onChange={(e) => setExpirationFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-gray-700 shadow-sm"
          >
            <option value="">Todas las expiraciones</option>
            <option value="Expirado">Expirado</option>
          </select>
        </div>

        {/* Listado */}
        {filteredTickets.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTickets.map((ticket) => {
                const isExpired = ticket.expiration && new Date(ticket.expiration) < new Date();
                const isClosed =
                    ticket.status?.toLowerCase() === "cerrado" ||
                    ticket.status?.toLowerCase() === "resuelto";

                return (
                    <div
                        key={ticket.id}
                        onClick={() => handleViewDetails(ticket.id)}
                        className={`cursor-pointer bg-white shadow-md rounded-xl p-6 transition hover:shadow-xl border-l-4 ${
                            isExpired
                                ? "border-red-500"
                                : isClosed
                                    ? "border-gray-400"
                                    : "border-blue-500"
                        }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold text-gray-800">
                          {ticket.category?.name} - #{ticket.id}
                        </h2>
                        <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                                ticket.priority === "Alta"
                                    ? "bg-red-100 text-red-700"
                                    : ticket.priority === "Media"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                            }`}
                        >
                    {ticket.priority}
                  </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ticket.description}</p>

                      {ticket.messages && ticket.messages.length > 0 && (
                          <p className="text-xs text-gray-500 mb-3">
                            💬 {ticket.messages.length} mensajes
                          </p>
                      )}

                      <div className="flex flex-col gap-1 text-xs text-gray-600">
                  <span
                      className={`font-medium ${
                          ticket.status === "Pendiente"
                              ? "text-yellow-600"
                              : ticket.status === "Resuelto"
                                  ? "text-green-600"
                                  : ticket.status === "Cerrado"
                                      ? "text-gray-600"
                                      : "text-blue-600"
                      }`}
                  >
                    Estado: {ticket.status}
                  </span>
                        <span>Creado: {new Date(ticket.createdAt).toLocaleDateString("es-ES")}</span>
                        <span>Área: {ticket.category?.assignedArea?.nombre}</span>
                        {ticket.expiration && (
                            <span
                                className={`${
                                    isExpired ? "text-red-600 font-semibold" : "text-gray-600"
                                }`}
                            >
                      {isExpired
                          ? "⚠️ Expirado"
                          : `Expira: ${new Date(ticket.expiration).toLocaleDateString("es-ES")}`}
                    </span>
                        )}
                      </div>
                    </div>
                );
              })}
            </div>
        ) : (
            <p className="text-center text-gray-500">No hay tickets disponibles para tu área.</p>
        )}
      </div>
  );
};

export default AdminTicketsList;
