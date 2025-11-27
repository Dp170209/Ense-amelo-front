// backend/models/Curso.js
const mongoose = require('mongoose');

const urlValidator = [
  function (v) {
    return typeof v === 'string' ? /^(https?:\/\/|\/|data:)/.test(v) : true;
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
  
  portada_url: {
    type: String,
    default: '',
    validate: urlValidator
  },
  
  galeria_urls: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) ? arr.every(u => /^(https?:\/\/|\/|data:)/.test(u)) : true;
      },
      message: 'Alguna URL de galería es inválida'
    }
  },
  
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
  
  // ⭐ NUEVO: Sistema de cupos
  cupo_maximo: {
    type: Number,
    default: 0, // 0 = ilimitado
    min: 0
  },
  cupo_ocupado: {
    type: Number,
    default: 0,
    min: 0
  },
  tiene_cupo_limitado: {
    type: Boolean,
    default: false
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
  verificacion_estado: {
    type: String,
    enum: ['no_solicitado', 'pendiente', 'aceptado', 'rechazado'],
    default: 'no_solicitado',
  },
  activo: {
    type: Boolean,
    default: true
  }
});

// ⭐ NUEVO: Virtual para cupos disponibles
cursoSchema.virtual('cupos_disponibles').get(function() {
  if (!this.tiene_cupo_limitado || this.cupo_maximo === 0) {
    return null; // ilimitado
  }
  return Math.max(0, this.cupo_maximo - this.cupo_ocupado);
});

// ⭐ NUEVO: Método para verificar disponibilidad
cursoSchema.methods.tieneDisponibilidad = function() {
  if (!this.tiene_cupo_limitado || this.cupo_maximo === 0) {
    return true; // sin límite
  }
  return this.cupo_ocupado < this.cupo_maximo;
};

// ⭐ NUEVO: Método para ocupar un cupo
cursoSchema.methods.ocuparCupo = async function() {
  if (!this.tiene_cupo_limitado || this.cupo_maximo === 0) {
    return true; // sin límite, siempre exitoso
  }
  
  if (this.cupo_ocupado >= this.cupo_maximo) {
    throw new Error('No hay cupos disponibles');
  }
  
  this.cupo_ocupado += 1;
  await this.save();
  return true;
};

// ⭐ NUEVO: Método para liberar un cupo
cursoSchema.methods.liberarCupo = async function() {
  if (!this.tiene_cupo_limitado || this.cupo_maximo === 0) {
    return true;
  }
  
  if (this.cupo_ocupado > 0) {
    this.cupo_ocupado -= 1;
    await this.save();
  }
  return true;
};

// Configurar toJSON para incluir virtuals
cursoSchema.set('toJSON', { virtuals: true });
cursoSchema.set('toObject', { virtuals: true });

cursoSchema.pre('save', function (next) {
  this.actualizado = Date.now();
  next();
});

cursoSchema.pre(['findOneAndUpdate', 'findByIdAndUpdate'], function (next) {
  this.set({ actualizado: Date.now() });
  next();
});

module.exports = mongoose.model('Curso', cursoSchema);