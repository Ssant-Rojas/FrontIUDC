import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/DatasDetails.css";

const server = "http://localhost:8080";

function TicketDetails() {
  const { ticketId } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Usuario no autenticado");

        const response = await fetch(`${server}/api/pqrs/${ticketId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTicketData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketId]);

  const handleGeneratePQR = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Usuario no autenticado");

      const requestData = {
        id_persona: ticketData.id_persona,
        id_tipologia: ticketData.id_tipologia,
        nombre_caso: ticketData.descripcion,
        plazo_dias_respuesta: 30,
      };

      const response = await fetch(`${server}/api/pqrs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Error al generar la PQR");
      }

      setMessage("PQR generada correctamente");
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="ticket-details">
      <h1>Detalles del Ticket</h1>
      <div className="field-group">
        <label>Usuario que solicita:</label>
        <div>{ticketData.usuario || "No especificado"}</div>
      </div>
      <div className="field-group">
        <label>Descripción:</label>
        <div>{ticketData.descripcion || "No especificado"}</div>
      </div>
      <button onClick={handleGeneratePQR}>Generar PQR</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TicketDetails;
