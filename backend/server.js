// server.js (o el archivo que pegaste)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');                 // <--- NUEVO
const config = require('./config');

// Importar rutas
const authRoutes = require('./routes/auth');
const cursoRoutes = require('./routes/cursos');
const categoriaRoutes = require('./routes/categorias');
const uploadsRoutes = require('./routes/uploads'); // <--- NUEVO
const chatRoutes = require('./routes/chats');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a MongoDB Atlas');
})
.catch((error) => {
  console.error('Error conectando a MongoDB:', error);
  process.exit(1);
});

// Rutas API
app.use('/api/auth', authRoutes.router);
app.use('/api/cursos', cursoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/uploads', uploadsRoutes); // <--- NUEVO (endpoint de subida)
app.use('/api/chats', chatRoutes);

// Servir archivos estáticos subidos (URLs públicas)
// Ej: http://localhost:3000/static/cursos/<archivo>.jpg
app.use('/static/cursos', express.static(path.join(__dirname, 'uploads', 'cursos')));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
  console.log(`Uploads servidos en http://localhost:${PORT}/static/cursos`);
});
