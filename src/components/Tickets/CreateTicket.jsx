import {useEffect, useState} from "react";
import "../../styles/CreateTicket.css";
import {toast} from "react-toastify";
import apiService from "../../services/api.js";
import PropTypes from 'prop-types';

const CreateTicket = ({onTicketCreated}) => {
    const [formData, setFormData] = useState({
        categoryId: "",
        description: "",
        priority: "",
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiService.get('/categorias', 'categories');
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
        const {name, value} = e.target;

        if (name === "categoryId") {
            const selectedCategory = categories.find((categoria) => categoria.id === value);
            setFormData({
                ...formData,
                [name]: value,
                priority: selectedCategory ? selectedCategory.priority : "",
            });
        } else {
            setFormData({...formData, [name]: value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.categoryId || !formData.description) {
            toast.error("Por favor, completa todos los campos.");
            return;
        }

        const newTicket = {
            categoryId: formData.categoryId,
            description: formData.description,
            priority: formData.priority,
            status: "Pendiente",
            createdAt: new Date().toISOString(),
            expiration: calculateExpiration(formData.priority),
        };

        try {
            const createdTicket = await apiService.post('/tickets', newTicket, 'tickets');


            if (onTicketCreated) {
                onTicketCreated(createdTicket);
            }

            toast.success("Solicitud creada exitosamente.");
            setFormData({categoryId: "", description: "", priority: ""});
        } catch (error) {
            toast.error(error.message || "Error al crear la solicitud.");
        }
    };

    return (
        <form className="create-ticket-section-form" onSubmit={handleSubmit}>
            <h2>Crear Nueva Solicitud</h2>
            <div className="create-ticket-section-group">
                <label>Categoría</label>
                <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccionar...</option>
                    {categories.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>{categoria.name}</option>
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


CreateTicket.propTypes = {
    onTicketCreated: PropTypes.func
};

export default CreateTicket;
