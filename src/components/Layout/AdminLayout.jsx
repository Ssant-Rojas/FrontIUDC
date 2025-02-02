import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar"; // Componente de la barra lateral

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar /> {/* Barra lateral fija */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet /> {/* Aquí se renderizarán los dashboards dinámicamente */}
      </div>
    </div>
  );
};

export default AdminLayout;
