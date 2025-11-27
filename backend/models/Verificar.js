const mongoose = require('mongoose');

const verificarSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  id_perfil_tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PerfilTutor',
  },
  id_curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aceptado', 'rechazado'],
    default: 'pendiente',
  },
  comentario: {
    type: String,
    default: '',
    maxlength: 500,
  },
  foto_ci: {
    type: String,
    default: '',
    maxlength: 200,
  },
  archivos: {
    type: [String],
    default: [],
  },
  creado: {
    type: Date,
    default: Date.now,
  },
  decidido: {
    type: Date,
  },
});

module.exports = mongoose.model('Verificar', verificarSchema);
