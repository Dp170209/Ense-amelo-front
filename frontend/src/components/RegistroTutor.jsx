import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/registroTutor.css";
import { authAPI } from "../api/auth";

const RegistroTutor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombreCompleto: "",
    telefono: "",
    email: "",
    password: "",
    acceptTerms: false,
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.acceptTerms) {
      alert("Debe aceptar los términos y condiciones");
      return;
    }

    if (!form.password || form.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      const nameParts = form.nombreCompleto.trim().split(" ");
      const nombre = nameParts[0] || "";
      const apellido = nameParts.slice(1).join(" ") || "";

      const userData = {
        email: form.email,
        password: form.password,
        rolCodigo: 2, // tutor/docente
        nombre,
        apellido,
        telefono: form.telefono,
      };

      const response = await authAPI.register(userData);

      if (response.data?.success) {
        // Auto-login para que entre directo a su panel
        const loginRes = await authAPI.login(form.email, form.password);
        if (loginRes.data?.success && loginRes.data?.token) {
          localStorage.setItem("token", loginRes.data.token);
          if (loginRes.data.user) {
            localStorage.setItem("user", JSON.stringify(loginRes.data.user));
          }

          if (files.length > 0) {
            const formData = new FormData();
            files.forEach((file) => {
              formData.append("documentos", file);
            });

            try {
              await authAPI.uploadTutorDocuments(formData);
            } catch (uploadError) {
              console.error("Error subiendo documentos de tutor:", uploadError);
            }
          }

          navigate("/panel-tutor", { replace: true });
        } else {
          alert("Registro exitoso. Inicia sesión con tus credenciales.");
          navigate("/login", { replace: true });
        }
      } else {
        alert("Error en el registro: " + (response.data?.message || ""));
      }
    } catch (error) {
      console.error("Error en registro de tutor:", error);
      const message =
        error.response?.data?.message ||
        "Error al registrarse. El email puede estar en uso.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-tutor-page">
      <div className="form-container">
        <div className="form-box">
          <h2 className="form-title">Registro de Tutor</h2>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Apellidos y Nombres</label>
              <input
                type="text"
                name="nombreCompleto"
                className="form-input"
                placeholder="Pérez Juan Carlos"
                value={form.nombreCompleto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                className="form-input"
                placeholder="+51 987654321"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="tutor@correo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Foto de perfil y documentos profesionales: solo UI por ahora */}
            <div className="form-group">
              <label className="form-label">Foto de perfil</label>
              <div className="photo-upload">
                <div className="photo-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Documentos profesionales</label>
              <div className="file-upload">
                <input
                  type="file"
                  className="file-input"
                  multiple
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <div className="file-display">
                  <span className="file-text">Selecciona tus archivos</span>
                  <button type="button" className="submit-files-btn">
                    Subir archivos
                  </button>
                </div>
              </div>
            </div>

            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="terms"
                  name="acceptTerms"
                  className="checkbox-input"
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="terms" className="checkbox-label">
                  Acepto los <button type="button" className="terms-link">Términos y condiciones</button>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Registrando..." : "Registrar cuenta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroTutor;
