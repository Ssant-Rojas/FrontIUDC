import React, { useState } from 'react';
import './Agendamientos.css';

function Agendamientos() {
    const [usr, setUsr] = useState('');

  const [formData, setFormData] = useState({
    telefono: '',
    carrera: '',
    Solicitud: '',
    DescripcionDetallada: '',
    archivo: null,
  });


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] }); 
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="form-container">
      <h1>Agendamiento</h1>
      <p>
      Solicita la reserva de recursos o servicios académicos y administrativos.</p>
      <form onSubmit={handleSubmit}>
    <label>Usuario que solicita</label>
    <input type="text" value={usr} disabled />

    <label>Teléfono de contacto *</label>
    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />

    <label>Tipo de agendamiento *</label>
    <select name="tipoSolicitud" value={formData.tipoSolicitud} onChange={handleChange} required>
        <option value="">--Seleccione una opción--</option>
        <option value="Administrativa">Solicitud</option>

        <option value="Reclamo">Otros</option>
    </select>

    <label>Asunto de la solicitud *</label>
    <input type="text" name="asunto" value={formData.asunto} onChange={handleChange} required />

    <label>Descripción detallada *</label>
    <textarea name="descripcionDetallada" value={formData.descripcionDetallada} onChange={handleChange} required />

    <label>Adjuntar archivo (PDF o Word) *</label>
    <input type="file" name="archivo" accept=".pdf, .doc, .docx" onChange={handleChange} required />

    <button type="submit">Enviar</button>
</form>

    </div>
  );
}

export default Agendamientos;