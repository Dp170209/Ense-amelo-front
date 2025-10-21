# 📋 Instrucciones Paso a Paso - Proyecto Enseñamelo (ACTUALIZADO)

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

## 🎯 Nuevas Funcionalidades Implementadas

### ✅ Registro Separado por Roles
- **Registro de Estudiante**: Formulario básico con datos personales
- **Registro de Tutor**: Formulario completo con documentos profesionales
- **Enlaces en Login**: Acceso directo a ambos tipos de registro

### ✅ Panel de Tutor
- **Dashboard completo** para tutores
- **Lista de clases** con acciones (Detalle, Rechazar, Aceptar)
- **Calendario integrado** para gestión de horarios
- **Navegación específica** para tutores

### ✅ Perfil de Tutor
- **Información del tutor** con foto de perfil
- **Sección de cursos** impartidos
- **Comentarios de estudiantes** con calificaciones
- **Diseño idéntico** a la imagen proporcionada

### ✅ Redirección Inteligente
- **Estudiantes** → van al Home después del login
- **Tutores** → van al Panel Tutor después del login
- **Perfiles específicos** según el rol del usuario

---

## 🗂️ Estructura de Navegación Actualizada

```
Login (/login)
├── Botón "Regístrate aquí" → Registro Estudiante (/register)
├── Botón "Registro de tutor" → Registro Tutor (/registro-tutor)
└── Login exitoso → Redirección según rol

Registro Estudiante (/register)
├── Botón "Inicia sesión aquí" → Login (/login)
└── Registro exitoso → Login (/login)

Registro Tutor (/registro-tutor)
├── Formulario completo con documentos
├── Botón "Inicia sesión aquí" → Login (/login)
└── Registro exitoso → Login (/login)

Home Estudiante (/home)
├── Click en curso → Detalles del Curso (/curso/:id)
├── Click en perfil → Perfil Estudiante (/perfil)
└── Botón "Cerrar Sesión" → Login (/login)

Panel Tutor (/panel-tutor)
├── Lista de clases con acciones
├── Calendario de horarios
├── Click en perfil → Perfil Tutor (/perfil-tutor)
└── Botón "Cerrar Sesión" → Login (/login)

Perfil Estudiante (/perfil)
├── Información personal
├── Actividades del estudiante
└── Botón "Cerrar Sesión" → Login (/login)

Perfil Tutor (/perfil-tutor)
├── Información del tutor
├── Cursos impartidos
├── Comentarios de estudiantes
└── Botón "Cerrar Sesión" → Login (/login)
```

---

## 🎨 Características por Rol

### 👨‍🎓 **Estudiante:**
- ✅ Registro simple con datos básicos
- ✅ Home con listado de cursos disponibles
- ✅ Búsqueda y filtros de cursos
- ✅ Perfil personal con actividades
- ✅ Acceso a detalles de cursos

### 👨‍🏫 **Tutor:**
- ✅ Registro completo con documentos profesionales
- ✅ Panel de control con gestión de clases
- ✅ Calendario para horarios
- ✅ Perfil profesional con comentarios
- ✅ Gestión de cursos impartidos

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

### Error de registro corregido:
- ✅ Campo `contrasenia` ahora se mapea correctamente
- ✅ Validaciones mejoradas para formularios
- ✅ Manejo de errores más robusto

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

### 4. Registro Funcionando:
- Prueba registrar un nuevo estudiante
- Prueba registrar un nuevo tutor
- Verifica que los usuarios se guarden en MongoDB

---

## 🎉 ¡Listo!

Tu aplicación Enseñamelo está completamente funcional con:

### ✅ **Para Estudiantes:**
- Registro e inicio de sesión
- Exploración de cursos
- Perfil personal
- Navegación intuitiva

### ✅ **Para Tutores:**
- Registro profesional completo
- Panel de control avanzado
- Gestión de clases y horarios
- Perfil con comentarios de estudiantes

### ✅ **Sistema Completo:**
- Autenticación JWT
- Base de datos MongoDB
- Diseños responsivos
- Navegación inteligente por roles

**¡Disfruta explorando tu plataforma educativa completa!** 🚀

---

## 📞 Soporte

Si tienes algún problema:
1. Verifica que ambos servidores estén ejecutándose
2. Revisa la consola del navegador para errores
3. Asegúrate de que MongoDB esté conectado
4. Revisa las credenciales de prueba

**¡Tu plataforma Enseñamelo está lista para conectar estudiantes con tutores!** 🎓
