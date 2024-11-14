import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './Pages/Login/Login';
import PrincipalPage from './Pages/Principal/Principal';
import PedirAyuda from './Pages/PedirAyuda/PedirAyuda';
import Reportes from './Pages/Pagespages/Reportes/Reportes';
import Citas from './Pages/Pagespages/Citas/Citas';
import RegisterPage from './Pages/Register/Register';
import Matriculas from './Pages/Pagespages/Matriculas/Matriculas';
import Aplazar from './Pages/Pagespages/Aplazar/Aplazar';
import FinancialStatus from './Pages/DatasAdmin/DatasAdmin';
import TicketDetails from './Pages/DatasAdminGestion/DatasDetails';
import Agendamientos from './Pages/Pagespages/Agendamientos/Agendamientos';
import Problemasquejasreclamos from './Pages/Pagespages/PQR/pqr';
import SolicitudesPage from './Pages/Solicitudes/Solicitudes';

function App() {
  
  return (
    <Router>
      <Header />
      <Routes>
        {/*Rutas principales*/}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/principal" element={<PrincipalPage />} />
        <Route path="/pedirAyuda" element={<PedirAyuda />} />
        {/*Rutas citas*/}
        <Route path='/citas' element={<Citas/>} />
        <Route path='/matriculas' element={<Matriculas/>} />
        <Route path='/Aplazar' element={<Aplazar/>} />
        <Route path='/reportar' element={<Reportes/>} />
        <Route path='/agendamiento' element={<Agendamientos/>} />
        <Route path='/pqr' element={<Problemasquejasreclamos/>} />
        {/*Rutas administrativas*/}
        <Route path="/tickets" element={<FinancialStatus />} />
        <Route path="/tickets/:ticketId" element={<TicketDetails />} />
        <Route path="/solicitud" element={<SolicitudesPage />} />

      </Routes>
    </Router>
  );
}

export default App;
