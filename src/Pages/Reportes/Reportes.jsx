import React, { useState } from 'react';
import './Reportes.css';

function Reportes() {
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
      <h1>Reportar un Problema</h1>
      <p>
        Cree un registro de incidente para informar y solicitar asistencia con un problema que tenga. Se le notificará sobre el progreso.
      </p>
      <form onSubmit={handleSubmit}>

        <label>Usuario que solicita</label>
        <input type="text" value={usr} disabled />

        <label>Teléfono de contacto *</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />

        <label>¿En qué carrerra te encuentras? *</label>
        <select name="carrera" value={formData.carrera} onChange={handleChange} required>
          <option value="">-- Ninguno --</option>
          <option value="Sistemas">Sistemas</option>
          <option value="Software">Software</option>
        </select>



        <label>Solciitud a pedir</label>
        <input
          type="number"
          name="Solicitud"
          value={formData.Solicitud}
          onChange={handleChange}
        />

        <label>Descripción detallada *</label>
        <input
          type="text"
          name="DescripcionDetallada"
          value={formData.DescripcionDetallada}
          onChange={handleChange}
          required
        />

        <label>Adjuntar archivo (PDF o Word) *</label>
        <input
          type="file"
          name="archivo"
          accept=".pdf, .doc, .docx" 
          onChange={handleChange}
          required
        />

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Reportes;
