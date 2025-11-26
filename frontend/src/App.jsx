import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Explorar from "./components/Explorar/Explorar";
import MisCursos from "./components/MisCursos/MisCursos";
import InfoCurso from "./components/InfoCurso/InfoCurso";
import Navbar from "./components/Navbar";
import PanelAdmin from "./components/Admin/PanelAdmin";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Routes>
        {/* Redirección raíz (opcional) */}
        <Route path="/" element={<Navigate to="/explorar" replace />} />

        {/* Login y registro */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Panel admin (solicitudes de tutores) */}
        <Route
          path="/admin/solicitudes-tutores"
          element={
            <>
              <Navbar currentSection="admin" adminMode />
              <PanelAdmin />
            </>
          }
        />

        {/* Explorar */}
        <Route
          path="/explorar"
          element={
            <>
              <Navbar currentSection="explore" />
              <Explorar />
            </>
          }
        />

        {/* Mis cursos */}
        <Route
          path="/mis-cursos"
          element={
            <>
              <Navbar currentSection="courses" />
              <MisCursos />
            </>
          }
        />

        {/* Info de curso */}
        <Route
          path="/curso/:id"
          element={
            <>
              <Navbar currentSection="courses" />
              <InfoCurso />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
