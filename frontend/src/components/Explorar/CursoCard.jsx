import "../../styles/Explorar/cursoCard.css";
import { Link } from "react-router-dom";
import api from "../../api/config";

const tagColors = {
  Programación: "tag-blue",
  Productividad: "tag-green",
  Marketing: "tag-pink",
};

const resolvePortadaUrl = (portada) => {
  if (!portada) return "";

  // Si ya es data URL o URL absoluta, se usa tal cual
  if (portada.startsWith("data:")) return portada;
  if (portada.startsWith("http://") || portada.startsWith("https://")) return portada;

  // Si viene como "/static/cursos/..." desde el backend, le anteponemos la raíz del API
  if (portada.startsWith("/")) {
    const baseApi = api.defaults.baseURL || ""; // ej: http://localhost:3000/api
    const root = baseApi.replace(/\/+api\/?$/, ""); // -> http://localhost:3000
    return root + portada;
  }

  return portada;
};

const CursoCard = ({ id, titulo, tag, descripcion, nivel, duracion, portada }) => {
  const tagClass = tagColors[tag] || "tag-default";
  const portadaSrc = resolvePortadaUrl(portada);

  return (
    <Link to={`/curso/${id}`} className="block">
      <article className="curso-card hover:shadow-md transition-shadow">
        <div className="curso-thumb">
          {portadaSrc && (
            <img
              src={portadaSrc}
              alt={titulo}
              className="curso-thumb-img"
            />
          )}
        </div>

        <div className="curso-content">
          <div>
            <div className="curso-title-row">
              <h3 className="curso-title">{titulo}</h3>
            </div>

            {tag && (
              <span className={`curso-tag ${tagClass}`}>
                {tag}
              </span>
            )}

            <p className="curso-description">{descripcion}</p>
          </div>

          {(nivel || duracion) && (
            <div className="curso-meta">
              {nivel && <span className="mr-2">Nivel: {nivel}</span>}
              {duracion && <span>Duración: {duracion}</span>}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default CursoCard;
