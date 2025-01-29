import '../../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import backgroundImage from '../../assets/Sede-verde-capas.jpg';

const server = 'http://localhost:8080';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${server}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          pass: password,
        }),
      });      

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token); 
        
        navigate('/principal');
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema con el inicio de sesión');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="Main-login" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 255, 0.1), rgba(0, 0, 255, 0.1)), url(${backgroundImage})` }}>
      <div className="Letters">
        <h1>Bienvenido a administrativa IUDC</h1>
        <p>Ingresa para reportar informes, consultas o ayuda</p>
        <div className="Formulario">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Usuario" 
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
            <button className="login-button" type="submit">Ingresar</button>
          </form>
          <a className='a' onClick={handleRegister}>Registrarse</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
