import "../../styles/Pages/Auth/Login.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import backgroundImage from "../../assets/Sede-verde-capas.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const server = "http://localhost:8081";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/principal");
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
      const response = await fetch(`${server}/users?email=${email}`);
      const users = await response.json();

      console.log("Usuarios encontrados:", users);

      if (users.length === 0) {
        throw new Error("Usuario no encontrado");
      }

      const user = users[0];

      console.log("Usuario autenticado:", user);

      // ✅ Validar contraseña (simulación, sin hashing)
      if (user.password !== password) {
        throw new Error("Contraseña incorrecta");
      }

      // ✅ Guardar usuario en el contexto y localStorage
      login(user);
      toast.success("Sesión iniciada correctamente");

      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "matriculas":
          navigate("/area/matriculas");
          break;
        case "pagos":
          navigate("/area/pagos");
          break;
        default:
          navigate("/principal");
          break;
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
        <h1>Bienvenido a Administrativa IUDC</h1>
        <p>Ingresa para reportar informes, consultas o ayuda</p>
        <div className="Formulario">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
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
          <button className="register-button" onClick={handleRegister}>
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;


// import "../../styles/Pages/Auth/Login.css";
// import { useNavigate } from "react-router-dom";
// import { useState, useContext, useEffect } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import backgroundImage from "../../assets/Sede-verde-capas.jpg";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const server = "http://localhost:8080";

// function Login() {
//   const navigate = useNavigate();
//   const { login, isAuthenticated } = useContext(AuthContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Redirige automáticamente si el usuario ya está autenticado
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/principal");
//     }
//   }, [isAuthenticated, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email.trim() || !password.trim()) {
//       toast.error("Por favor, completa todos los campos");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${server}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email,
//           pass: password,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();

//         if (!data.token) {
//           throw new Error("El servidor no devolvió un token válido.");
//         }

//         login(data.token); // ✅ Guarda el token en el contexto y localStorage
//         toast.success("Sesión iniciada correctamente");

//         // ✅ Decodificar el token y redirigir basado en tipoUsuario
//         const decodedToken = JSON.parse(atob(data.token.split(".")[1]));

//         switch (decodedToken.tipoUsuario) {
//           case "A":
//             navigate("/admin/dashboard"); // Admin General
//             break;
//           case "a":
//             navigate("/area"); // Admin Área
//             break;
//           case "U":
//           default:
//             navigate("/principal"); // Usuario normal
//             break;
//         }
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Credenciales incorrectas");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegister = () => {
//     navigate("/register");
//   };

//   return (
//     <div
//       className="Main-login"
//       style={{
//         backgroundImage: `linear-gradient(rgba(0, 0, 255, 0.1), rgba(0, 0, 255, 0.1)), url(${backgroundImage})`,
//       }}
//     >
//       <ToastContainer />
//       <div className="Letters">
//         <h1>Bienvenido a Administrativa IUDC</h1>
//         <p>Ingresa para reportar informes, consultas o ayuda</p>
//         <div className="Formulario">
//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <input
//                 type="email"
//                 placeholder="Correo Electrónico"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 autoComplete="email"
//               />
//             </div>
//             <div className="input-group">
//               <input
//                 type="password"
//                 placeholder="Contraseña"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 autoComplete="current-password"
//               />
//             </div>
//             <button className="login-button" type="submit" disabled={loading}>
//               {loading ? "Cargando..." : "Ingresar"}
//             </button>
//           </form>
//           <button className="register-button" onClick={handleRegister}>
//             Registrarse
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
