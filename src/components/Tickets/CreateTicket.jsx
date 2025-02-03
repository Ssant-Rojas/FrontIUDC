import React, { useState } from "react";
import "../../styles/CreateTicket.css"; 
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth"; 

const CreateSolicitudes = ({ onSolicitudesCreated }) => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    priority: "Media",
  });

  const { user } = useAuth(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.description) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    const newSolicitudes = {
      ...formData,
      status: "Pendiente",
      createdAt: new Date().toISOString(),
      owner: user.email,
    };

    try {
      const response = await fetch("http://localhost:8081/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSolicitudes),
      });

      if (response.ok) {
        const createdSolicitudes = await response.json();
        
        if (onSolicitudesCreated) {
          onSolicitudesCreated(createdSolicitudes);
        }

        toast.success("Solicitud creada exitosamente.");
        setFormData({ category: "", description: "", priority: "Media" });
      } else {
        toast.error("Error al crear la solicitud.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      toast.error("Error al conectar con el servidor.");
    }
  };

  return (
    <form className="create-ticket-section-form" onSubmit={handleSubmit}>
      <h2>Crear Nueva Solicitud</h2>
      <div className="create-ticket-section-group">
        <label>Categoría</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar...</option>
          <option value="Matrículas">Matrículas</option>
          <option value="Pagos">Pagos</option>
          <option value="Certificados">Certificados</option>
        </select>
      </div>
      <div className="create-ticket-section-group">
        <label>Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="create-ticket-section-group">
        <label>Prioridad</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>
      <button type="submit" className="create-ticket-section-button">
        Crear Solicitud
      </button>
    </form>
  );
};

export default CreateSolicitudes;
