import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onButtonClick }) => {
  return (
    <div className="sidebar">
      <button onClick={() => onButtonClick('star')}>⭐</button>
      <button onClick={() => onButtonClick('file')}>📄</button>
      <button onClick={() => onButtonClick('clock')}>⏰</button>
      <div className="data-buttons">
        <button onClick={() => onButtonClick('inscription')}>Inscripción y matrícula</button>
        <button onClick={() => onButtonClick('financialStatus')}>Estados financieros</button>
        <button onClick={() => onButtonClick('certificates')}>Certificaciones y Documentos</button>
        <button onClick={() => onButtonClick('complaints')}>Quejas y servicios</button>
      </div>
    </div>
  );
};

export default Sidebar;
