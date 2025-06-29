import  {useEffect, useState} from "react";
import "../../styles/CreateTicket.css";
import {useAuth} from "../../hooks/useAuth";
import { toast } from "react-toastify";

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categorias");
        if (!response.ok) throw new Error("Error al cargar las categorías");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error("Error al obtener las categorías:", error);
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
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    let priority = "Media";
    if (formData.category === "Pagos") priority = "Alta";
    else if (formData.category === "Matrículas") priority = "Baja";

    const assignedArea = formData.category; 

    const newTicket = {
      ...formData,
      assignedArea,
      priority, 
      status: "Pendiente",
      createdAt: new Date().toISOString(),
      expiration: new Date(new Date().setDate(new Date().getDate() + (priority === "Alta" ? 1 : priority === "Media" ? 3 : 7))).toISOString(),
      owner: user.email
    };
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      if (response.ok) {
        toast.success("Ticket creado exitosamente.");
        setFormData({ category: "", description: "" });
      } else {
        toast.error("Error al crear el ticket.");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.", error);
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
          {categories.map((categoria) => (
            <option key={categoria.id} value={categoria.name}>{categoria.name}</option>
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
