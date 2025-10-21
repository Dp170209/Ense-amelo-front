// models/Curso.js
const mongoose = require('mongoose');

const urlValidator = [
  function (v) {
    // permite http(s) absoluto o rutas relativas tipo /static/cursos/...
    return typeof v === 'string' ? /^(https?:\/\/|\/)/.test(v) : true;
  },
  'URL de imagen inválida'
];

const cursoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    maxlength: 50
  },
  descripcion: {
    type: String,
    required: true,
    maxlength: 250
  },
  modalidad: {
    type: String,
    required: true,
    enum: ['presencial', 'virtual', 'hibrida'],
    default: 'virtual'
  },

  // ↓↓↓ NUEVO: portada principal
  portada_url: {
    type: String,
    default: '',
    validate: urlValidator
  },

  // ↓↓↓ NUEVO: galería opcional
  galeria_urls: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) ? arr.every(u => /^(https?:\/\/|\/)/.test(u)) : true;
      },
      message: 'Alguna URL de galería es inválida'
    }
  },

  // (Deprecated) mantenido para compatibilidad con código viejo
  fotos: {
    type: [String],
    default: []
  },

  creado: {
    type: Date,
    default: Date.now
  },
  actualizado: {
    type: Date,
    default: Date.now
  },
  necesita_reserva: {
    type: Boolean,
    default: true
  },
  precio_reserva: {
    type: Number,
    required: true,
    min: 0
  },
  id_tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PerfilTutor',
    required: true
  },
  categorias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria'
  }],
  tags: [{
    type: String,
    maxlength: 20
  }],
  activo: {
    type: Boolean,
    default: true
  }
});

// Actualiza 'actualizado' en saves
cursoSchema.pre('save', function (next) {
  this.actualizado = Date.now();
  next();
});

// Actualiza 'actualizado' en updates tipo findOneAndUpdate / findByIdAndUpdate
cursoSchema.pre(['findOneAndUpdate', 'findByIdAndUpdate'], function (next) {
  this.set({ actualizado: Date.now() });
  next();
});

module.exports = mongoose.model('Curso', cursoSchema);
