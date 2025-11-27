import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatsAPI } from "../../api/chats";
import { reservasAPI } from "../../api/reservas";
import ReservarHorario from "./ReservarHorario";
import "../../styles/chat.css";

const ChatPage = () => {
  const navigate = useNavigate();
  const { id: routeChatId } = useParams();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(routeChatId || null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModalReserva, setMostrarModalReserva] = useState(false);

  const usuarioActual = JSON.parse(localStorage.getItem("user") || "{}");
  const usuarioActualId = usuarioActual._id || usuarioActual.id;
  const usuarioActualRol = usuarioActual.rol;
  const usuarioActualRolCodigo = usuarioActual.rolCodigo;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await chatsAPI.getChats();
        if (data?.success) {
          setChats(data.chats || []);
        }
      } catch (error) {
        console.error("Error obteniendo chats:", error);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0]._id);
      return;
    }

    if (!selectedChatId) return;

    const fetchMensajes = async () => {
      try {
        const { data } = await chatsAPI.getMensajes(selectedChatId);
        if (data?.success) {
          setMensajes(data.mensajes || []);
        }
      } catch (error) {
        console.error("Error obteniendo mensajes:", error);
      }
    };

    fetchMensajes();
  }, [selectedChatId, chats]);

  useEffect(() => {
    if (routeChatId) {
      setSelectedChatId(routeChatId);
    }
  }, [routeChatId]);

  const manejarSeleccionChat = (chatId) => {
    setSelectedChatId(chatId);
    navigate(`/chats/${chatId}`);
  };

  const manejarEnviarMensaje = async () => {
    const contenido = nuevoMensaje.trim();
    if (!contenido || !selectedChatId) return;

    try {
      const { data } = await chatsAPI.sendMensaje(selectedChatId, contenido);
      if (data?.success && data.mensaje) {
        setMensajes((prev) => [...prev, data.mensaje]);
        setNuevoMensaje("");
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  const chatsFiltrados = chats.filter((chat) => {
    if (!busqueda.trim()) return true;
    const texto = busqueda.toLowerCase();
    const otros = (chat.participantes || []).filter(
      (p) => p._id !== usuarioActualId
    );
    const nombreOtro =
      otros[0] && (otros[0].nombre || "") + " " + (otros[0].apellido || "");
    return nombreOtro.toLowerCase().includes(texto);
  });

  const chatSeleccionado = chats.find((c) => c._id === selectedChatId) || null;
  const tituloCurso = chatSeleccionado?.id_curso?.nombre || "";

  // Asumimos tutor si rolCodigo === 2 o rol === 'docente'
  const esTutorEnChatSeleccionado = !!(
    chatSeleccionado &&
    usuarioActualId &&
    (usuarioActualRolCodigo === 2 || usuarioActualRol === "docente")
  );

  const obtenerEstudianteIdDeChat = () => {
    if (!chatSeleccionado) return null;
    const participanteEstudiante = (chatSeleccionado.participantes || []).find(
      (p) => String(p._id) !== String(usuarioActualId)
    );
    return participanteEstudiante ? participanteEstudiante._id : null;
  };

  const manejarAbrirModalReserva = () => {
    setMostrarModalReserva(true);
  };

  const manejarCerrarModalReserva = () => {
    setMostrarModalReserva(false);
  };

  const manejarAceptarReserva = async (fechaHoraReserva) => {
    if (!chatSeleccionado) return;

    const cursoId = chatSeleccionado.id_curso?._id;
    const estudianteId = obtenerEstudianteIdDeChat();

    if (!cursoId || !estudianteId || !fechaHoraReserva) {
      window.alert("Debes completar la fecha y hora para aceptar la reserva.");
      return;
    }

    try {
      const inicioISO = new Date(fechaHoraReserva).toISOString();
      const { data } = await reservasAPI.aceptarReserva({
        cursoId,
        estudianteId,
        inicio: inicioISO,
      });

      if (data?.success) {
        window.alert("Reserva aceptada y horario creado correctamente.");
        setMostrarModalReserva(false);
      } else {
        window.alert("No se pudo aceptar la reserva. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error aceptando reserva:", error);
      window.alert("Ocurrió un error al aceptar la reserva.");
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Lista de chats */}
        <div className="chat-list">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Nombre a buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setBusqueda("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="chat-items">
            {chatsFiltrados.map((chat) => {
              const otros = (chat.participantes || []).filter(
                (p) => p._id !== usuarioActual._id
              );
              const otro = otros[0];
              const nombreOtro = otro
                ? `${otro.nombre || ""} ${otro.apellido || ""}`.trim()
                : "Contacto";

              return (
                <div
                  key={chat._id}
                  className={
                    "chat-item" +
                    (selectedChatId === chat._id ? " chat-item-active" : "")
                  }
                  onClick={() => manejarSeleccionChat(chat._id)}
                >
                  <div className="chat-avatar">
                    <span>{nombreOtro.charAt(0) || "?"}</span>
                  </div>
                  <div className="chat-info">
                    <div className="chat-name">
                      {chat.id_curso?.nombre || nombreOtro}
                    </div>
                    <div className="chat-last-message">
                      {chat.ultimoMensaje || nombreOtro}
                    </div>
                    {chat.id_curso?.nombre && (
                      <div className="chat-course">Curso</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mensajes */}
        <div className="chat-messages">
          {chatSeleccionado && (
            <div className="chat-messages-header">
              <div className="chat-messages-header-main">
                <h2 className="chat-messages-title">
                  {tituloCurso || "Chat del curso"}
                </h2>
                {esTutorEnChatSeleccionado && (
                  <button
                    type="button"
                    className="chat-accept-btn"
                    onClick={manejarAbrirModalReserva}
                  >
                    Aceptar reserva
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="messages-container">
            {mensajes.map((m) => {
              const remitenteId = m.remitente?._id || m.remitente;
              const esPropio = remitenteId && usuarioActualId && String(remitenteId) === String(usuarioActualId);
              const horaTexto = m.creado
                ? new Date(m.creado).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "";

              return (
                <div
                  key={m._id}
                  className={
                    "message" + (esPropio ? " own-message" : "")
                  }
                >
                  <div className="message-bubble">
                    <div>{m.contenido}</div>
                    {horaTexto && (
                      <div className="message-time">{horaTexto}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedChatId && (
            <div className="message-input">
              <input
                type="text"
                placeholder="Escribe un mensaje"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") manejarEnviarMensaje();
                }}
              />
              <button
                type="button"
                className="send-btn"
                onClick={manejarEnviarMensaje}
              >
                ➤
              </button>
            </div>
          )}

          {mostrarModalReserva && (
            <ReservarHorario
              onClose={manejarCerrarModalReserva}
              onConfirm={manejarAceptarReserva}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
