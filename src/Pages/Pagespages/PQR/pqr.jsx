import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Importar toastify
import '../../../styles/pqr.css';

const server = 'http://localhost:8080';

function Problemasquejasreclamos() {
    const [formData, setFormData] = useState({
        telefono: '',
        carrera: '',
        tipoSolicitud: '',
        asunto: '',
        descripcionDetallada: '',
        archivo: null,
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, archivo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Subir archivo
            const fileData = new FormData();
            fileData.append('file', formData.archivo);

            const fileResponse = await fetch(`${server}/api/documentos`, {
                method: 'POST',
                body: fileData,
            });

            if (!fileResponse.ok) {
                throw new Error('Error al subir el archivo.');
            }
            const uploadedFile = await fileResponse.json();

            // Crear la PQR
            const pqrData = {
                nombreCaso: formData.asunto,
                idPrograma: 1, // Reemplazar con el programa seleccionado
                idDocumento: uploadedFile.idDocumento,
                plazoDiasRespuesta: 5,
            };

            const pqrResponse = await fetch(`${server}/api/pqrs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Token JWT
                },
                body: JSON.stringify(pqrData),
            });

            if (!pqrResponse.ok) {
                throw new Error('Error al enviar la PQR.');
            }

            toast.success('PQR enviada con éxito.'); // Notificación de éxito
        } catch (error) {
            toast.error(error.message); // Notificación de error
        }
    };

    return (
        <div className="form-container">
            <h1>PQR'S</h1>
            <form onSubmit={handleSubmit}>
                <label>Teléfono de contacto *</label>
                <input type="text" name="telefono" onChange={handleChange} required />

                <label>Tipo de PQR *</label>
                <select name="tipoSolicitud" onChange={handleChange} required>
                    <option value="">Seleccione</option>
                    <option value="Peticion">Petición</option>
                    <option value="Queja">Queja</option>
                    <option value="Reclamo">Reclamo</option>
                </select>

                <label>Asunto de la solicitud *</label>
                <input type="text" name="asunto" onChange={handleChange} required />

                <label>Descripción detallada *</label>
                <textarea name="descripcionDetallada" onChange={handleChange} required />

                <label>Adjuntar archivo *</label>
                <input type="file" name="archivo" onChange={handleChange} required />

                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default Problemasquejasreclamos;
