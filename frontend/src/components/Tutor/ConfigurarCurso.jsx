import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/config";
import { cursosAPI } from "../../api/cursos";
import { uploadsAPI } from "../../api/uploads";
import "../../styles/configCurso.css";

const ConfigurarCurso = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [previewPortada, setPreviewPortada] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    modalidad: "",
    precio_reserva: 0,
    necesita_reserva: true,
    categoria: "",
    tags: [],
    portada_url: "",
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data } = await api.get("/categorias");
        if (data?.success && Array.isArray(data.categorias)) {
          setCategorias(data.categorias);
        }
      } catch (error) {
        console.error("Error obteniendo categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTag = () => {
    const tag = window.prompt("Ingresa el tag:");
    if (tag && tag.trim() && !form.tags.includes(tag.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag.trim()] }));
    }
  };

  const handleRemoveTag = (index) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handlePickPortada = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setPreviewPortada(result);
      }
    };
    reader.readAsDataURL(file);

    try {
      const { data } = await uploadsAPI.uploadImage(file);
      if (data?.success && data.url) {
        setForm((prev) => ({ ...prev, portada_url: data.url }));
      }
    } catch (error) {
      console.error("Error subiendo portada de curso:", error);
      window.alert("No se pudo subir la imagen. Usa JPG/PNG/WebP y < 5MB.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.descripcion || !form.modalidad || !form.categoria) {
      window.alert("Por favor completa todos los campos requeridos");
      return;
    }
    if (!form.precio_reserva || Number(form.precio_reserva) <= 0) {
      window.alert("El precio debe ser mayor a 0");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        modalidad: form.modalidad,
        precio_reserva: Number(form.precio_reserva),
        necesita_reserva: form.necesita_reserva,
        categorias: [form.categoria],
        tags: form.tags,
        portada_url: form.portada_url || "",
      };

      const { data } = await cursosAPI.createCurso(payload);

      if (data?.success) {
        window.alert("¡Curso creado exitosamente!");
        navigate("/panel-tutor");
      } else {
        window.alert("Error al crear el curso");
      }
    } catch (error) {
      console.error("Error creando curso:", error);
      window.alert("Error al crear el curso. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate("/panel-tutor");

  return (
    <div className="config-curso-page">
      <div className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1>Configuración Curso (Docente)</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="container">
          <div className="form-container">
            <form onSubmit={handleSubmit} className="config-curso-form">
              <div className="form-layout">
                <div className="left-section">
                  <button type="button" onClick={goBack} className="back-btn">
                    ← Volver
                  </button>

                  <div className="image-upload-large" onClick={triggerFileInput}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePickPortada}
                    />
                    {previewPortada ? (
                      <img
                        src={previewPortada}
                        alt="Portada"
                        style={{ maxHeight: "100%", maxWidth: "100%", borderRadius: 8 }}
                      />
                    ) : (
                      <div className="image-placeholder">
                        +
                      </div>
                    )}
                  </div>

                  <div className="description-section">
                    <h3>DESCRIPCIÓN DEL CURSO</h3>
                    <textarea
                      className="description-textarea"
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      placeholder="Describe el contenido del curso, objetivos, metodología..."
                      rows={8}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="right-section">
                  <div className="form-group">
                    <label className="form-label">Título curso</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-input"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Nombre del curso"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tag</label>
                    <div className="tag-container">
                      <div className="tag-display">
                        <span className="tag-text">Tag</span>
                        <button type="button" onClick={handleAddTag} className="add-tag-btn">
                          +
                        </button>
                      </div>
                      <div className="tags-list">
                        {form.tags.map((tag, index) => (
                          <div key={index} className="tag-item">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(index)}
                              className="remove-tag"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bs/hora</label>
                    <div className="price-container">
                      <input
                        type="number"
                        name="precio_reserva"
                        className="form-input price-input"
                        value={form.precio_reserva}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                      <div className="toggle-container">
                        <label className="toggle-label">
                          <input
                            type="checkbox"
                            name="necesita_reserva"
                            className="toggle-input"
                            checked={form.necesita_reserva}
                            onChange={handleChange}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                    <p className="price-hint">Define el precio por hora.</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Modalidad</label>
                    <select
                      className="form-select"
                      name="modalidad"
                      value={form.modalidad}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar modalidad</option>
                      <option value="presencial">Presencial</option>
                      <option value="virtual">Virtual</option>
                      <option value="hibrida">Híbrida</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <select
                      className="form-select"
                      name="categoria"
                      value={form.categoria}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={goBack} className="cancel-btn">
                      Cancelar
                    </button>
                    <button type="submit" className="save-btn" disabled={loading}>
                      {loading ? "Guardando..." : "Guardar Curso"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurarCurso;
