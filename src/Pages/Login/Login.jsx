import './Login.css';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/Sede-verde-capas.jpg';

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/principal');
  };

  return (
    <>
    <div className="Main-login" style={{backgroundImage: `linear-gradient(rgba(0, 0, 255, 0.1), rgba(0, 0, 255, 0.1)), url(${backgroundImage})`,}}>
      <div className="Letters">
        <h1>Bienvenido a administrativa IUDC</h1>
        <p>Ingresa para reportar informes, consultas o ayuda</p>
        <div className='Formulario'>
          <form onSubmit={handleSubmit}>
            <div className='input-group'>
              <input type="text" placeholder='Usuario' required />
            </div>
            <div className='input-group'>
              <input type="password" placeholder='Contraseña' required />
            </div>
            <button className='login-button' type="submit"> Ingresar </button>
          </form>
          <a href='#'>Usar entradas externas</a>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
