import React, { useState, useEffect } from "react";
import "../../styles/CreateTicket.css";
import { useAuth } from "../../hooks/useAuth";

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });
  const [categories, setCategories] = useState([]); // ✅ Lista de categorías desde la API
  const [loading, setLoading] = useState(false);
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

    // 🔹 La prioridad se asigna automáticamente según la categoría
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
      expiration: new Date(new Date().setDate(new Date().getDate() + (priority === "Alta" ? 1 : priority === "Media" ? 3 : 7))).toISOString(),
      owner: user.email
    };

    console.log("📤 Ticket enviado al backend:", newTicket); // 🔍 Verifica en la consola

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      if (response.ok) {
        alert("Ticket creado exitosamente.");
        setFormData({ category: "", description: "" });
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
          {categories.map((role) => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
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
      <button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Crear Ticket"}
      </button>
    </form>
  );
};

export default CreateTicket;
