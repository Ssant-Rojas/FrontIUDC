import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useContext } from "react";
import Header from "./components/Header/Header";
import Login from "./Pages/Login/Login";
import PrincipalPage from "./Pages/Principal/Principal";
import PedirAyuda from "./Pages/PedirAyuda/PedirAyuda";
import Reportes from "./Pages/Pagespages/Reportes/Reportes";
import Citas from "./Pages/Pagespages/Citas/Citas";
import RegisterPage from "./Pages/Register/Register";
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
import { AuthContext } from "./context/AuthContext";

// ✅ ProtectedRoute usando contexto en vez de localStorage
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/" />;
};

// ✅ Logout ahora usa contexto
const Logout = () => {
  const { logout } = useContext(AuthContext);
  logout();
  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider> {/* ✅ Ahora está dentro del Router */}
        <Header />
        <Routes>
          {/* Rutas principales */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/principal" element={<ProtectedRoute element={<PrincipalPage />} />} />
          <Route path="/pedirAyuda" element={<ProtectedRoute element={<PedirAyuda />} />} />

          {/* Rutas citas */}
          <Route path="/citas" element={<ProtectedRoute element={<Citas />} />} />
          <Route path="/matriculas" element={<ProtectedRoute element={<Matriculas />} />} />
          <Route path="/aplazar" element={<ProtectedRoute element={<Aplazar />} />} />
          <Route path="/reportar" element={<ProtectedRoute element={<Reportes />} />} />
          <Route path="/agendamiento" element={<ProtectedRoute element={<Agendamientos />} />} />
          <Route path="/pqr" element={<ProtectedRoute element={<Problemasquejasreclamos />} />} />

          {/* Rutas administrativas */}
          <Route path="/admin/tickets" element={<ProtectedRoute element={<FinancialStatus />} />} />
          <Route path="/admin/tickets/:ticketId" element={<ProtectedRoute element={<TicketDetails />} />} />

          {/* Rutas de usuario */}
          <Route path="/tickets/:ticketId" element={<ProtectedRoute element={<SolicitudesINFO />} />} />

          {/* Otras rutas */}
          <Route path="/solicitud" element={<ProtectedRoute element={<SolicitudesPage />} />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}

export default App;
