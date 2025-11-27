import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Explorar from "./components/Explorar/Explorar";
import MisCursos from "./components/MisCursos/MisCursos";
import InfoCurso from "./components/InfoCurso/InfoCurso";
import Navbar from "./components/Navbar";
import PerfilEstudiante from "./components/PerfilEstudiante";
import EditarPerfilEstudiante from "./components/EditarPerfilEstudiante";
import RegistroTutor from "./components/RegistroTutor";
import PanelTutor from "./components/PanelTutor";
import ConfigurarCurso from "./components/Tutor/ConfigurarCurso";
import PerfilTutor from "./components/PerfilTutor";
import EditarPerfilTutor from "./components/EditarPerfilTutor";
import PanelAdmin from "./components/Admin/PanelAdmin";
import ChatPage from "./components/Chat/ChatPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Routes>
        {/* Redirección raíz (opcional) */}
        <Route path="/" element={<Navigate to="/explorar" replace />} />

        {/* Login y registro */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/registro-tutor" element={<RegistroTutor />} />

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

        {/* Chats */}
        <Route
          path="/chats"
          element={
            <>
              <Navbar currentSection="chats" />
              <ChatPage />
            </>
          }
        />
        <Route
          path="/chats/:id"
          element={
            <>
              <Navbar currentSection="chats" />
              <ChatPage />
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

        {/* Perfil */}
        <Route path="/perfil" element={
          <>
            <Navbar currentSection="profile" />
            <PerfilEstudiante />
          </>
        }/>

        {/* Editar Perfil */}
        <Route path="/perfil/editar" element={
          <>
            <Navbar currentSection="profile" />
            <EditarPerfilEstudiante />
          </>
        }/>

        {/* Info de curso */}
        <Route path="/curso/:id" element={
          <>
            <Navbar currentSection="courses" />
            <InfoCurso />
          </>
        }/>

        {/* Panel tutor */}
        <Route path="/panel-tutor" element={<PanelTutor />} />
        <Route path="/tutor/curso/nuevo" element={<ConfigurarCurso />} />

        {/* Perfil tutor */}
        <Route path="/tutor/perfil" element={<PerfilTutor />} />
        <Route path="/tutor/perfil/editar" element={<EditarPerfilTutor />} />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
