import React, { useState } from 'react';
import './Aplazar.css';

function Aplazar() {
    const [usr, setUsr] = useState('');

  const [formData, setFormData] = useState({
    telefono: '',
    carrera: '',
    cantidadAfec: '',
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
      <h1>Aplazamiento</h1>
      <p>
      Realiza la solicitud de aplazamiento de cursos o servicios.</p>
      <form onSubmit={handleSubmit}>
    <label>Usuario que solicita</label>
    <input type="text" value={usr} disabled />

    <label>Teléfono de contacto *</label>
    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />

    <label>Tipo de aplazamiento *</label>
    <select name="tipoSolicitud" value={formData.tipoSolicitud} onChange={handleChange} required>
        <option value="">--Seleccione una opción--</option>
        <option value="Semestre">Semestre</option>
        <option value="Materias">Materias</option>
        <option value="Información">Información</option>
        <option value="Otros">Otros</option>
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

export default Aplazar;