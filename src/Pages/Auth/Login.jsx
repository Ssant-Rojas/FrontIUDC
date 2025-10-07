import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import backgroundImage from "../../assets/Sede-verde-capas.jpg";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const server = "http://localhost:8080";

function Login() {
    const navigate = useNavigate();
    const {login, isAuthenticated} = useContext(AuthContext);
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

                if (!data.token) {
                    throw new Error("El servidor no devolvió un token válido.");
                }
                login(data);
                toast.success("Sesión iniciada correctamente");

                const tokenParts = data.token.split(".");
                if (tokenParts.length === 3) {
                    try {
                        switch (data.rol) {
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
                    } catch (e) {
                        console.error("Error al decodificar el token:", e);
                        navigate("/principal");
                    }
                } else {
                    navigate("/principal");
                }
            } else {
                toast.success("Credenciales inválidas");
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
        <div className="flex flex-col md:flex-row h-screen">
            {/* Columna izquierda con imagen (visible solo en desktop) */}
            <div
                className="hidden md:block md:w-1/2 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="flex h-full items-center justify-center bg-blue-900/10 p-12">
                    <div className="text-white max-w-lg">
                        <h1 className="text-4xl font-bold mb-4">IUDC</h1>
                        <p className="text-xl">Sistema de gestión administrativa</p>
                    </div>
                </div>
            </div>

            {/* Columna derecha con formulario */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <ToastContainer />
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido a Administrativa IUDC</h1>
                        <p className="text-gray-600">Ingresa para reportar informes, consultas o ayuda</p>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Ingresa tu correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out disabled:opacity-70"
                            >
                                {loading ? "Cargando..." : "Ingresar"}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">¿No tienes una cuenta?</p>
                            <button
                                onClick={handleRegister}
                                className="mt-2 w-full border border-gray-300 text-blue-600 font-medium py-2.5 px-4 rounded-md hover:bg-gray-50 transition duration-200 ease-in-out"
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

