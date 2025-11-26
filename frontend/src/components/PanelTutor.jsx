import { useNavigate } from "react-router-dom";
import "../styles/panelTutor.css";

const mockClases = [
  {
    id: 1,
    titulo: "Clase 1",
    categoria: "Matemáticas",
    precio: "Bs 50",
    modalidad: "presencial",
    descripcion: "Clases de matemáticas para estudiantes de primaria",
  },
  {
    id: 2,
    titulo: "Clase 2",
    categoria: "Programación",
    precio: "Bs 100",
    modalidad: "presencial",
    descripcion: "Aprende a programar en python desde cero",
  },
  {
    id: 3,
    titulo: "Clase 3",
    categoria: "Inglés",
    precio: "Bs 150",
    modalidad: "virtual",
    descripcion: "Clases virtuales de inglés nivel B2",
  },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

const PanelTutor = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    navigate("/tutor/perfil");
  };

  const createNewCourse = () => {
    navigate("/tutor/curso/nuevo");
  };

  const viewCalendar = () => {
    alert("Vista de chats/calendario próximamente disponible");
  };

  const verDetalle = (clase) => {
    alert(`Ver detalles de ${clase.titulo}`);
  };

  const rechazar = (clase) => {
    alert(`Rechazar ${clase.titulo}`);
  };

  const aceptar = (clase) => {
    alert(`Aceptar ${clase.titulo}`);
  };

  return (
    <div className="panel-tutor-page">
      <div className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="logo-icon-small">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 6H2V4C2 2.89 2.89 2 4 2H6V4H4V6M20 2H22V4H20V6H22V8H20V10H18V8H16V6H18V4H16V2H18V0H20V2M4 20H2V22C2 23.11 2.89 24 4 24H6V22H4V20M22 22V20H20V18H22V16H20V14H18V16H16V18H18V20H16V22H18V24H20V22H22Z" />
                </svg>
              </div>
              <h1>Panel Tutor</h1>
            </div>
            <div className="nav-links">
              <button className="nav-link active" type="button" onClick={() => navigate("/panel-tutor")}>Panel</button>
              <button className="nav-link" type="button" onClick={() => navigate("/mis-cursos")}>Mis cursos</button>
              <button className="nav-link" type="button" disabled>Chats</button>
              <button className="nav-link" type="button" onClick={() => navigate("/explorar")}>Explorar</button>
              <button onClick={handleLogout} className="logout-btn" type="button">Cerrar Sesión</button>
              <button className="user-icon" type="button" onClick={handleProfile}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <div className="content-layout">
            <div className="left-content">
              <div className="tutor-banner">
                <div className="banner-content">
                  <div className="banner-info">
                    <h2>Panel de Tutores</h2>
                    <p>Gestiona tus cursos y horarios</p>
                    <div className="banner-actions">
                      <button className="action-btn" type="button" onClick={createNewCourse}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                        </svg>
                        Crear Nuevo Curso
                      </button>
                      <button className="action-btn" type="button" onClick={viewCalendar}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" />
                        </svg>
                        Ver mis chats
                      </button>
                    </div>
                  </div>
                  <div className="banner-icons">
                    <div className="placeholder-icon">△</div>
                    <div className="placeholder-icon">⚙</div>
                    <div className="placeholder-icon">□</div>
                  </div>
                </div>
              </div>

              <div className="clases-section">
                {mockClases.map((clase) => (
                  <div className="clase-item" key={clase.id}>
                    <div className="clase-icon">
                      <div className="icon-placeholder">△</div>
                      <div className="icon-placeholder">⚙</div>
                      <div className="icon-placeholder">□</div>
                    </div>
                    <div className="clase-info">
                      <h3>{clase.titulo}</h3>
                      <p className="clase-details">
                        {clase.categoria} - {clase.precio} - {clase.modalidad}
                      </p>
                      <p className="clase-description">{clase.descripcion}</p>
                    </div>
                    <div className="clase-actions">
                      <button
                        className="action-btn-small"
                        type="button"
                        onClick={() => verDetalle(clase)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" />
                        </svg>
                        Detalle
                      </button>
                      <button
                        className="action-btn-small reject"
                        type="button"
                        onClick={() => rechazar(clase)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,4C13.1,4 14,4.9 14,6C14,7.1 13.1,8 12,8C10.9,8 10,7.1 10,6C10,4.9 10.9,4 12,4M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M12,6A4,4 0 0,0 8,10V11H16V10A4,4 0 0,0 12,6Z" />
                        </svg>
                        Rechazar
                      </button>
                      <button
                        className="action-btn-small accept"
                        type="button"
                        onClick={() => aceptar(clase)}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                        </svg>
                        Aceptar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="right-content">
              <div className="calendar-widget">
                <h3>Seleccionar una fecha</h3>
                <div className="current-date">Lunes, 21 de Octubre</div>

                <div className="month-selector">
                  <button className="nav-btn" type="button">‹</button>
                  <select className="month-dropdown">
                    <option>Octubre 2025</option>
                  </select>
                  <button className="nav-btn" type="button">›</button>
                </div>

                <div className="calendar-grid">
                  <div className="calendar-header">
                    <div className="day-header">S</div>
                    <div className="day-header">D</div>
                    <div className="day-header">L</div>
                    <div className="day-header">M</div>
                    <div className="day-header">M</div>
                    <div className="day-header">J</div>
                    <div className="day-header">V</div>
                  </div>
                  <div className="calendar-days">
                    {calendarDays.map((day) => (
                      <div
                        key={day}
                        className="calendar-day"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="calendar-actions">
                  <button className="calendar-btn" type="button">Cancelar</button>
                  <button className="calendar-btn primary" type="button">OK</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelTutor;
