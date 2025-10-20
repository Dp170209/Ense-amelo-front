const mongoose = require('mongoose');

const perfilTutorSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true
  },
  ci: {
    type: String,
    required: true,
    maxlength: 20
  },
  verificado: {
    type: String,
    enum: ['pendiente', 'verificado', 'rechazado'],
    default: 'pendiente'
  },
  clasificacion: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  biografia: {
    type: String,
    maxlength: 250,
    default: ''
  },
  creacion: {
    type: Date,
    default: Date.now
  },
  actualizado: {
    type: Date,
    default: Date.now
  }
});

perfilTutorSchema.pre('save', function(next) {
  this.actualizado = Date.now();
  next();
});

module.exports = mongoose.model('PerfilTutor', perfilTutorSchema);
