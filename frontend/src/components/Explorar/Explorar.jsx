import { useState, useMemo, useEffect } from "react";
import Buscador from "./Buscador";
import CursoCard from "./CursoCard";
import { cursosAPI } from "../../api/cursos";
import "../../styles/Explorar/explorar.css";

const cursosMock = [
  {
    id: "mock-1",
    titulo: "Python desde Cero",
    tag: "Programación",
    descripcion: "Aprende Python paso a paso sin experiencia previa.",
    modalidad: "virtual",
    precio: 0,
  },
  {
    id: "mock-2",
    titulo: "Productividad con Notion",
    tag: "Productividad",
    descripcion: "Organiza tu vida y proyectos usando Notion.",
    modalidad: "virtual",
    precio: 0,
  },
  {
    id: "mock-3",
    titulo: "Marketing Digital para Emprendedores",
    tag: "Marketing",
    descripcion: "Publicidad, embudos y ventas online.",
    modalidad: "virtual",
    precio: 0,
  },
];

const PER_PAGE = 6;

const Explorar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cursos, setCursos] = useState(cursosMock);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const { data } = await cursosAPI.getCursos();
        if (data?.success && Array.isArray(data.cursos)) {
          const reales = data.cursos.map((curso) => ({
            id: curso._id,
            titulo: curso.nombre,
            descripcion: curso.descripcion,
            tag:
              (Array.isArray(curso.tags) && curso.tags[0]) ||
              (Array.isArray(curso.categorias) && curso.categorias[0]?.nombre) ||
              "General",
            modalidad: curso.modalidad,
            precio: curso.precio_reserva,
            portada: curso.portada_url,
          }));

          setCursos((prev) => {
            const existentesIds = new Set(prev.map((c) => c.id));
            const nuevos = reales.filter((c) => !existentesIds.has(c.id));
            return [...prev, ...nuevos];
          });
        }
      } catch (error) {
        console.error("Error obteniendo cursos:", error);
      }
    };

    fetchCursos();
  }, []);

  const handleToggleTag = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1); 
  };

  const cursosFiltrados = useMemo(() => {
    return cursos.filter((curso) => {
      const textMatch =
        searchTerm.trim() === "" ||
        curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.tag.toLowerCase().includes(searchTerm.toLowerCase());

      const tagsMatch =
        activeTags.length === 0 || activeTags.includes(curso.tag);

      return textMatch && tagsMatch;
    });
  }, [searchTerm, activeTags]);

  const totalPages = Math.max(1, Math.ceil(cursosFiltrados.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PER_PAGE;
  const cursosPagina = cursosFiltrados.slice(
    startIndex,
    startIndex + PER_PAGE
  );

  const goToPage = (page) => {
    setCurrentPage((prev) => {
      if (page < 1) return 1;
      if (page > totalPages) return totalPages;
      return page;
    });
  };

  return (
    <div className="explorar-page">
      <Buscador
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1); 
        }}
        tags={Array.from(new Set(cursos.map((c) => c.tag).filter(Boolean)))}
        activeTags={activeTags}
        onTagToggle={handleToggleTag}
        onClear={() => {
          setSearchTerm("");
          setCurrentPage(1);
        }}
      />

      <main className="explorar-main">
        <h2 className="explorar-title">Explora cursos</h2>

        <section className="explorar-grid">
          {cursosPagina.length > 0 ? (
            cursosPagina.map((curso) => (
              <CursoCard key={curso.id} {...curso} />
            ))
          ) : (
            <p className="explorar-empty">
              No se encontraron cursos con esos filtros.
            </p>
          )}
        </section>

        {cursosFiltrados.length > PER_PAGE && (
          <div className="explorar-pagination">
            {safePage > 1 && (
              <button
                type="button"
                className="explorar-pagination-btn"
                onClick={() => goToPage(safePage - 1)}
              >
                ← Anterior
              </button>
            )}


            {[...Array(totalPages)].map((_, idx) => {
              const pageNumber = idx + 1;
              const isActive = pageNumber === safePage;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  className={
                    "explorar-page-number " +
                    (isActive ? "explorar-page-number-active" : "")
                  }
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Botón siguiente (solo se muestra si no estamos en la última) */}
            {safePage < totalPages && (
              <button
                type="button"
                className="explorar-pagination-btn"
                onClick={() => goToPage(safePage + 1)}
              >
                Siguiente →
              </button>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default Explorar;
