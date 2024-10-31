import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import backgroundImage from '../../assets/Sede-verde-capas.jpg';

const server = 'http://localhost:8080';

function RegisterPage() {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [celular, setCelular] = useState('');
  const tipoUsuario = 'A'; 
  const fechaCreacion = new Date().toISOString(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${server}/api/personas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombres,
          apellidos,
          email,
          password,
          celular,
          tipoUsuario,
          fechaCreacion,
        }),
      });

      if (response.ok) {
        navigate('/principal');
      } else {
        alert('Error en el registro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema con el registro');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/'); // Redirige a la página de inicio de sesión
  };

  return (
    <div className="Main-login" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 255, 0.1), rgba(0, 0, 255, 0.1)), url(${backgroundImage})` }}>
      <div className="Letters">
        <h1>Regístrate en administrativa IUDC</h1>
        <p>Completa los campos para crear una cuenta</p>
        <div className="Formulario">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Nombres" 
                value={nombres} 
                onChange={(e) => setNombres(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Apellidos" 
                value={apellidos} 
                onChange={(e) => setApellidos(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <input 
                type="tel" 
                placeholder="Celular" 
                value={celular} 
                onChange={(e) => setCelular(e.target.value)} 
                required 
              />
            </div>
            <button className="login-button" type="submit">Registrarse</button>
          </form>
          <a  onClick={handleLoginRedirect}>Iniciar sesion</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
