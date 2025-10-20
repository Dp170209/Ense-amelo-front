# 📋 Instrucciones Paso a Paso - Proyecto Enseñamelo

## 🚀 Cómo Ejecutar el Proyecto

### 📋 Prerrequisitos
- ✅ Node.js instalado (versión 16 o superior)
- ✅ npm o yarn instalado
- ✅ Navegador web (Chrome, Firefox, Safari, etc.)

---

## 🔧 Paso 1: Preparar el Backend

### 1.1 Abrir Terminal/PowerShell
- Abre una terminal o PowerShell en tu computadora
- Navega al directorio del proyecto: `cd "ruta/a/tu/proyecto/Ense-amelo-front"`

### 1.2 Instalar Dependencias del Backend
```bash
cd backend
npm install
```

### 1.3 Poblar la Base de Datos (Solo la primera vez)
```bash
node scripts/seedData.js
```
**Nota:** Este comando crea usuarios de prueba y cursos de ejemplo.

### 1.4 Iniciar el Servidor Backend
```bash
npm run dev
```
**✅ El backend estará funcionando en:** `http://localhost:3000`

---

## 🎨 Paso 2: Preparar el Frontend

### 2.1 Abrir Nueva Terminal/PowerShell
- Abre una **NUEVA** terminal (mantén la del backend abierta)
- Navega al directorio del proyecto: `cd "ruta/a/tu/proyecto/Ense-amelo-front"`

### 2.2 Instalar Dependencias del Frontend
```bash
npm install
```

### 2.3 Iniciar el Servidor Frontend
```bash
npm run dev
```
**✅ El frontend estará funcionando en:** `http://localhost:5173`

---

## 🌐 Paso 3: Usar la Aplicación

### 3.1 Abrir la Aplicación
1. Abre tu navegador web
2. Ve a: `http://localhost:5173`

### 3.2 Credenciales de Prueba
**Estudiante:**
- Email: `ana@estudiante.com`
- Contraseña: `123456`

**Tutor:**
- Email: `carlos@tutor.com`
- Contraseña: `123456`

---

## 🎯 Funcionalidades Implementadas

### ✅ Página de Login
- Botón para ir al registro
- Validación de credenciales
- Redirección automática al home

### ✅ Página de Registro
- Formulario completo con validaciones
- Botón para volver al login
- Registro de nuevos usuarios en la base de datos

### ✅ Página Home
- Listado de cursos desde MongoDB
- Búsqueda por texto
- Filtros por categoría
- Click en curso → va a detalles del curso
- Click en perfil → va al perfil del usuario

### ✅ Página de Detalles del Curso
- Información completa del curso
- Datos del instructor
- Botón de reserva
- Sección de reseñas

### ✅ Página de Perfil del Estudiante
- Información del usuario
- Sección de descripción
- Actividades del usuario
- Botones de acción

---

## 🛠️ Comandos de Desarrollo

### Para Backend:
```bash
cd backend
npm run dev          # Iniciar servidor
npm start           # Iniciar en producción
```

### Para Frontend:
```bash
npm run dev         # Iniciar servidor de desarrollo
npm run build       # Construir para producción
npm run preview     # Previsualizar build de producción
```

---

## 🔍 Verificar que Todo Funciona

### 1. Backend Funcionando:
- Ve a: `http://localhost:3000/api/test`
- Deberías ver: `{"success":true,"message":"API funcionando correctamente"}`

### 2. Frontend Funcionando:
- Ve a: `http://localhost:5173`
- Deberías ver la página de login

### 3. Base de Datos Poblada:
- Ve a: `http://localhost:3000/api/cursos`
- Deberías ver una lista de cursos

---

## 🚨 Solución de Problemas

### Error: "Cannot find module"
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install
```

### Error: "Port already in use"
```bash
# Cambiar puerto en el archivo de configuración
# Backend: backend/config.js (línea PORT)
# Frontend: vite.config.js (línea server.port)
```

### Error: "MongoDB connection failed"
- Verificar que la URL de MongoDB sea correcta
- Verificar conexión a internet
- Verificar credenciales de MongoDB Atlas

---

## 📱 Estructura de Navegación

```
Login (/login)
├── Botón "Regístrate aquí" → Registro (/register)
└── Login exitoso → Home (/home)

Registro (/register)
├── Botón "Inicia sesión aquí" → Login (/login)
└── Registro exitoso → Login (/login)

Home (/home)
├── Click en curso → Detalles del Curso (/curso/:id)
├── Click en perfil → Perfil del Usuario (/perfil)
└── Botón "Cerrar Sesión" → Login (/login)

Detalles del Curso (/curso/:id)
├── Botón "Cerrar Sesión" → Login (/login)
└── Click en perfil → Perfil del Usuario (/perfil)

Perfil del Usuario (/perfil)
├── Botón "Cerrar Sesión" → Login (/login)
└── Botón "Editar Perfil" → (Próximamente)
```

---

## 🎉 ¡Listo!

Tu aplicación Enseñamelo está funcionando correctamente. Los estudiantes pueden:
- ✅ Registrarse e iniciar sesión
- ✅ Ver todos los cursos disponibles
- ✅ Buscar y filtrar cursos
- ✅ Ver detalles de cada curso
- ✅ Acceder a su perfil de usuario
- ✅ Navegar entre todas las páginas

**¡Disfruta explorando tu plataforma educativa!** 🚀
