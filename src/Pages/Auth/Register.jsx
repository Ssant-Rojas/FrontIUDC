import '../../styles/Pages/Auth/Register.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import backgroundImage from '../../assets/Sede-verde-capas.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//const server = 'http://localhost:8080/api/personas';
const server = 'http://localhost:8081/users'
function RegisterPage() {
  const navigate = useNavigate();
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [celular, setCelular] = useState('');
  const [loading, setLoading] = useState(false);
  const tipoUsuario = 'Alumno';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!/^\d{10}$/.test(celular)) {
      toast.error('El número de celular debe tener exactamente 10 dígitos');
      return;
    }

    const requestData = {
      nombres,
      apellidos,
      email,
      password,
      celular,
      tipoUsuario,
      fechaCreacion: new Date().toISOString(),
      planFK: 1,
    };

    setLoading(true);

    try {
      const response = await fetch(server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        toast.success('Registro exitoso. Inicia sesión para continuar');
        navigate('/'); 
      } else {
        const errorData = await response.json();
        toast.error(`Error en el registro: ${errorData.message || 'Verifica los datos ingresados'}`);
      }
    } catch (error) {
      toast.error('Hubo un problema con el registro. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <div
      className="Main-login"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 255, 0.1), rgba(0, 0, 255, 0.1)), url(${backgroundImage})`,
      }}
    >
      <ToastContainer />
      <div className="Letters">
        <h1>Regístrate en Administrativa IUDC</h1>
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
                autoComplete="given-name"
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
                autoComplete="family-name"
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Contraseña (mínimo 8 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="input-group">
              <input
                type="tel"
                placeholder="Celular"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                required
                autoComplete="tel"
              />
            </div>
            <button className="login-button" type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          <button className="register-button" onClick={handleLoginRedirect}>
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
