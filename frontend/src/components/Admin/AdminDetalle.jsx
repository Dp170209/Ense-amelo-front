import "../../styles/Admin/adminDetalle.css";

const AdminDetalle = ({
  solicitud,
  onClose,
  onChangeEstado,
  onViewDocs,
  onAddComment,
}) => {
  if (!solicitud) return null;

  const { curso, perfil_tutor } = solicitud;

  return (
    <section className="admin-detail">
      <div className="admin-detail-left">
        <div className="admin-detail-media">
          {/* Podrías usar curso.fotos si viene una URL real */}
          <div className="admin-detail-media-placeholder" />
        </div>

        <div className="admin-detail-tutor-row">
          <div className="admin-detail-tutor-info">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                perfil_tutor.nombre_tutor || "Tutor"
              )}&background=0EA5E9&color=0F172A`}
              alt={perfil_tutor.nombre_tutor || "Tutor"}
              className="admin-detail-tutor-avatar"
            />
            <div>
              <p className="admin-detail-tutor-name">
                {perfil_tutor.nombre_tutor || "Tutor sin nombre"}
              </p>
              <p className="admin-detail-tutor-desc">
                {perfil_tutor.biografia}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-detail-info">
        <div className="admin-detail-header-row">
          <h2 className="admin-detail-title">{curso.nombre}</h2>

          <button
            type="button"
            className="admin-detail-close-btn"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        {curso.modalidad && (
          <span className="admin-detail-tag">{curso.modalidad}</span>
        )}

        <div className="admin-detail-price-row">
          <span className="admin-detail-arrow">→</span>
          <p className="admin-detail-price">
            {curso.necesita_reserva
              ? `${curso.precio_reserva} Bs/hora`
              : "Sin reserva previa"}
          </p>
        </div>

        <p className="admin-detail-summary">{curso.descripcion}</p>

        <div className="admin-detail-meta-grid">
          <div>
            <p className="admin-detail-meta-label">CI tutor</p>
            <p className="admin-detail-meta-value">{perfil_tutor.ci}</p>
          </div>
          <div>
            <p className="admin-detail-meta-label">Estado verificación</p>
            <p className="admin-detail-meta-value">{perfil_tutor.verificado}</p>
          </div>
          <div>
            <p className="admin-detail-meta-label">Clasificación</p>
            <p className="admin-detail-meta-value">
              {perfil_tutor.clasificacion} / 5
            </p>
          </div>
          <div>
            <p className="admin-detail-meta-label">Estado solicitud</p>
            <p className="admin-detail-meta-value">
              {solicitud.estado.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="admin-detail-description-block">
          <h3 className="admin-detail-description-title">
            Comentario de la solicitud
          </h3>
          <p className="admin-detail-description-text">
            {solicitud.comentario || "Sin comentarios adicionales."}
          </p>
        </div>

        {/* Botones secundarios: ver docs y agregar comentario */}
        <div className="admin-detail-secondary-actions">
          <button
            type="button"
            className="admin-detail-btn admin-detail-btn-light"
            onClick={onViewDocs}
          >
            Ver documentos
          </button>

          <button
            type="button"
            className="admin-detail-btn admin-detail-btn-light"
            onClick={onAddComment}
          >
            Agregar comentario
          </button>
        </div>

        {/* Botones principales: aceptar / rechazar */}
        <div className="admin-detail-actions">
          <button
            type="button"
            className="admin-detail-btn admin-detail-btn-outline"
            onClick={() => onChangeEstado("rechazado")}
          >
            Rechazar
          </button>

          <button
            type="button"
            className="admin-detail-btn admin-detail-btn-primary"
            onClick={() => onChangeEstado("aceptado")}
          >
            Aceptar
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminDetalle;
