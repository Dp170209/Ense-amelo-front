const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  id_curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true
  },
  inicio: {
    type: Date,
    required: true
  },
  fin: {
    type: Date,
    required: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Horario', horarioSchema);
