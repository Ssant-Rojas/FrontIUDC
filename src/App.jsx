import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './Pages/Login/Login';
import PrincipalPage from './Pages/Principal/Principal';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/principal" element={<PrincipalPage />} />
      </Routes>
    </Router>
  );
}

export default App;
