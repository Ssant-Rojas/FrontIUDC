import { useState } from "react";
import axios from "axios";

const TicketForm = ({ onTicketCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/tickets", formData);
      onTicketCreated(response.data); // Llamar al padre para actualizar la lista
      setFormData({ title: "", description: "" }); // Resetear el formulario
    } catch (error) {
      console.error("Error al crear el ticket:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <input
        type="text"
        name="title"
        placeholder="Título del ticket"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      ></textarea>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Crear Ticket
      </button>
    </form>
  );
};

export default TicketForm;
