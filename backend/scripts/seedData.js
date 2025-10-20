const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');

// Importar modelos
const Usuario = require('../models/Usuario');
const PerfilTutor = require('../models/PerfilTutor');
const Categoria = require('../models/Categoria');
const Curso = require('../models/Curso');
const Horario = require('../models/Horario');

const seedData = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conectado a MongoDB Atlas');

    // Limpiar datos existentes (opcional)
    // await Usuario.deleteMany({});
    // await Categoria.deleteMany({});
    // await Curso.deleteMany({});

    // Crear categorías
    const categorias = [
      { nombre: 'Matemáticas', descripcion: 'Cursos de matemáticas y álgebra' },
      { nombre: 'Programación', descripcion: 'Cursos de programación y desarrollo' },
      { nombre: 'Inglés', descripcion: 'Cursos de idioma inglés' },
      { nombre: 'Ciencias', descripcion: 'Cursos de ciencias naturales' },
      { nombre: 'Arte', descripcion: 'Cursos de arte y creatividad' },
      { nombre: 'Música', descripcion: 'Cursos de música e instrumentos' }
    ];

    const categoriasCreadas = [];
    for (const catData of categorias) {
      let categoria = await Categoria.findOne({ nombre: catData.nombre });
      if (!categoria) {
        categoria = new Categoria(catData);
        await categoria.save();
        console.log(`Categoría creada: ${categoria.nombre}`);
      }
      categoriasCreadas.push(categoria);
    }

    // Crear usuarios de prueba
    const usuarios = [
      {
        nombre: 'Ana',
        apellido: 'García',
        email: 'ana@estudiante.com',
        contrasenia: '123456',
        telefono: 1234567890,
        rol: 'estudiante'
      },
      {
        nombre: 'Carlos',
        apellido: 'López',
        email: 'carlos@tutor.com',
        contrasenia: '123456',
        telefono: 1234567891,
        rol: 'docente'
      },
      {
        nombre: 'María',
        apellido: 'Rodríguez',
        email: 'maria@tutor.com',
        contrasenia: '123456',
        telefono: 1234567892,
        rol: 'docente'
      },
      {
        nombre: 'Pedro',
        apellido: 'Martínez',
        email: 'pedro@estudiante.com',
        contrasenia: '123456',
        telefono: 1234567893,
        rol: 'estudiante'
      }
    ];

    const usuariosCreados = [];
    for (const userData of usuarios) {
      let usuario = await Usuario.findOne({ email: userData.email });
      if (!usuario) {
        usuario = new Usuario(userData);
        await usuario.save();
        console.log(`Usuario creado: ${usuario.nombre} ${usuario.apellido}`);
      }
      usuariosCreados.push(usuario);
    }

    // Crear perfiles de tutor para los docentes
    const tutores = usuariosCreados.filter(u => u.rol === 'docente');
    const perfilesTutor = [];
    
    for (const tutor of tutores) {
      let perfilTutor = await PerfilTutor.findOne({ id_usuario: tutor._id });
      if (!perfilTutor) {
        perfilTutor = new PerfilTutor({
          id_usuario: tutor._id,
          ci: `CI${tutor._id.toString().slice(-6)}`,
          verificado: 'verificado',
          clasificacion: Math.random() * 2 + 3, // Entre 3 y 5
          biografia: `Soy ${tutor.nombre} ${tutor.apellido}, un tutor experimentado con años de experiencia enseñando.`
        });
        await perfilTutor.save();
        console.log(`Perfil de tutor creado para: ${tutor.nombre}`);
      }
      perfilesTutor.push(perfilTutor);
    }

    // Crear cursos
    const cursos = [
      {
        nombre: 'Matemáticas Básicas',
        descripcion: 'Aprende los fundamentos de las matemáticas desde cero. Incluye aritmética, álgebra básica y geometría.',
        modalidad: 'virtual',
        precio_reserva: 25.00,
        categorias: [categoriasCreadas[0]._id], // Matemáticas
        id_tutor: perfilesTutor[0]._id
      },
      {
        nombre: 'JavaScript para Principiantes',
        descripcion: 'Curso completo de JavaScript desde lo básico hasta conceptos avanzados. Ideal para empezar en programación web.',
        modalidad: 'virtual',
        precio_reserva: 35.00,
        categorias: [categoriasCreadas[1]._id], // Programación
        id_tutor: perfilesTutor[0]._id
      },
      {
        nombre: 'Inglés Conversacional',
        descripcion: 'Mejora tu inglés hablado con clases prácticas y conversaciones reales. Nivel intermedio.',
        modalidad: 'hibrida',
        precio_reserva: 30.00,
        categorias: [categoriasCreadas[2]._id], // Inglés
        id_tutor: perfilesTutor[1]._id
      },
      {
        nombre: 'Pintura al Óleo',
        descripcion: 'Aprende las técnicas básicas de pintura al óleo. Incluye teoría del color y práctica.',
        modalidad: 'presencial',
        precio_reserva: 40.00,
        categorias: [categoriasCreadas[4]._id], // Arte
        id_tutor: perfilesTutor[1]._id
      },
      {
        nombre: 'Guitarra Acústica',
        descripcion: 'Aprende a tocar guitarra desde cero. Incluye acordes básicos, ritmos y canciones populares.',
        modalidad: 'presencial',
        precio_reserva: 45.00,
        categorias: [categoriasCreadas[5]._id], // Música
        id_tutor: perfilesTutor[0]._id
      },
      {
        nombre: 'Física General',
        descripcion: 'Curso de física básica cubriendo mecánica, termodinámica y ondas. Con ejercicios prácticos.',
        modalidad: 'virtual',
        precio_reserva: 28.00,
        categorias: [categoriasCreadas[3]._id], // Ciencias
        id_tutor: perfilesTutor[1]._id
      }
    ];

    const cursosCreados = [];
    for (const cursoData of cursos) {
      let curso = await Curso.findOne({ nombre: cursoData.nombre });
      if (!curso) {
        curso = new Curso(cursoData);
        await curso.save();
        console.log(`Curso creado: ${curso.nombre}`);
        
        // Crear horarios para el curso
        const horarios = [
          {
            id_curso: curso._id,
            inicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
            fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) // 2 horas después
          },
          {
            id_curso: curso._id,
            inicio: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días desde ahora
            fin: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) // 2 horas después
          }
        ];

        for (const horarioData of horarios) {
          const horario = new Horario(horarioData);
          await horario.save();
        }
      }
      cursosCreados.push(curso);
    }

    console.log('\n=== DATOS SEMBRADOS EXITOSAMENTE ===');
    console.log(`Categorías: ${categoriasCreadas.length}`);
    console.log(`Usuarios: ${usuariosCreados.length}`);
    console.log(`Perfiles de tutor: ${perfilesTutor.length}`);
    console.log(`Cursos: ${cursosCreados.length}`);

    console.log('\n=== CREDENCIALES DE PRUEBA ===');
    console.log('Estudiante: ana@estudiante.com / 123456');
    console.log('Tutor: carlos@tutor.com / 123456');

  } catch (error) {
    console.error('Error sembrando datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedData();
}

module.exports = seedData;
