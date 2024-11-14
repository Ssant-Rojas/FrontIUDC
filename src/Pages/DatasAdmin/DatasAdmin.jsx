import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './DatasAdmin.css';

function FinancialStatus() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([
    { id: 1, title: 'Informe de Ventas', description: 'Resumen de ventas del mes', file: 'informe_ventas.pdf', category: 'Ventas' },
    { id: 2, title: 'Gastos Mensuales', description: 'Análisis de gastos de septiembre', file: 'gastos_septiembre.pdf', category: 'Gastos' },
    { id: 3, title: 'Estado de Resultados', description: 'Estado de resultados del último trimestre', file: 'estado_resultados.pdf', category: 'Finanzas' },
  ]);
  const itemsPerPage = 8;
  const title = "Estado Financiero"; 

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="financial-status-container" style={{ display: 'flex' }}>
      <Sidebar />
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
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td><input className="star" type="checkbox" /></td>
                <td>
                  <Link to={`/tickets/${item.id}`}>{item.id}</Link>
                </td>
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
