import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ✅ Importa AuthProvider
import Header from "./components/Header/Header";
import Login from "./Pages/Auth/Login";
import RegisterPage from "./Pages/Auth/Register";
import PrincipalPage from "./Pages/Principal/Principal";
import PedirAyuda from "./Pages/PedirAyuda/PedirAyuda";
import Reportes from "./Pages/Pagespages/Reportes/Reportes";
import Citas from "./Pages/Pagespages/Citas/Citas";
import Matriculas from "./Pages/Pagespages/Matriculas/Matriculas";
import Aplazar from "./Pages/Pagespages/Aplazar/Aplazar";
import FinancialStatus from "./Pages/DatasAdmin/DatasAdmin";
import TicketDetails from "./Pages/DatasAdminGestion/DatasDetails";
import Agendamientos from "./Pages/Pagespages/Agendamientos/Agendamientos";
import Problemasquejasreclamos from "./Pages/Pagespages/PQR/pqr";
import SolicitudesPage from "./Pages/Solicitudes/Solicitudes";
import SolicitudesINFO from "./Pages/SolicitudesINFO/SolicitudesINFO";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./Pages/NotFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
// import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import TicketFormPage from "./components/Tickets/TicketForm";
import TicketListPage from "./Pages/Tickets/TicketListPage";
import TicketDetailsPage from "./Pages/Tickets/TicketDetailsPage";
import Dashboard from "./Pages/Dashboard/Dashboard";

function App() {
  return (
    <Router> {/* ✅ Mover Router al nivel más alto */}
      <AuthProvider> {/* ✅ Mover AuthProvider DENTRO del Router */}
        <Header />
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
          <Route path="/admin/tickets" element={<ProtectedRoute element={<FinancialStatus />} />} />
          <Route path="/admin/tickets/:ticketId" element={<ProtectedRoute element={<TicketDetails />} />} />
          <Route path="/tickets/:ticketId" element={<ProtectedRoute element={<SolicitudesINFO />} />} />
          <Route path="/solicitud" element={<ProtectedRoute element={<SolicitudesPage />} />} />

          {/* Admin */}
          <Route path="/admin/tickets" element={<ProtectedRoute element={<TicketListPage />} />} />
          <Route path="/admin/tickets/new" element={<ProtectedRoute element={<TicketFormPage />} />} />
          <Route path="/admin/tickets/:ticketId" element={<ProtectedRoute element={<TicketDetailsPage />} />} />
          {/* <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRoles={["A", "admin_general"]} />} /> */}
          
          {/* Logout ahora redirige correctamente */}
          <Route path="/logout" element={<Navigate to="/" replace />} />

          {/* Dashboard general (admin) */}
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute element={<Dashboard />} requiredRoles={["admin"]} />}
          />

          {/* Dashboard de Ventas */}
          <Route
            path="/area/ventas/dashboard"
            element={<ProtectedRoute element={<DashboardVentas />} requiredRoles={["a"]} />}
          />

          {/* Dashboard de Pagos */}
          <Route
            path="/area/pagos/dashboard"
            element={<ProtectedRoute element={<DashboardPagos />} requiredRoles={["a"]} />}
          />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </Router> 
  );
}

export default App;