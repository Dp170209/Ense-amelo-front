import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cursosAPI } from "../api/cursos";
import { reservasAPI } from "../api/reservas";
import CardTutor from "./Tutor/CardTutor";
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
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [errorCursos, setErrorCursos] = useState("");
  const [reservasConfirmadas, setReservasConfirmadas] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      setLoadingCursos(true);
      setErrorCursos("");
      try {
        const { data } = await cursosAPI.getMisCursos();
        if (data?.success && Array.isArray(data.cursos)) {
          setCursos(
            data.cursos.map((c) => ({
              id: c._id,
              titulo: c.nombre,
              descripcion: c.descripcion,
              categorias: c.categorias || [],
              precio: c.precio_reserva,
              modalidad: c.modalidad,
              verificacion_estado: c.verificacion_estado,
            }))
          );
        } else {
          setErrorCursos("No se pudieron cargar tus cursos.");
        }
      } catch (err) {
        console.error("Error obteniendo cursos del tutor:", err);
        setErrorCursos(
          err?.response?.data?.message ||
            "Error al obtener tus cursos. Inténtalo de nuevo más tarde."
        );
      } finally {
        setLoadingCursos(false);
      }
    };

    fetchCursos();

    const fetchReservasConfirmadas = async () => {
      try {
        const { data } = await reservasAPI.getReservasConfirmadasTutor();
        if (data?.success && Array.isArray(data.reservas)) {
          setReservasConfirmadas(data.reservas);
        } else {
          setReservasConfirmadas([]);
        }
      } catch (err) {
        console.error("Error obteniendo reservas confirmadas del tutor:", err);
        setReservasConfirmadas([]);
      }
    };

    fetchReservasConfirmadas();
  }, []);

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
    const section = document.getElementById("tutor-calendar-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const reservasPorDia = reservasConfirmadas.reduce((acc, reserva) => {
    if (!reserva.fecha) return acc;
    const fecha = new Date(reserva.fecha);
    const dia = fecha.getDate();
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(reserva);
    return acc;
  }, {});

  const viewCursos = () => {
    const section = document.getElementById("tutor-cursos-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
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
      <div className="main-content">
        <div className="container">
          <h1 className="panel-tutor-title">Panel Tutor</h1>
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
                      <button className="action-btn" type="button" onClick={viewCursos}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 4H21V6H3V4M3 8H21V18H3V8M5 10V16H11V10H5Z" />
                        </svg>
                        Cursos
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

              <div
                id="tutor-cursos-section"
                style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}
              >
                <h3 style={{ margin: 0 }}>Mis cursos</h3>
                {loadingCursos && (
                  <p style={{ fontSize: 14, color: "#7f8c8d" }}>
                    Cargando cursos...
                  </p>
                )}
                {!loadingCursos && errorCursos && (
                  <p style={{ fontSize: 14, color: "#e74c3c" }}>{errorCursos}</p>
                )}
                {!loadingCursos && !errorCursos && cursos.length === 0 && (
                  <p style={{ fontSize: 14, color: "#7f8c8d" }}>
                    Aún no tienes cursos creados.
                  </p>
                )}
                {!loadingCursos && !errorCursos && cursos.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {cursos.map((curso) => (
                      <CardTutor key={curso.id} {...curso} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="right-content" id="tutor-calendar-section">
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
                    {calendarDays.map((day) => {
                      const reservasDia = reservasPorDia[day] || [];
                      const tieneReserva = reservasDia.length > 0;
                      const tooltip = tieneReserva
                        ? reservasDia
                            .map(
                              (r) =>
                                `${r.id_curso?.nombre || "Curso"} - Estudiante: ${
                                  r.id_usuario?._id || ""
                                }`
                            )
                            .join("\n")
                        : "";

                      return (
                        <div
                          key={day}
                          className={
                            "calendar-day" +
                            (tieneReserva ? " calendar-day-reservado" : "")
                          }
                          title={tooltip}
                        >
                          {day}
                        </div>
                      );
                    })}
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
