// backend/routes/reservas.js
const express = require('express');
const Reserva = require('../models/Reserva');
const Curso = require('../models/Curso');
const Horario = require('../models/Horario');
const { authenticateToken } = require('./auth');

const router = express.Router();

// ⭐ MODIFICADO: Crear reserva SIN ocupar cupo (se ocupa al aceptar)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { id_curso } = req.body;
    const userId = req.user.userId;

    if (!id_curso) {
      return res.status(400).json({
        success: false,
        message: 'id_curso es requerido',
      });
    }

    const curso = await Curso.findById(id_curso);
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado',
      });
    }

    // Verificar si el usuario ya tiene una reserva activa para este curso
    const reservaExistente = await Reserva.findOne({
      id_usuario: userId,
      id_curso,
      estado: { $in: ['pendiente', 'confirmada', 'completada'] }
    });

    if (reservaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes una reserva activa para este curso',
        reserva: reservaExistente
      });
    }

    // ⭐ CAMBIO: NO verificar disponibilidad aquí, solo crear la reserva pendiente
    // El cupo se ocupará cuando el tutor acepte la reserva

    // Crear reserva en estado pendiente
    const reserva = new Reserva({
      id_usuario: userId,
      id_curso,
      pago: false,
      estado: 'pendiente',
      monto: curso.precio_reserva || 0,
    });

    await reserva.save();

    // ⭐ NO ocupar cupo aquí

    res.status(201).json({
      success: true,
      message: 'Reserva creada correctamente',
      reserva,
      cupos_disponibles: curso.tiene_cupo_limitado 
        ? Math.max(0, curso.cupo_maximo - curso.cupo_ocupado)
        : null
    });
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

// Marcar reservas del estudiante como completadas para un curso
router.post('/completar', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id_curso } = req.body;

    if (!id_curso) {
      return res.status(400).json({ success: false, message: 'id_curso es requerido' });
    }

    const reserva = await Reserva.findOne({
      id_usuario: userId,
      id_curso,
      estado: { $ne: 'cancelada' },
    });

    if (!reserva) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada para este curso' });
    }

    reserva.estado = 'completada';
    await reserva.save();

    res.json({ success: true, reserva });
  } catch (error) {
    console.error('Error marcando reserva como completada:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// ⭐ MODIFICADO: Rechazar una reserva (no liberar cupo porque nunca se ocupó)
router.post('/rechazar', authenticateToken, async (req, res) => {
  try {
    const { id_curso, id_estudiante } = req.body;

    if (!id_curso || !id_estudiante) {
      return res.status(400).json({
        success: false,
        message: 'id_curso e id_estudiante son requeridos',
      });
    }

    const curso = await Curso.findById(id_curso).populate({
      path: 'id_tutor',
      populate: { path: 'id_usuario', select: '_id' },
    });

    if (!curso || !curso.id_tutor || !curso.id_tutor.id_usuario) {
      return res
        .status(404)
        .json({ success: false, message: 'Curso o tutor no encontrado' });
    }

    const tutorUserId = curso.id_tutor.id_usuario._id.toString();
    if (String(tutorUserId) !== String(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para rechazar esta reserva',
      });
    }

    const reserva = await Reserva.findOne({
      id_curso,
      id_usuario: id_estudiante,
      estado: 'pendiente',
    });

    if (!reserva) {
      return res
        .status(404)
        .json({ success: false, message: 'Reserva pendiente no encontrada' });
    }

    reserva.estado = 'rechazada';
    await reserva.save();

    // ⭐ NO liberar cupo porque nunca se ocupó

    res.json({ 
      success: true, 
      reserva,
      cupos_disponibles: curso.tiene_cupo_limitado 
        ? Math.max(0, curso.cupo_maximo - curso.cupo_ocupado)
        : null
    });
  } catch (error) {
    console.error('Error rechazando reserva:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor' });
  }
});

// ⭐ MODIFICADO: Cancelar reserva y liberar cupo SOLO si estaba confirmada
router.post('/cancelar', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id_reserva } = req.body;

    if (!id_reserva) {
      return res.status(400).json({
        success: false,
        message: 'id_reserva es requerido',
      });
    }

    const reserva = await Reserva.findById(id_reserva).populate('id_curso');

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada',
      });
    }

    // Verificar que la reserva pertenezca al usuario
    if (String(reserva.id_usuario) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para cancelar esta reserva',
      });
    }

    // Solo se pueden cancelar reservas pendientes o confirmadas
    if (!['pendiente', 'confirmada'].includes(reserva.estado)) {
      return res.status(400).json({
        success: false,
        message: 'Esta reserva no puede ser cancelada',
      });
    }

    const estabaConfirmada = reserva.estado === 'confirmada';
    reserva.estado = 'cancelada';
    await reserva.save();

    // ⭐ CAMBIO: Solo liberar cupo si la reserva estaba confirmada
    if (estabaConfirmada && reserva.id_curso) {
      const curso = await Curso.findById(reserva.id_curso._id || reserva.id_curso);
      if (curso) {
        await curso.liberarCupo();
      }
    }

    res.json({
      success: true,
      message: 'Reserva cancelada correctamente',
      reserva,
    });
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

// Obtener reservas del estudiante autenticado
router.get('/mis', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const reservas = await Reserva.find({ id_usuario: userId })
      .populate({ path: 'id_curso', select: 'nombre descripcion categorias portada_url cupo_maximo cupo_ocupado tiene_cupo_limitado' })
      .populate({ path: 'id_horario', select: 'inicio fin' });

    res.json({ success: true, reservas });
  } catch (error) {
    console.error('Error obteniendo reservas del estudiante:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Obtener la reserva asociada a un chat (curso + estudiante)
router.get('/estado-chat', authenticateToken, async (req, res) => {
  try {
    const { id_curso, id_estudiante } = req.query;

    if (!id_curso || !id_estudiante) {
      return res.status(400).json({
        success: false,
        message: 'id_curso e id_estudiante son requeridos',
      });
    }

    const reserva = await Reserva.findOne({
      id_curso,
      id_usuario: id_estudiante,
    })
      .populate({ path: 'id_curso', select: 'nombre' })
      .populate({ path: 'id_usuario', select: '_id nombre apellido' });

    res.json({ success: true, reserva: reserva || null });
  } catch (error) {
    console.error('Error obteniendo estado de reserva para chat:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Obtener reservas confirmadas de los cursos de un tutor
router.get('/tutor/confirmadas', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const cursos = await Curso.find({})
      .populate({ path: 'id_tutor', populate: { path: 'id_usuario', select: '_id' } });

    const cursosTutor = cursos.filter(
      (c) => c.id_tutor && c.id_tutor.id_usuario && String(c.id_tutor.id_usuario._id) === String(userId)
    );

    const idsCursosTutor = cursosTutor.map((c) => c._id);

    const reservas = await Reserva.find({
      id_curso: { $in: idsCursosTutor },
      estado: 'confirmada',
    })
      .populate({ path: 'id_curso', select: 'nombre' })
      .populate({ path: 'id_usuario', select: '_id nombre apellido' });

    res.json({ success: true, reservas });
  } catch (error) {
    console.error('Error obteniendo reservas confirmadas del tutor:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// ⭐ MODIFICADO: Aceptar reserva - AQUÍ se ocupa el cupo
router.post('/aceptar', authenticateToken, async (req, res) => {
  try {
    const { id_curso, id_estudiante, inicio } = req.body;

    if (!id_curso || !id_estudiante || !inicio) {
      return res.status(400).json({
        success: false,
        message: 'id_curso, id_estudiante e inicio son requeridos',
      });
    }

    const curso = await Curso.findById(id_curso).populate({
      path: 'id_tutor',
      populate: { path: 'id_usuario', select: '_id' },
    });

    if (!curso || !curso.id_tutor || !curso.id_tutor.id_usuario) {
      return res.status(404).json({ success: false, message: 'Curso o tutor no encontrado' });
    }

    const tutorUserId = curso.id_tutor.id_usuario._id.toString();
    if (String(tutorUserId) !== String(req.user.userId)) {
      return res.status(403).json({ success: false, message: 'No autorizado para aceptar esta reserva' });
    }

    const reserva = await Reserva.findOne({
      id_curso,
      id_usuario: id_estudiante,
      estado: 'pendiente',
    });

    if (!reserva) {
      return res.status(404).json({ success: false, message: 'Reserva pendiente no encontrada' });
    }

    // ⭐ NUEVO: Verificar disponibilidad AHORA (antes de confirmar)
    if (!curso.tieneDisponibilidad()) {
      return res.status(400).json({
        success: false,
        message: 'No hay cupos disponibles para este curso',
        cupos_disponibles: 0
      });
    }

    const inicioFecha = new Date(inicio);
    if (Number.isNaN(inicioFecha.getTime())) {
      return res.status(400).json({ success: false, message: 'Fecha/hora de inicio inválida' });
    }

    const finFecha = new Date(inicioFecha.getTime() + 60 * 60 * 1000); // +1 hora

    const horario = await Horario.create({
      id_curso,
      inicio: inicioFecha,
      fin: finFecha,
    });

    reserva.id_horario = horario._id;
    reserva.fecha = inicioFecha;
    reserva.estado = 'confirmada';
    await reserva.save();

    // ⭐ NUEVO: OCUPAR el cupo AHORA
    try {
      await curso.ocuparCupo();
    } catch (error) {
      // Si falla, revertir la confirmación
      await Horario.findByIdAndDelete(horario._id);
      reserva.estado = 'pendiente';
      reserva.id_horario = null;
      reserva.fecha = null;
      await reserva.save();
      
      return res.status(400).json({
        success: false,
        message: error.message || 'Error al ocupar el cupo',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reserva aceptada y horario creado',
      reserva,
      horario,
      cupos_disponibles: curso.tiene_cupo_limitado 
        ? Math.max(0, curso.cupo_maximo - curso.cupo_ocupado)
        : null
    });
  } catch (error) {
    console.error('Error aceptando reserva:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Endpoint para verificar disponibilidad de un curso
router.get('/disponibilidad/:id_curso', async (req, res) => {
  try {
    const { id_curso } = req.params;
    const userId = req.query.id_usuario;

    const curso = await Curso.findById(id_curso);
    
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado',
      });
    }

    let reservaUsuario = null;
    if (userId) {
      reservaUsuario = await Reserva.findOne({
        id_usuario: userId,
        id_curso,
        estado: { $in: ['pendiente', 'confirmada', 'completada'] }
      });
    }

    res.json({
      success: true,
      tiene_cupo_limitado: curso.tiene_cupo_limitado,
      cupo_maximo: curso.cupo_maximo,
      cupo_ocupado: curso.cupo_ocupado,
      cupos_disponibles: curso.tiene_cupo_limitado 
        ? Math.max(0, curso.cupo_maximo - curso.cupo_ocupado)
        : null,
      tiene_disponibilidad: curso.tieneDisponibilidad(),
      usuario_tiene_reserva: !!reservaUsuario,
      reserva_usuario: reservaUsuario
    });
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

module.exports = router;