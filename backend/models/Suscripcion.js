const mongoose = require('mongoose');

const suscripcionSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  id_plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  inicio: {
    type: Date,
    required: true,
  },
  fin: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    enum: ['activa', 'expirada', 'cancelada'],
    default: 'activa',
  },
  fechaCancelacion: {
    type: Date,
    default: null,
  },
  stripeSubscriptionId: {
    type: String,
    default: null,
  },
  stripeCustomerId: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Suscripcion', suscripcionSchema);
