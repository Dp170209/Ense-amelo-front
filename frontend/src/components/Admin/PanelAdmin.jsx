import { useState } from "react";
import "../../styles/Admin/adminPanel.css";
import CardAdmin from "./CardAdmin";
import AdminDetalle from "./AdminDetalle";

// 🔹 Mock con nombres de campos reales de la bdd
const solicitudesMock = [
  {
    id_verificar: 1,
    estado: "pendiente", // pendiente | aceptado | rechazado
    comentario: "El tutor subió su CI correctamente.",
    foto_ci: "/uploads/ci_tutor1.png",
    creado: "2025-01-10 10:30:00",
    decidido: null,
    actualizado: "2025-01-10 10:30:00",
    curso: {
      id_curso: 101,
      nombre: "Matemáticas básicas",
      descripcion:
        "Fundamentos de aritmética y álgebra para estudiantes de colegio.",
      modalidad: "Virtual",
      fotos: "/uploads/curso_matematicas.png",
      creado: "2025-01-05 09:00:00",
      actualizado: "2025-01-08 15:20:00",
      necesita_reserva: true,
      precio_reserva: 30.0,
      attribute_10: 0,
    },
    perfil_tutor: {
      id_tutor: 1,
      ci: "12345678",
      verificado: "En proceso",
      clasificacion: 4.5,
      biografia:
        "Profesor de matemáticas con 5 años de experiencia en educación secundaria.",
      creacion: "2025-01-01 08:00:00",
      actualizado: "2025-01-09 12:15:00",
      nombre_tutor: "Tutor 1",
    },
  },
  {
    id_verificar: 2,
    estado: "pendiente",
    comentario: "Documentación verificada.",
    foto_ci: "/uploads/ci_tutor2.png",
    creado: "2025-01-09 11:00:00",
    decidido: "2025-01-11 14:00:00",
    actualizado: "2025-01-11 14:00:00",
    curso: {
      id_curso: 102,
      nombre: "Inglés conversacional",
      descripcion:
        "Práctica de conversación en inglés para mejorar fluidez y pronunciación.",
      modalidad: "Presencial",
      fotos: "/uploads/curso_ingles.png",
      creado: "2025-01-03 10:00:00",
      actualizado: "2025-01-07 10:30:00",
      necesita_reserva: true,
      precio_reserva: 40.0,
      attribute_10: 0,
    },
    perfil_tutor: {
      id_tutor: 2,
      ci: "87654321",
      verificado: "Verificado",
      clasificacion: 4.9,
      biografia:
        "Tutor bilingüe con experiencia en preparación para exámenes internacionales.",
      creacion: "2025-01-02 10:00:00",
      actualizado: "2025-01-11 14:00:00",
      nombre_tutor: "Tutor 2",
    },
  },
  {
    id_verificar: 3,
    estado: "aceptado",
    comentario: "La foto del documento no es legible.",
    foto_ci: "/uploads/ci_tutor3.png",
    creado: "2025-01-08 16:20:00",
    decidido: "2025-01-10 09:10:00",
    actualizado: "2025-01-10 09:10:00",
    curso: {
      id_curso: 103,
      nombre: "Física para universitarios",
      descripcion: "Curso introductorio de mecánica clásica y electricidad.",
      modalidad: "Virtual",
      fotos: "/uploads/curso_fisica.png",
      creado: "2025-01-04 09:30:00",
      actualizado: "2025-01-06 18:45:00",
      necesita_reserva: false,
      precio_reserva: 0,
      attribute_10: 0,
    },
    perfil_tutor: {
      id_tutor: 3,
      ci: "44556677",
      verificado: "Rechazado",
      clasificacion: 4.0,
      biografia:
        "Estudiante de último año de ingeniería con experiencia como auxiliar.",
      creacion: "2025-01-03 07:30:00",
      actualizado: "2025-01-10 09:10:00",
      nombre_tutor: "Tutor 3",
    },
  },
];

const PanelAdmin = () => {
  const [filter, setFilter] = useState("todos");
  const [solicitudes, setSolicitudes] = useState(solicitudesMock);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const handleChangeEstado = (id_verificar, nuevoEstado) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id_verificar === id_verificar ? { ...s, estado: nuevoEstado } : s
      )
    );

    // Si estamos viendo el detalle de esa solicitud, actualizamos también ahí
    setSelectedSolicitud((prev) =>
      prev && prev.id_verificar === id_verificar
        ? { ...prev, estado: nuevoEstado }
        : prev
    );
  };

  const filteredSolicitudes = solicitudes.filter((sol) =>
    filter === "todos" ? true : sol.estado === filter
  );

  return (
    <div className="admin-panel-page">
      <div className="admin-panel-container">
        {/* Hero / cabecera del panel */}
        <section className="admin-panel-hero">
          <div className="admin-panel-hero-overlay" />
          <div className="admin-panel-hero-content">
            <div>
              <h1 className="admin-panel-title">Solicitudes de Tutores</h1>
              <p className="admin-panel-subtitle">
                Revisa y decide sobre las solicitudes de verificación.
              </p>
            </div>
          </div>

          <div className="admin-panel-hero-graphic">{/* decorativo */}</div>
        </section>

        {/* Filtros por estado (solo si NO hay detalle abierto) */}
        {!selectedSolicitud && (
          <div className="admin-panel-filters">
            <button
              className={
                "admin-panel-filter " +
                (filter === "todos" ? "admin-panel-filter-active" : "")
              }
              onClick={() => setFilter("todos")}
            >
              Todos
            </button>

            <button
              className={
                "admin-panel-filter " +
                (filter === "pendiente" ? "admin-panel-filter-active" : "")
              }
              onClick={() => setFilter("pendiente")}
            >
              Pendientes
            </button>
            <button
              className={
                "admin-panel-filter " +
                (filter === "aceptado" ? "admin-panel-filter-active" : "")
              }
              onClick={() => setFilter("aceptado")}
            >
              Aceptados
            </button>
            <button
              className={
                "admin-panel-filter " +
                (filter === "rechazado" ? "admin-panel-filter-active" : "")
              }
              onClick={() => setFilter("rechazado")}
            >
              Rechazados
            </button>
          </div>
        )}

        {/* Detalle de curso */}
        {selectedSolicitud && (
          <AdminDetalle
            solicitud={selectedSolicitud}
            onClose={() => setSelectedSolicitud(null)}
            onChangeEstado={(nuevoEstado) =>
              handleChangeEstado(selectedSolicitud.id_verificar, nuevoEstado)
            }
            onViewDocs={() => {
              console.log(
                "Ver documentos de solicitud",
                selectedSolicitud.id_verificar
              );
              // aquí luego vas a abrir modal / nueva vista con documentos
            }}
            onAddComment={() => {
              const nuevoComentario = window.prompt(
                "Agregar comentario del administrador:",
                selectedSolicitud.comentario || ""
              );
              if (nuevoComentario !== null) {
                setSolicitudes((prev) =>
                  prev.map((s) =>
                    s.id_verificar === selectedSolicitud.id_verificar
                      ? { ...s, comentario: nuevoComentario }
                      : s
                  )
                );
                setSelectedSolicitud((prev) =>
                  prev
                    ? { ...prev, comentario: nuevoComentario }
                    : prev
                );
              }
            }}
          />
        )}

        {/* Lista de cards: solo cuando NO hay detalle abierto */}
        {!selectedSolicitud && (
          <section className="admin-panel-list">
            {filteredSolicitudes.length > 0 ? (
              filteredSolicitudes.map((item) => (
                <CardAdmin
                  key={item.id_verificar}
                  solicitud={item}
                  onDetail={() => setSelectedSolicitud(item)}
                  onReject={() =>
                    handleChangeEstado(item.id_verificar, "rechazado")
                  }
                  onAccept={() =>
                    handleChangeEstado(item.id_verificar, "aceptado")
                  }
                />
              ))
            ) : (
              <p className="text-center text-sm text-slate-500 py-6">
                No hay solicitudes en esta categoría.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default PanelAdmin;
