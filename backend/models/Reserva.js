const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  id_curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true
  },
  id_horario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Horario',
    required: false
  },
  pago: {
    type: Boolean,
    default: false
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
    default: 'pendiente'
  },
  fecha: {
    type: Date,
    required: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  monto: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Reserva', reservaSchema);
