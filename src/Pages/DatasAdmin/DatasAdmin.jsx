import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './DatasAdmin.css';

function FinancialStatus() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([
    { id: 1, title: 'Informe de Ventas', description: 'Resumen de ventas del mes', file: 'informe_ventas.pdf', category: 'Ventas' },
    { id: 2, title: 'Gastos Mensuales', description: 'Análisis de gastos de septiembre', file: 'gastos_septiembre.pdf', category: 'Gastos' },
    { id: 3, title: 'Estado de Resultados', description: 'Estado de resultados del último trimestre', file: 'estado_resultados.pdf', category: 'Finanzas' },
  ]); 
  const [title, setTitle] = useState('ESTADOS FINANCIEROS Y PAGOS'); 
  const itemsPerPage = 8;

  const inscriptionData = [
    { id: 1, title: 'Inscripción A', description: 'Detalles de inscripción A', file: 'inscripcion_a.pdf', category: 'Inscripción' },
    { id: 2, title: 'Inscripción B', description: 'Detalles de inscripción B', file: 'inscripcion_b.pdf', category: 'Inscripción' },
  ];

  const certificatesData = [
    { id: 1, title: 'Certificado de Calidad', description: 'Certificado de calidad ISO', file: 'certificado_calidad.pdf', category: 'Certificaciones' },
    { id: 2, title: 'Certificado de Cumplimiento', description: 'Certificado de cumplimiento normativo', file: 'certificado_cumplimiento.pdf', category: 'Certificaciones' },
  ];

  const complaintsData = [
    { id: 1, title: 'Queja sobre el servicio', description: 'Detalles de la queja 1', file: 'queja_servicio.pdf', category: 'Quejas' },
    { id: 2, title: 'Queja sobre producto', description: 'Detalles de la queja 2', file: 'queja_producto.pdf', category: 'Quejas' },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleButtonClick = (action) => {
    switch (action) {
      case 'inscription':
        setData(inscriptionData);
        setTitle('INSCRIPCIÓN Y MATRÍCULA'); 
        break;
      case 'financialStatus':
        setData([
          { id: 1, title: 'Informe de Ventas', description: 'Resumen de ventas del mes', file: 'informe_ventas.pdf', category: 'Ventas' },
          { id: 2, title: 'Gastos Mensuales', description: 'Análisis de gastos de septiembre', file: 'gastos_septiembre.pdf', category: 'Gastos' },
          { id: 3, title: 'Estado de Resultados', description: 'Estado de resultados del último trimestre', file: 'estado_resultados.pdf', category: 'Finanzas' },
        ]); 
        setTitle('ESTADOS FINANCIEROS Y PAGOS'); 
        break;
      case 'certificates':
        setData(certificatesData);
        setTitle('CERTIFICACIONES Y DOCUMENTOS'); 
        break;
      case 'complaints':
        setData(complaintsData);
        setTitle('QUEJAS Y SERVICIOS'); 
        break;
      default:
        setData([]);
        setTitle('');
    }
    setPage(1); 
  };

  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="financial-status-container" style={{ display: 'flex' }}>
      <Sidebar onButtonClick={handleButtonClick} />
      <div className="financial-table-container" style={{ marginLeft: '20px', flex: 1 }}>
        <h2>{title}</h2> 
        <table className="financial-table">
          <thead>
            <tr>
              <th>Filtrado por</th>
              <th>ID</th>
              <th>TÍTULO</th>
              <th>DESCRIPCIÓN</th>
              <th>ARCHIVO</th>
              <th>CATEGORÍA</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}  className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td><input class="star" type="checkbox" /></td>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.file}</td>
                <td>{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Anterior</button>
          <span>{page}</span>
          <button onClick={() => handlePageChange(page + 1)} disabled={(page * itemsPerPage) >= data.length}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}

export default FinancialStatus;
