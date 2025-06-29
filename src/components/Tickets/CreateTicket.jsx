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
        documentos: []
    });
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);

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

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);

        try {
            const documentosPromises = files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = reader.result.split(',')[1];
                        resolve({
                            nombre: file.name,
                            tipo: file.type,
                            contenidoBase64: base64String
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });

            const documentos = await Promise.all(documentosPromises);

            setFormData(prev => ({
                ...prev,
                documentos: [...prev.documentos, ...documentos]
            }));
        } catch (error) {
            toast.error("Error al cargar los archivos");
            console.error("Error al cargar archivos:", error);
        } finally {
            setUploading(false);
        }
    };

    const removeDocument = (index) => {
        setFormData(prev => ({
            ...prev,
            documentos: prev.documentos.filter((_, i) => i !== index)
        }));
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
            documentos: formData.documentos
        };

        try {
            const createdTicket = await apiService.post('/tickets', newTicket, 'tickets');


            if (onTicketCreated) {
                onTicketCreated(createdTicket);
            }

            toast.success("Solicitud creada exitosamente.");
            setFormData({categoryId: "", description: "", priority: "", documentos: []});
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
            <div className="create-ticket-section-group">
                <label>Documentos</label>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="create-ticket-section-file-input"
                />
                {uploading && <p className="upload-status">Cargando archivos...</p>}

                {formData.documentos.length > 0 && (
                    <div className="document-list">
                        <h4>Documentos adjuntos:</h4>
                        <ul>
                            {formData.documentos.map((doc, index) => (
                                <li key={index} className="document-item">
                                    <span>{doc.nombre}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeDocument(index)}
                                        className="remove-document-btn"
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
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
