const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  id_suscripcion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Suscripcion',
    required: true,
  },
  monto: {
    type: Number,
    required: true,
    min: 0,
  },
  metodo: {
    type: String,
    enum: ['stripe'],
    default: 'stripe',
  },
  estado: {
    type: String,
    enum: ['pendiente', 'exitoso', 'fallido', 'cancelado'],
    default: 'pendiente',
  },
  stripeSessionId: {
    type: String,
  },
  stripePaymentIntentId: {
    type: String,
  },
  fechaCancelacion: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Pago', pagoSchema);
