const mongoose = require('mongoose');

const MensajeSchema = new mongoose.Schema(
  {
    id_chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    remitente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'creado', updatedAt: 'actualizado' },
  }
);

module.exports = mongoose.model('Mensaje', MensajeSchema);
