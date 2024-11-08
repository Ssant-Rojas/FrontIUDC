import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './Pages/Login/Login';
import PrincipalPage from './Pages/Principal/Principal';
import PedirAyuda from './Pages/PedirAyuda/PedirAyuda';
import Reportes from './Pages/Reportes/Reportes';
import RegisterPage from './Pages/Register/Register';
import FinancialStatus from './Pages/DatasAdmin/DatasAdmin';
import TicketDetails from './Pages/DatasAdminGestion/DatasDetails';

function App() {
  
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/principal" element={<PrincipalPage />} />
        <Route path="/pedirAyuda" element={<PedirAyuda />} />
        <Route path='/reportar' element={<Reportes/>} />
        <Route path="/managment_tickets" element={<FinancialStatus />} />
        <Route path="/tickets/:ticketId" element={<TicketDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
