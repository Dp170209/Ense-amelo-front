const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Usuario = require('../models/Usuario');
const config = require('../config');

const router = express.Router();

// Configuración de almacenamiento para documentos de tutor
const tutorDocsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'tutor-docs');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '';
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const tutorDocsUpload = multer({
  storage: tutorDocsStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se permiten archivos PDF'));
    }
    cb(null, true);
  }
});

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido'
      });
    }
    req.user = user;
    next();
  });
};

// Subir documentos de tutor (PDF)
router.post('/tutor/documentos', authenticateToken, tutorDocsUpload.array('documentos', 5), async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const archivos = (req.files || []).map((file) => file.filename);

    if (!archivos.length) {
      return res.status(400).json({
        success: false,
        message: 'No se recibieron archivos para subir'
      });
    }

    user.documentos = [...(user.documentos || []), ...archivos];
    await user.save();

    res.json({
      success: true,
      message: 'Documentos subidos correctamente',
      documentos: user.documentos
    });
  } catch (error) {
    console.error('Error subiendo documentos de tutor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al subir documentos'
    });
  }
});

// Middleware para generar token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' });
};

// Registro de usuario
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { email, password, rol, rolCodigo, nombre, apellido, telefono } = req.body;

    // Determinar rol numérico y textual
    let codigo = Number(rolCodigo) || 1;
    if (![1, 2, 3].includes(codigo)) {
      codigo = 1;
    }

    let rolTexto = 'estudiante';
    if (codigo === 2) rolTexto = 'docente';
    if (codigo === 3) rolTexto = 'admin';

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const newUser = new Usuario({
      email,
      contrasenia: password,
      rolCodigo: codigo,
      rol: rolTexto,
      nombre: nombre || 'Usuario',
      apellido: apellido || '',
      telefono: telefono || 0
    });

    await newUser.save();

    // Generar token
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        rol: newUser.rol,
        rolCodigo: newUser.rolCodigo,
        nombre: newUser.nombre,
        apellido: newUser.apellido
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Login de usuario
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuario
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }

    // Generar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        email: user.email,
        rol: user.rol,
        rolCodigo: user.rolCodigo,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        foto: user.foto
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar perfil del usuario actual
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, foto, descripcion, newPassword } = req.body;

    const user = await Usuario.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (nombre !== undefined) user.nombre = nombre;
    if (apellido !== undefined) user.apellido = apellido;
    if (telefono !== undefined) user.telefono = telefono;
    if (email !== undefined) user.email = email;
    if (foto !== undefined) user.foto = foto;
    if (descripcion !== undefined) user.descripcion = descripcion;

    if (newPassword && newPassword.length >= 6) {
      user.contrasenia = newPassword;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user: {
        id: user._id,
        email: user.email,
        rol: user.rol,
        rolCodigo: user.rolCodigo,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        foto: user.foto
      }
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener perfil del usuario actual
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = { router, authenticateToken };
