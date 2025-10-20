const mongoose = require('mongoose');

const comentarioCursoSchema = new mongoose.Schema({
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
  comentario: {
    type: String,
    required: true,
    maxlength: 250
  },
  clasificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('ComentarioCurso', comentarioCursoSchema);
