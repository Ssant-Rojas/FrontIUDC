import React, { useState } from "react";
import "../../styles/CreateTicket.css"; // Asegúrate de definir estilos según tu diseño
import { useAuth } from "../../hooks/useAuth"; // Para obtener información del usuario autenticado

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    priority: "Media",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Obtener datos del usuario autenticado

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.description) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const newTicket = {
      ...formData,
      status: "Pendiente",
      createdAt: new Date().toISOString(),
      owner: user.email, // Asociar el ticket al usuario autenticado
    };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });

      if (response.ok) {
        alert("Ticket creado exitosamente.");
        setFormData({ category: "", description: "", priority: "Media" }); // Reiniciar el formulario
      } else {
        alert("Error al crear el ticket.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-ticket-form" onSubmit={handleSubmit}>
      <h2>Crear Nuevo Ticket</h2>
      <div className="form-group">
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
      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div className="form-group">
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
      <button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Crear Ticket"}
      </button>
    </form>
  );
};

export default CreateTicket;
