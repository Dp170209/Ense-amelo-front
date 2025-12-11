const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  duracionDias: { type: Number, required: true },
  cantidadCursos: { type: Number, required: true, default: 1 }, // Nuevo campo
  stripeProductId: { type: String, default: null }, // ID del producto en Stripe
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
