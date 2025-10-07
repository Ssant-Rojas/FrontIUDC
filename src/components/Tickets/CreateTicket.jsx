import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/api.js";
import PropTypes from "prop-types";

const CreateTicket = ({ onTicketCreated }) => {
    const [formData, setFormData] = useState({
        categoryId: "",
        description: "",
        priority: "",
        documentos: [],
    });
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await apiService.get("/categorias", "categories");
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

        if (name === "categoryId") {
            const selectedCategory = categories.find((categoria) => categoria.id === value);
            setFormData({
                ...formData,
                [name]: value,
                priority: selectedCategory ? selectedCategory.priority : "",
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);

        try {
            const documentosPromises = files.map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = reader.result.split(",")[1];
                        resolve({
                            nombre: file.name,
                            tipo: file.type,
                            contenidoBase64: base64String,
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });

            const documentos = await Promise.all(documentosPromises);

            setFormData((prev) => ({
                ...prev,
                documentos: [...prev.documentos, ...documentos],
            }));
        } catch (error) {
            toast.error("Error al cargar los archivos");
            console.error("Error al cargar archivos:", error);
        } finally {
            setUploading(false);
        }
    };

    const removeDocument = (index) => {
        setFormData((prev) => ({
            ...prev,
            documentos: prev.documentos.filter((_, i) => i !== index),
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
            documentos: formData.documentos,
        };

        try {
            const createdTicket = await apiService.post("/tickets", newTicket, "tickets");

            if (onTicketCreated) {
                onTicketCreated(createdTicket);
            }

            toast.success("Solicitud creada exitosamente.");
            setFormData({ categoryId: "", description: "", priority: "", documentos: [] });
        } catch (error) {
            toast.error(error.message || "Error al crear la solicitud.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Crear Nueva Solicitud
                </h2>

                {/* Categoría */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Categoría</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Seleccionar...</option>
                        {categories.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Descripción */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Documentos */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Documentos</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-2">Cargando archivos...</p>}

                    {formData.documentos.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-gray-700 font-semibold mb-2">Documentos adjuntos:</h4>
                            <ul className="space-y-2">
                                {formData.documentos.map((doc, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 rounded-lg px-3 py-2"
                                    >
                                        <span className="text-sm text-gray-800">{doc.nombre}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeDocument(index)}
                                            className="text-red-500 text-sm hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Crear Solicitud
                </button>
            </form>
        </div>
    );
};

CreateTicket.propTypes = {
    onTicketCreated: PropTypes.func,
};

export default CreateTicket;
