import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar"; 

const AdminLayout = () => {
  return (
    <div className="">
      <Sidebar /> 
      <div className="">
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminLayout;
