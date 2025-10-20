const express = require('express');
const Curso = require('../models/Curso');
const Categoria = require('../models/Categoria');
const PerfilTutor = require('../models/PerfilTutor');
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
      .populate('id_tutor', 'id_usuario clasificacion')
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

    res.json({
      success: true,
      curso
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

    // Buscar perfil de tutor
    const perfilTutor = await PerfilTutor.findOne({ id_usuario: req.user.userId });
    if (!perfilTutor) {
      return res.status(400).json({
        success: false,
        message: 'Debe tener un perfil de tutor para crear cursos'
      });
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
