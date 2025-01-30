import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Configuración base de las notificaciones
export const configurarNotificaciones = () => {
  toast.configure({
    position: "top-right",
    autoClose: 5000, // Cierra en 5 segundos
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

// Funciones para mostrar notificaciones específicas
export const mostrarNotificacion = (mensaje, tipo = "info") => {
  switch (tipo) {
    case "success":
      toast.success(mensaje);
      break;
    case "error":
      toast.error(mensaje);
      break;
    case "warn":
      toast.warn(mensaje);
      break;
    default:
      toast.info(mensaje);
      break;
  }
};
