# Enseñamelo - Plataforma Educativa

Plataforma web para conectar estudiantes con tutores, desarrollada con Vue.js y Node.js.

## Características

- **Autenticación**: Sistema de login y registro para estudiantes y tutores
- **Gestión de Cursos**: Los tutores pueden crear y gestionar cursos
- **Búsqueda y Filtros**: Los estudiantes pueden buscar cursos por categoría y texto
- **Base de Datos**: MongoDB Atlas para almacenar toda la información

## Tecnologías Utilizadas

### Frontend
- Vue.js 3
- Vue Router
- Axios
- Vite

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT para autenticación
- Bcrypt para encriptación de contraseñas

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Backend

1. Navegar a la carpeta del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar el servidor:
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### Frontend

1. Navegar a la carpeta raíz del proyecto:
```bash
cd ..
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Poblar la Base de Datos

Para poblar la base de datos con datos de prueba:

```bash
cd backend
node scripts/seedData.js
```

Esto creará:
- Categorías de cursos
- Usuarios de prueba (estudiantes y tutores)
- Cursos de ejemplo
- Horarios de prueba

## Credenciales de Prueba

### Estudiante
- Email: `ana@estudiante.com`
- Contraseña: `123456`

### Tutor
- Email: `carlos@tutor.com`
- Contraseña: `123456`

## Estructura del Proyecto

```
Ense-amelo-front/
├── backend/
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de la API
│   ├── scripts/         # Scripts de utilidad
│   └── server.js        # Servidor principal
├── src/
│   ├── api/            # Configuración de API
│   ├── views/          # Páginas Vue
│   ├── router/         # Configuración de rutas
│   └── main.js         # Punto de entrada
└── index.html          # HTML principal
```

## Funcionalidades Implementadas

### Requerimientos Funcionales Cumplidos

- **RF 001**: Registro y autenticación de tutores ✅
- **RF 002**: Registro y autenticación de estudiantes ✅
- **RF 003**: Búsqueda de tutores/cursos con filtros ✅
- **RF 008**: Creación y publicación de cursos (backend) ✅
- **RF 010**: Definición de precios y visualización ✅

### Páginas Implementadas

1. **Login**: Página de inicio de sesión
2. **Registro**: Página de registro de usuarios
3. **Home**: Página principal con listado de cursos

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/profile` - Obtener perfil del usuario

### Cursos
- `GET /api/cursos` - Obtener cursos con filtros
- `GET /api/cursos/:id` - Obtener curso específico
- `POST /api/cursos` - Crear curso (tutores)
- `PUT /api/cursos/:id` - Actualizar curso
- `DELETE /api/cursos/:id` - Eliminar curso

### Categorías
- `GET /api/categorias` - Obtener categorías

## Próximos Pasos

- Implementar sistema de reservas
- Agregar chat entre estudiantes y tutores
- Sistema de pagos
- Panel de administración
- Sistema de calificaciones y reseñas