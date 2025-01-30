import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TicketFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/tickets", formData);
      toast.success("Ticket creado con éxito");
      navigate("/admin/tickets");
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      toast.error("Error al crear el ticket");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Título"
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
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Crear Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketFormPage;
