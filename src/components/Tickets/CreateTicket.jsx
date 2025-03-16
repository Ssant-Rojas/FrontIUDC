import React, { useState, useEffect } from "react";
import "../../styles/CreateTicket.css"; 
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth"; 

const CreateTicket = ({ onTicketCreated }) => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });
  const [categories, setCategories] = useState([]); // ✅ Cargar categorías dinámicamente
  const { user } = useAuth(); 

  // 🔹 Obtener las categorías desde la API de roles
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8081/roles");
        if (!response.ok) throw new Error("Error al cargar las categorías");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  const calculateExpiration = (priority) => {
    const expirationDays = {
      Alta: 1,
      Media: 3,
      Baja: 7,
    };
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + (expirationDays[priority] || 3));
    return expirationDate.toISOString();
  };

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

    // 🔹 La prioridad se asigna automáticamente según la categoría seleccionada
    let priority = "Media";
    if (formData.category === "Pagos") priority = "Alta";
    else if (formData.category === "Matrículas") priority = "Baja";

    const assignedArea = formData.category; // ✅ Se asigna automáticamente el área

    const newTicket = {
      ...formData,
      assignedArea, 
      priority, // ✅ Se asigna automáticamente
      status: "Pendiente",
      createdAt: new Date().toISOString(),
      expiration: calculateExpiration(priority),
      owner: user.email,
    };

    console.log("📤 Ticket enviado al backend:", newTicket); // 🔍 Verifica en la consola

    try {
      const response = await fetch("http://localhost:8081/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      if (response.ok) {
        const createdTicket = await response.json();
        
        if (onTicketCreated) {
          onTicketCreated(createdTicket);
        }

        toast.success("Solicitud creada exitosamente.");
        setFormData({ category: "", description: "" });
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
          {categories.map((role) => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
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
      <button type="submit" className="create-ticket-section-button">
        Crear Solicitud
      </button>
    </form>
  );
};

export default CreateTicket;
