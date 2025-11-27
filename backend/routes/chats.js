const express = require('express');
const Chat = require('../models/Chat');
const Mensaje = require('../models/Mensaje');
const Curso = require('../models/Curso');

const router = express.Router();

// Crear u obtener chat entre estudiante y tutor de un curso
router.post('/', async (req, res) => {
  try {
    const { id_curso, id_estudiante } = req.body;

    if (!id_curso || !id_estudiante) {
      return res.status(400).json({ success: false, message: 'id_curso e id_estudiante son requeridos' });
    }

    const curso = await Curso.findById(id_curso).populate({
      path: 'id_tutor',
      populate: { path: 'id_usuario', select: '_id' },
    });

    if (!curso || !curso.id_tutor || !curso.id_tutor.id_usuario) {
      return res.status(404).json({ success: false, message: 'Curso o tutor no encontrado' });
    }

    const tutorUserId = curso.id_tutor.id_usuario._id.toString();

    // Participantes siempre: estudiante (id_estudiante) y tutor (tutorUserId)
    const participantes = [id_estudiante, tutorUserId];

    let chat = await Chat.findOne({
      id_curso,
      participantes: { $all: participantes, $size: 2 },
    });

    if (!chat) {
      chat = await Chat.create({
        participantes,
        id_curso,
        ultimoMensaje: '',
      });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.error('Error creando/obteniendo chat:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Obtener chats de un usuario por id_usuario
router.get('/', async (req, res) => {
  try {
    const userId = req.query.id_usuario;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'id_usuario es requerido' });
    }
    const chats = await Chat.find({ participantes: userId })
      .populate({ path: 'id_curso', select: 'nombre' })
      .populate({ path: 'participantes', select: 'nombre apellido rol' })
      .sort({ actualizado: -1 });

    res.json({ success: true, chats });
  } catch (error) {
    console.error('Error obteniendo chats:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Obtener mensajes de un chat
router.get('/:id/mensajes', async (req, res) => {
  try {
    const chatId = req.params.id;

    const mensajes = await Mensaje.find({ id_chat: chatId })
      .populate({ path: 'remitente', select: 'nombre apellido' })
      .sort({ creado: 1 });

    res.json({ success: true, mensajes });
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Enviar mensaje en un chat
router.post('/:id/mensajes', async (req, res) => {
  try {
    const chatId = req.params.id;
    const { contenido, id_remitente } = req.body;

    if (!contenido || !contenido.trim() || !id_remitente) {
      return res.status(400).json({ success: false, message: 'contenido e id_remitente son requeridos' });
    }

    const mensaje = await Mensaje.create({
      id_chat: chatId,
      remitente: id_remitente,
      contenido: contenido.trim(),
    });

    await Chat.findByIdAndUpdate(chatId, {
      ultimoMensaje: contenido.trim(),
    });

    const populated = await mensaje.populate({
      path: 'remitente',
      select: 'nombre apellido',
    });

    res.status(201).json({ success: true, mensaje: populated });
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;
