import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatsAPI } from "../../api/chats";
import "../../styles/chat.css";

const ChatPage = () => {
  const navigate = useNavigate();
  const { id: routeChatId } = useParams();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(routeChatId || null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const usuarioActual = JSON.parse(localStorage.getItem("user") || "{}");
  const usuarioActualId = usuarioActual._id || usuarioActual.id;

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
                    <div className="chat-name">{nombreOtro}</div>
                    <div className="chat-last-message">
                      {chat.ultimoMensaje || "Sin mensajes"}
                    </div>
                    {chat.id_curso?.nombre && (
                      <div className="chat-course">{chat.id_curso.nombre}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mensajes */}
        <div className="chat-messages">
          <div className="messages-container">
            {mensajes.map((m) => {
              const esPropio = m.remitente?._id === usuarioActual._id;
              return (
                <div
                  key={m._id}
                  className={
                    "message" + (esPropio ? " own-message" : "")
                  }
                >
                  <div className="message-bubble">{m.contenido}</div>
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
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
