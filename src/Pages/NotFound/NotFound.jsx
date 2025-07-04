import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="notfound-container">
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <button onClick={handleGoBack}>Volver al inicio</button>
    </div>
  );
}

export default NotFound;
