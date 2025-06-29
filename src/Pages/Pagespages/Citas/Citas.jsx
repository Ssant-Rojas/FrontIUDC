import React, { useState } from 'react';
import '../../../styles/Citas.css';

function Citas() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Por favor, inicia sesión antes de realizar esta acción.');
      return;
    }

    const requestData = {
      id_persona: 1, 
      id_tipologia: formData.Solicitud,
      nombre_caso: formData.DescripcionDetallada,
      id_documento: null,
      plazo_dias_respuesta: 30,
      id_programa: 1,
    };

    try {
      const response = await fetch('http://localhost:8080/api/pqrs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert('Solicitud enviada con éxito');
        setFormData({
          telefono: '',
          carrera: '',
          cantidadAfec: '',
          Solicitud: '',
          DescripcionDetallada: '',
          archivo: null,
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Ocurrió un error al enviar la solicitud'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="form-container">
      <h1>Citas</h1>
      <p>Consulta o agenda Citas</p>
      <form onSubmit={handleSubmit}>
        <label>Teléfono de contacto *</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />

        <label>Tipo de cita *</label>
        <select
          name="Solicitud"
          value={formData.Solicitud}
          onChange={handleChange}
          required
        >
          <option value="">--Seleccione una opción--</option>
          <option value="Administrativa">Administrativa</option>
          <option value="Pagos">Pagos</option>
          <option value="Información">Información</option>
          <option value="Reclamo">Otros</option>
        </select>

        <label>Descripción detallada *</label>
        <textarea
          name="DescripcionDetallada"
          value={formData.DescripcionDetallada}
          onChange={handleChange}
          required
        />

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Citas;
