import React, { useState } from 'react';
import '../../../styles/Reportes.css';

function Reportes() {
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
      <h1>Pagos</h1>
      <p>
      Consulta y realiza tus pagos pendientes de matrículas o servicios.</p>
      <form onSubmit={handleSubmit}>
    <label>Usuario que solicita</label>
    <input type="text" value={usr} disabled />

    <label>Teléfono de contacto *</label>
    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required />

    <label>Tipo de pago *</label>
    <select name="tipoSolicitud" value={formData.tipoSolicitud} onChange={handleChange} required>
        <option value="">--Seleccione una opción--</option>
        <option value="Petición">Bancos</option>
        <option value="Queja">Efectivo</option>
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

export default Reportes;