const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 50
  },
  apellido: {
    type: String,
    required: true,
    maxlength: 50
  },
  telefono: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
    lowercase: true
  },
  contrasenia: {
    type: String,
    required: true,
    maxlength: 50
  },
  rol: {
    type: String,
    required: true,
    enum: ['estudiante', 'docente', 'admin'],
    default: 'estudiante'
  },
  foto: {
    type: String,
    default: '',
    maxlength: 100
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
});

// Hash de contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('contrasenia')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.contrasenia = await bcrypt.hash(this.contrasenia, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.contrasenia);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
