const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    participantes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
      },
    ],
    id_curso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curso',
      required: true,
    },
    ultimoMensaje: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'creado', updatedAt: 'actualizado' },
  }
);

module.exports = mongoose.model('Chat', ChatSchema);
