const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const Verificar = require('../models/Verificar');
const PerfilTutor = require('../models/PerfilTutor');
const Usuario = require('../models/Usuario');
const Curso = require('../models/Curso');
const { authenticateToken } = require('./auth');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'verificaciones');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isImage = /image\/(jpeg|png|webp|jpg)/.test(file.mimetype);
    const isPdf = file.mimetype === 'application/pdf';
    if (!isImage && !isPdf) {
      return cb(new Error('Formato no permitido (solo imágenes o PDF)'));
    }
    cb(null, true);
  },
});

const requireAdmin = async (req, res, next) => {
  try {
    const user = await Usuario.findById(req.user.userId);
    if (!user || user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden realizar esta acción',
      });
    }
    next();
  } catch (error) {
    console.error('Error verificando rol admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

router.post(
  '/solicitud',
  authenticateToken,
  upload.fields([
    { name: 'foto_ci', maxCount: 1 },
    { name: 'archivos', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const user = await Usuario.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      if (user.rol !== 'docente') {
        return res.status(403).json({
          success: false,
          message: 'Solo los tutores pueden enviar solicitudes de verificación',
        });
      }

      const comentario = req.body.comentario || '';
      const cursoId = req.body.cursoId || req.body.id_curso || null;

      const existingFilter = {
        id_usuario: user._id,
        estado: 'pendiente',
      };
      if (cursoId) {
        existingFilter.id_curso = cursoId;
      }

      const existing = await Verificar.findOne(existingFilter);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Ya tienes una solicitud de verificación pendiente',
        });
      }

      const foto_ci_file = (req.files?.foto_ci || [])[0];
      const archivos_files = req.files?.archivos || [];

      const foto_ci = foto_ci_file ? foto_ci_file.filename : '';
      const archivos = archivos_files.map((f) => f.filename);

      const perfilTutor = await PerfilTutor.findOne({ id_usuario: user._id });

      let cursoAsociado = null;
      if (cursoId) {
        cursoAsociado = await Curso.findById(cursoId).populate('id_tutor');
        if (!cursoAsociado) {
          return res.status(400).json({
            success: false,
            message: 'El curso indicado no existe',
          });
        }

        if (
          !cursoAsociado.id_tutor ||
          String(cursoAsociado.id_tutor.id_usuario) !== String(user._id)
        ) {
          return res.status(403).json({
            success: false,
            message: 'Solo el tutor propietario puede verificar este curso',
          });
        }
      }

      const solicitud = new Verificar({
        id_usuario: user._id,
        id_perfil_tutor: perfilTutor ? perfilTutor._id : undefined,
        id_curso: cursoAsociado ? cursoAsociado._id : undefined,
        estado: 'pendiente',
        comentario,
        foto_ci,
        archivos,
      });

      await solicitud.save();

      // Marcar el curso como pendiente de verificación (si aplica)
      if (cursoAsociado) {
        cursoAsociado.verificacion_estado = 'pendiente';
        await cursoAsociado.save();
      }

      res.status(201).json({
        success: true,
        message: 'Solicitud de verificación creada correctamente',
        solicitud,
      });
    } catch (error) {
      console.error('Error creando solicitud de verificación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }
);

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { estado } = req.query;

    const filter = {};
    if (estado && ['pendiente', 'aceptado', 'rechazado'].includes(estado)) {
      filter.estado = estado;
    }

    const solicitudes = await Verificar.find(filter)
      .populate('id_usuario', 'nombre apellido email telefono')
      .populate('id_perfil_tutor')
      .populate({
        path: 'id_curso',
        select:
          'nombre descripcion modalidad necesita_reserva precio_reserva creado actualizado categorias portada_url galeria_urls',
        populate: {
          path: 'categorias',
          select: 'nombre',
        },
      });

    res.json({
      success: true,
      solicitudes,
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes de verificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

router.patch(
  '/:id/estado',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { estado, comentario } = req.body;

      if (!['pendiente', 'aceptado', 'rechazado'].includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado inválido',
        });
      }

      const solicitud = await Verificar.findById(id);
      if (!solicitud) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada',
        });
      }

      solicitud.estado = estado;
      if (comentario !== undefined) {
        solicitud.comentario = comentario;
      }
      solicitud.decidido = ['aceptado', 'rechazado'].includes(estado)
        ? new Date()
        : undefined;

      await solicitud.save();

      // Actualizar estado de verificación del curso asociado (si existe)
      if (solicitud.id_curso) {
        const curso = await Curso.findById(solicitud.id_curso);
        if (curso) {
          if (estado === 'aceptado') {
            curso.verificacion_estado = 'aceptado';
          } else if (estado === 'rechazado') {
            curso.verificacion_estado = 'rechazado';
          } else {
            curso.verificacion_estado = 'pendiente';
          }
          await curso.save();
        }
      }

      if (solicitud.id_perfil_tutor) {
        const perfil = await PerfilTutor.findById(solicitud.id_perfil_tutor);
        if (perfil) {
          perfil.verificado =
            estado === 'aceptado'
              ? 'verificado'
              : estado === 'rechazado'
              ? 'rechazado'
              : 'pendiente';
          await perfil.save();
        }
      }

      res.json({
        success: true,
        message: 'Estado de la solicitud actualizado',
        solicitud,
      });
    } catch (error) {
      console.error('Error actualizando estado de verificación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }
);

module.exports = router;
