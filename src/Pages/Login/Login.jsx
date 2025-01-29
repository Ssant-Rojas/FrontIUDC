import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import backgroundImage from "../../assets/Sede-verde-capas.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const server = "http://localhost:8080";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Usamos useEffect para redirigir cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/principal"); // Redirige solo cuando el usuario está autenticado
    }
  }, [isAuthenticated, navigate]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${server}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          pass: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token); // ✅ Esto actualizará el contexto global y disparará el useEffect
        toast.success("Sesión iniciada");
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
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
                autoComplete="current-password"
              />
            </div>
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </form>
          <button className="register-button" onClick={handleRegister}>Registrarse</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
