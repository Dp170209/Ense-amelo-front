const express = require('express');
const Reserva = require('../models/Reserva');
const Curso = require('../models/Curso');
const Horario = require('../models/Horario');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Crear reserva pendiente para un curso
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { id_curso } = req.body;

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

    // Crear reserva en estado pendiente, sin horario ni pago definidos aún
    const reserva = new Reserva({
      id_usuario: req.user.userId,
      id_curso,
      pago: false,
      estado: 'pendiente',
      monto: curso.precio_reserva || 0,
    });

    await reserva.save();

    res.status(201).json({
      success: true,
      message: 'Reserva creada correctamente',
      reserva,
    });
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
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

// Aceptar una reserva pendiente: crear horario y confirmar reserva
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

    const inicioFecha = new Date(inicio);
    if (Number.isNaN(inicioFecha.getTime())) {
      return res.status(400).json({ success: false, message: 'Fecha/hora de inicio inválida' });
    }

    const finFecha = new Date(inicioFecha.getTime() + 60 * 60 * 1000); // +1 hora por defecto

    const horario = await Horario.create({
      id_curso,
      inicio: inicioFecha,
      fin: finFecha,
    });

    reserva.id_horario = horario._id;
    reserva.fecha = inicioFecha;
    reserva.estado = 'confirmada';
    await reserva.save();

    res.status(200).json({
      success: true,
      message: 'Reserva aceptada y horario creado',
      reserva,
      horario,
    });
  } catch (error) {
    console.error('Error aceptando reserva:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;
