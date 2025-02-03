import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../Pages/Auth/Login";
import RegisterPage from "../Pages/Auth/Register";
import PrincipalPage from "../Pages/Principal/Principal";
import PedirAyuda from "../Pages/PedirAyuda/PedirAyuda";
import Reportes from "../Pages/Pagespages/Reportes/Reportes";
import Citas from "../Pages/Pagespages/Citas/Citas";
import Matriculas from "../Pages/Pagespages/Matriculas/Matriculas";
import Aplazar from "../Pages/Pagespages/Aplazar/Aplazar";
import TicketDetails from "../Pages/Tickets/TicketDetails";
import Agendamientos from "../Pages/Pagespages/Agendamientos/Agendamientos";
import Problemasquejasreclamos from "../Pages/Pagespages/PQR/pqr";
import SolicitudesPage from "../Pages/Solicitudes/Solicitudes";
import SolicitudesINFO from "../Pages/SolicitudesINFO/SolicitudesINFO";
import NotFound from "../Pages/NotFound/NotFound";

import CreateTicket from "../components/Tickets/CreateTicket.jsx";
// import { useAuth } from "../hooks/useAuth.js";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

import Dashboard from "../Pages/Dashboard/Dashboard";
import AdminUsers from "../components/Admin/AdminUsers.jsx";
import Unauthorized from "../Pages/Unauthorized/Unauthorized";
import AdminLayout from "../components/Layout/AdminLayout";

import AdminTicketsList from "../components/Tickets/Admin/AdminTicketsList.jsx";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas */}
      <Route path="/principal" element={<ProtectedRoute element={<PrincipalPage />} />} />
      <Route path="/pedirAyuda" element={<ProtectedRoute element={<PedirAyuda />} />} />
      <Route path="/citas" element={<ProtectedRoute element={<Citas />} />} />
      <Route path="/matriculas" element={<ProtectedRoute element={<Matriculas />} />} />
      <Route path="/aplazar" element={<ProtectedRoute element={<Aplazar />} />} />
      <Route path="/reportar" element={<ProtectedRoute element={<Reportes />} />} />
      <Route path="/agendamiento" element={<ProtectedRoute element={<Agendamientos />} />} />
      <Route path="/pqr" element={<ProtectedRoute element={<Problemasquejasreclamos />} />} />
      
      <Route path="/tickets/:ticketId" element={<ProtectedRoute element={<SolicitudesINFO />} />} />
      <Route path="/solicitud" element={<ProtectedRoute element={<SolicitudesPage />} />} />
      <Route path="/solicitud/crear" element={<CreateTicket />}/>

      {/* Admin */}
      <Route element={<ProtectedRoute element={<AdminLayout />} requiredRoles={["admin"]} />}>
      </Route>

      <Route path="/admin/users" element={user?.role === "admin" ? <AdminUsers /> : <Navigate to="/admin/users" />}/>
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/tickets" element={<AdminTicketsList />} />
      <Route path="/admin/tickets/:id" element={<TicketDetails />} />



      {/* Acceso no autorizado */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Página 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
