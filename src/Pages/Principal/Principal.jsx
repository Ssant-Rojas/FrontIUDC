import './Principal.css';

function PrincipalPage() {
  return (
    <>
      {/* Contenedor principal */}
      <div className="main-container">
        {/* Sección de búsqueda */}
        <header className="header-search">
          <h1>¿Cómo podemos ayudarle?</h1>
          <div className="search-box">
            <input type="text" placeholder="¿Que estas buscando?" />
            <button className="search-button">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </header>

        {/* Sección de opciones */}
        <section className="options-section">
          <div className="option">
            <i className="fa fa-shopping-bag option-icon"></i>
            <h2>Solicitar algo</h2>
            <p>Busque en el catálogo los servicios y artículos </p>
          </div>
          <div className="option">
            <i className="fa fa-hands-helping option-icon"></i>
            <h2>Necesito Ayuda</h2>
            <p>Comuníquese conasd asd asd asd asdhjhgjhghjgds  </p>
          </div>
          <div className="option">
            <i className="fa fa-book option-icon"></i>
            <h2>Base de conocimiento</h2>
            <p>Explore y busque. envíe comentarios</p>
          </div>
          <div className="option">
            <i className="fa fa-comment option-icon"></i>
            <h2>testerrrr Assist</h2>
            <p>test teste terstesdadkljaslkjasdlkajsd</p>
          </div>
        </section>
      </div>
    </>
  );
}

export default PrincipalPage;
