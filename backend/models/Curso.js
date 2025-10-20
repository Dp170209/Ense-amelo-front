const mongoose = require('mongoose');

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
  activo: {
    type: Boolean,
    default: true
  }
});

cursoSchema.pre('save', function(next) {
  this.actualizado = Date.now();
  next();
});

module.exports = mongoose.model('Curso', cursoSchema);
