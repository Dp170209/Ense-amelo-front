const express = require('express');
const Curso = require('../models/Curso');
const Categoria = require('../models/Categoria');
const PerfilTutor = require('../models/PerfilTutor');
const Usuario = require('../models/Usuario');
const Suscripcion = require('../models/Suscripcion');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Obtener todos los cursos con filtros y paginación
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    
    const categoria = req.query.categoria;
    const search = req.query.search;
    
    // Construir filtros
    let filters = { activo: true };
    
    if (categoria && categoria !== 'todas') {
      // Buscar cursos por nombre de categoría
      const categoriaDoc = await Categoria.findOne({ nombre: categoria });
      if (categoriaDoc) {
        filters.categorias = categoriaDoc._id;
      }
    }
    
    if (search) {
      filters.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } }
      ];
    }

    // Obtener cursos con información del tutor
    const cursos = await Curso.find(filters)
      .populate('id_tutor', 'id_usuario clasificacion verificado')
      .populate('categorias', 'nombre')
      .populate({
        path: 'id_tutor',
        populate: {
          path: 'id_usuario',
          select: 'nombre apellido'
        }
      })
      .sort({ creado: -1 })
      .skip(skip)
      .limit(limit);

    // Contar total de cursos
    const totalCursos = await Curso.countDocuments(filters);
    const totalPages = Math.ceil(totalCursos / limit);

    const cursosConCupos = cursos.map(curso => {
      const cursoObj = curso.toObject({ virtuals: true });
      return {
        ...cursoObj,
        cupos_disponibles: curso.tiene_cupo_limitado 
          ? Math.max(0, curso.cupo_maximo - curso.cupo_ocupado)
          : null,
        tiene_disponibilidad: curso.tieneDisponibilidad()
      };
    });

    res.json({
      success: true,
      cursos,
      pagination: {
        currentPage: page,
        totalPages,
        totalCursos,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error obteniendo cursos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener cursos del tutor autenticado
router.get('/mis', authenticateToken, async (req, res) => {
  try {
    // Traer cursos activos con su perfil de tutor y usuario
    const cursosDb = await Curso.find({ activo: true })
      .populate({
        path: 'id_tutor',
        populate: {
          path: 'id_usuario',
          select: '_id',
        },
      })
      .populate('categorias', 'nombre')
      .sort({ creado: -1 });

    // Filtrar solo los que pertenecen al usuario autenticado
    const cursos = cursosDb.filter(
      (c) =>
        c.id_tutor &&
        c.id_tutor.id_usuario &&
        String(c.id_tutor.id_usuario._id) === String(req.user.userId)
    );

    res.json({
      success: true,
      cursos,
    });
  } catch (error) {
    console.error('Error obteniendo cursos del tutor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
});

// Obtener un curso específico por ID
router.get('/:id', async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id)
      .populate('id_tutor', 'id_usuario clasificacion visa')
      .populate('categorias', 'nombre')
      .populate({
        path: 'id_tutor',
        populate: {
          path: 'id_usuario',
          select: 'nombre apellido foto'
        }
      });

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    const cursoObj = curso.toObject({ virtuals: true });
    
    res.json({
      success: true,
      curso: {
        ...cursoObj,
        cupos_disponibles: curso.tiene_cupo_limitado 
          ? Math.max(0, curso.cupo_maximo - curso.cupo_ocupado)
          : null,
        tiene_disponibilidad: curso.tieneDisponibilidad()
      }
    });

  } catch (error) {
    console.error('Error obteniendo curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear nuevo curso (solo para tutores)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Verificar que el usuario sea tutor
    const usuario = await Usuario.findById(req.user.userId);
    if (usuario.rol !== 'docente') {
      return res.status(403).json({
        success: false,
        message: 'Solo los tutores pueden crear cursos'
      });
    }

    // Buscar perfil de tutor, si no existe lo creamos automáticamente
    let perfilTutor = await PerfilTutor.findOne({ id_usuario: req.user.userId });
    if (!perfilTutor) {
      const autoCi = `AUTO-${String(req.user.userId).slice(-6)}`;

      perfilTutor = new PerfilTutor({
        id_usuario: req.user.userId,
        ci: autoCi,
        biografia: ''
      });

      await perfilTutor.save();
    }

    // Verificar cuántos cursos activos tiene este tutor
    const cursosTutorActivos = await Curso.countDocuments({
      id_tutor: perfilTutor._id,
      activo: true,
    });

    // Si tiene 3 o más cursos, verificar suscripción
    if (cursosTutorActivos >= 3) {
      // Verificar si el usuario tiene una suscripción vigente (activa o cancelada pero no expirada)
      const ahora = new Date();
      const suscripcionVigente = await Suscripcion.findOne({
        id_usuario: req.user.userId,
        fin: { $gte: ahora },
        estado: { $in: ['activa', 'cancelada'] }, // Incluir canceladas pero vigentes
      }).populate('id_plan');

      if (!suscripcionVigente) {
        return res.status(403).json({
          message: "Has alcanzado el límite de 3 cursos gratuitos. Para crear más cursos, adquiere un plan.",
        });
      }

      // Usar el límite de cursos del plan
      const limiteCursos = suscripcionVigente.id_plan.cantidadCursos;
      if (cursosTutorActivos >= limiteCursos) {
        const estadoMensaje = suscripcionVigente.estado === 'cancelada' 
          ? `Has alcanzado el límite de ${limiteCursos} cursos según tu plan "${suscripcionVigente.id_plan.nombre}". Tu suscripción está cancelada pero vigente hasta el ${new Date(suscripcionVigente.fin).toLocaleDateString()}.`
          : `Has alcanzado el límite de ${limiteCursos} cursos según tu plan "${suscripcionVigente.id_plan.nombre}".`;
        
        return res.status(403).json({ message: estadoMensaje });
      }
    }

    const cursoData = {
      ...req.body,
      id_tutor: perfilTutor._id
    };

    const curso = new Curso(cursoData);
    await curso.save();

    await curso.populate('id_tutor categorias');

    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      curso
    });

  } catch (error) {
    console.error('Error creando curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar curso (solo el tutor propietario)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id).populate('id_tutor');
    
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar que el usuario sea el tutor propietario
    if (curso.id_tutor.id_usuario.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para modificar este curso'
      });
    }

    const updatedCurso = await Curso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('id_tutor categorias');

    res.json({
      success: true,
      message: 'Curso actualizado exitosamente',
      curso: updatedCurso
    });

  } catch (error) {
    console.error('Error actualizando curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar curso (solo el tutor propietario)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id).populate('id_tutor');
    
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar que el usuario sea el tutor propietario
    if (curso.id_tutor.id_usuario.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para eliminar este curso'
      });
    }

    // Soft delete - marcar como inactivo
    curso.activo = false;
    await curso.save();

    res.json({
      success: true,
      message: 'Curso eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
