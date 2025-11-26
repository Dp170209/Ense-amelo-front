import "../../styles/InfoCurso/infoCurso.css";
import "../../styles/InfoCurso/reviewCard.css";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/config";
import { cursosAPI } from "../../api/cursos";

// 🔹 Mock de datos del curso
const cursoMock = {
    titulo: "Título del curso",
    tag: "Programación",
    precio: "25 Bs/hora",
    resumen:
        "Texto cualquiera para poder poner información del curso en una línea corta.",
    descripcionLarga:
        "Aquí irá una descripción más extensa del curso. Puedes explicar qué aprenderá el estudiante, qué temas se cubren y cómo se organiza el contenido.",
    tutor: {
        nombre: "Nombre del tutor",
        descripcion: "Descripción corta del tutor",
        avatar:
            "https://ui-avatars.com/api/?name=Tutor&background=0EA5E9&color=0F172A",
    },
};

// 🔹 Mock de reseñas
const reseñasMock = [
    {
        id: 1,
        titulo: "Título reseña",
        cuerpo:
            "Cuerpo de la reseña. Aquí va la opinión del estudiante sobre el curso.",
        usuario: "Nombre usuario reseña",
        fecha: "Mar 20, 2025",
        rating: 4,
    },
    {
        id: 2,
        titulo: "Excelente tutor",
        cuerpo:
            "Explica con claridad y responde rápido a las dudas. Muy recomendable.",
        usuario: "Ana López",
        fecha: "Mar 18, 2025",
        rating: 5,
    },
    {
        id: 3,
        titulo: "Buen contenido",
        cuerpo:
            "El curso cubre justo lo que necesitaba para empezar en este tema.",
        usuario: "Carlos Pérez",
        fecha: "Mar 10, 2025",
        rating: 4,
    },
];


const resolvePortadaUrl = (portada) => {
    if (!portada) return "";

    if (portada.startsWith("data:")) return portada;
    if (portada.startsWith("http://") || portada.startsWith("https://")) return portada;

    if (portada.startsWith("/")) {
        const baseApi = api.defaults.baseURL || ""; // ej: http://localhost:3000/api
        const root = baseApi.replace(/\/+api\/?$/, ""); // -> http://localhost:3000
        return root + portada;
    }

    return portada;
};

const CourseInfoSection = ({ curso }) => {
    const data = curso || cursoMock;
    const { titulo, tag, precio, resumen, descripcionLarga, tutor, portada_url } = data;
    const portadaSrc = resolvePortadaUrl(portada_url);

    return (
        <section className="infocurso-layout">
            <div className="infocurso-left">
                <div className="infocurso-media-wrapper">
                    {portadaSrc ? (
                        <img
                            src={portadaSrc}
                            alt={titulo}
                            className="infocurso-media-img"
                        />
                    ) : (
                        <div className="infocurso-media-placeholder" />
                    )}

                    <button
                        type="button"
                        className="infocurso-media-arrow infocurso-media-arrow-left"
                        aria-label="Anterior"
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        className="infocurso-media-arrow infocurso-media-arrow-right"
                        aria-label="Siguiente"
                    >
                        ›
                    </button>
                </div>
                <div className="infocurso-tutor-row">
                    <div className="infocurso-tutor-info">
                        <img
                            src={tutor.avatar}
                            alt={tutor.nombre}
                            className="infocurso-tutor-avatar"
                        />
                        <div>
                            <p className="infocurso-tutor-name">{tutor.nombre}</p>
                            <p className="infocurso-tutor-desc">{tutor.descripcion}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="infocurso-chat-btn"
                        aria-label="Abrir chat con el tutor"
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    </button>

                </div>
            </div>

            <div className="infocurso-info">
                <h1 className="infocurso-title">{titulo}</h1>

                {tag && <span className="infocurso-tag">{tag}</span>}

                <div className="infocurso-price-row">
                    <span className="infocurso-arrow">→</span>
                    <p className="infocurso-price">{precio}</p>
                </div>

                <p className="infocurso-summary">{resumen}</p>

                <button type="button" className="infocurso-reserve-btn">
                    Reservar
                </button>

                <div className="infocurso-description-block">
                    <h2 className="infocurso-description-title">
                        Descripción del curso
                    </h2>
                    <p className="infocurso-description-text">{descripcionLarga}</p>
                </div>
            </div>
        </section>
    );
};

const ReviewCard = ({ titulo, cuerpo, usuario, fecha, rating }) => {
    const filled = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);

    return (
        <article className="review-card">
            <div className="review-stars">
                <span className="review-stars-filled">{filled}</span>
                <span className="review-stars-empty">{empty}</span>
            </div>

            <h3 className="review-title">{titulo}</h3>
            <p className="review-body">{cuerpo}</p>

            <div className="review-footer">
                <img
                    src="https://ui-avatars.com/api/?name=User&background=CBD5F5&color=0F172A"
                    alt={usuario}
                    className="review-avatar"
                />
                <div>
                    <p className="review-user-name">{usuario}</p>
                    <p className="review-date">{fecha}</p>
                </div>
            </div>
        </article>
    );
};

const ReviewsSection = ({ userReviews, onAddReview }) => {
    const [titulo, setTitulo] = useState("");
    const [cuerpo, setCuerpo] = useState("");
    const [rating, setRating] = useState(5);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!titulo.trim() || !cuerpo.trim()) return;

        const nueva = {
            id: Date.now(),
            titulo: titulo.trim(),
            cuerpo: cuerpo.trim(),
            usuario: "Tú",
            fecha: new Date().toLocaleDateString(),
            rating: Number(rating) || 5,
        };

        onAddReview(nueva);
        setTitulo("");
        setCuerpo("");
        setRating(5);
    };

    return (
        <section className="infocurso-reviews-section">
            <h2 className="infocurso-reviews-title">Reseñas</h2>

            <div className="infocurso-reviews-grid">
                {reseñasMock.map((r) => (
                    <ReviewCard key={r.id} {...r} />
                ))}
                {userReviews.map((r) => (
                    <ReviewCard key={r.id} {...r} />
                ))}
            </div>

            <form className="infocurso-review-form" onSubmit={handleSubmit}>
                <h3 className="infocurso-review-form-title">Escribe tu reseña</h3>
                <div className="infocurso-review-form-row">
                    <label>
                        Título
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="infocurso-review-input"
                        />
                    </label>
                </div>
                <div className="infocurso-review-form-row">
                    <label>
                        Comentario
                        <textarea
                            value={cuerpo}
                            onChange={(e) => setCuerpo(e.target.value)}
                            className="infocurso-review-textarea"
                            rows={4}
                        />
                    </label>
                </div>
                <div className="infocurso-review-form-row">
                    <label>
                        Calificación
                        <select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="infocurso-review-select"
                        >
                            {[5, 4, 3, 2, 1].map((v) => (
                                <option key={v} value={v}>{v} estrellas</option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit" className="infocurso-review-submit">
                    Publicar reseña
                </button>
            </form>
        </section>
    );
};

const InfoCurso = () => {
    const { id } = useParams();
    const [curso, setCurso] = useState(null);
    const [userReviews, setUserReviews] = useState([]);

    useEffect(() => {
        const fetchCurso = async () => {
            if (!id) return;
            try {
                const { data } = await api.get(`/cursos/${id}`);

                if (data?.success && data.curso) {
                    const c = data.curso;

                    const mapped = {
                        // Campos que ya usa el layout
                        titulo: c.nombre || cursoMock.titulo,
                        tag:
                            (Array.isArray(c.tags) && c.tags[0]) ||
                            (Array.isArray(c.categorias) && c.categorias[0]?.nombre) ||
                            cursoMock.tag,
                        precio:
                            typeof c.precio_reserva === "number"
                                ? `${c.precio_reserva} Bs/hora`
                                : cursoMock.precio,
                        resumen: c.descripcion || cursoMock.resumen,
                        descripcionLarga: c.descripcion || cursoMock.descripcionLarga,
                        portada_url: c.portada_url || "",
                        tutor: {
                            nombre:
                                c.id_tutor?.id_usuario?.nombre && c.id_tutor?.id_usuario?.apellido
                                    ? `${c.id_tutor.id_usuario.nombre} ${c.id_tutor.id_usuario.apellido}`
                                    : cursoMock.tutor.nombre,
                            descripcion: cursoMock.tutor.descripcion,
                            avatar:
                                c.id_tutor?.id_usuario?.foto || cursoMock.tutor.avatar,
                        },
                    };

                    setCurso(mapped);
                }
            } catch {
                // fallback silencioso al mock
            }
        };

        fetchCurso();
    }, [id]);

    // Cargar reseñas guardadas en localStorage para este curso
    useEffect(() => {
        if (!id) return;
        try {
            const raw = localStorage.getItem(`cursoReviews:${id}`);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    setUserReviews(parsed);
                }
            }
        } catch {
            // ignorar errores de parseo
        }
    }, [id]);

    const handleAddReview = (review) => {
        setUserReviews((prev) => {
            const updated = [review, ...prev];
            if (id) {
                try {
                    localStorage.setItem(`cursoReviews:${id}`, JSON.stringify(updated));
                } catch {
                    // ignorar errores de almacenamiento
                }
            }
            return updated;
        });
    };

    return (
        <div className="infocurso-page">
            <main className="infocurso-main">
                <CourseInfoSection curso={curso} />
                <ReviewsSection userReviews={userReviews} onAddReview={handleAddReview} />
            </main>
        </div>
    );
};

export default InfoCurso;
