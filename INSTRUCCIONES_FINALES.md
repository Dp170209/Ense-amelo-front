# 📋 Instrucciones Paso a Paso - Proyecto Enseñamelo (COMPLETO)

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

### ✅ **Página Landing**
- **Página de inicio** con exploración de cursos
- **Botones de login/registro** en la parte superior
- **Redirección al login** al hacer click en cualquier curso
- **Diseño responsivo** y moderno

### ✅ **Sistema de Chat Completo**
- **Interfaz de chat** idéntica a la imagen proporcionada
- **Lista de conversaciones** con búsqueda
- **Mensajes en tiempo real** (simulado)
- **Información del curso** en el header del chat
- **Solo para tutores**: **Calendario de reservas** con icono de calendario

### ✅ **Creación de Cursos (Tutores)**
- **Formulario completo** para crear nuevos cursos
- **Campos requeridos**: Título, descripción, modalidad, precio, categoría
- **Sistema de tags** dinámico para categorización
- **Validaciones** de campos obligatorios
- **Integración con base de datos** MongoDB

### ✅ **Calendario de Reservas (Tutores)**
- **Modal de calendario** al hacer click en el icono de calendario
- **Selección de fechas** para reservas
- **Fechas destacadas** para fechas ya reservadas
- **Botones de acción** (Reservar/Cancelar)
- **Integración con el panel tutor**

### ✅ **Edición de Perfiles**
- **Perfil Estudiante**: Edición completa de información personal
- **Perfil Tutor**: Edición de información personal y profesional
- **Campos editables**: Nombre, apellido, email, teléfono, foto, biografía
- **Cambio de contraseña** opcional
- **Especialidades dinámicas** para tutores

### ✅ **Navegación Inteligente**
- **Redirección por roles**: Estudiantes → Home, Tutores → Panel Tutor
- **Pestañas específicas**: Chats disponible para ambos roles
- **Enlaces de edición** en perfiles
- **Botón de reserva** que lleva al chat

---

## 🗂️ Estructura de Navegación Completa

```
Landing (/)
├── Botón "Iniciar Sesión" → Login (/login)
├── Botón "Registrarse" → Registro Estudiante (/register)
└── Click en curso → Login (/login)

Login (/login)
├── Botón "Regístrate aquí" → Registro Estudiante (/register)
├── Botón "Registro de tutor" → Registro Tutor (/registro-tutor)
└── Login exitoso → Redirección según rol

Registro Estudiante (/register)
├── Botón "Inicia sesión aquí" → Login (/login)
└── Registro exitoso → Login (/login)

Registro Tutor (/registro-tutor)
├── Formulario completo con documentos profesionales
├── Botón "Inicia sesión aquí" → Login (/login)
└── Registro exitoso → Login (/login)

Home Estudiante (/home)
├── Click en curso → Detalles del Curso (/curso/:id)
├── Click en perfil → Perfil Estudiante (/perfil)
└── Botón "Cerrar Sesión" → Login (/login)

Panel Tutor (/panel-tutor)
├── Lista de clases con acciones
├── Calendario de horarios
├── Botón "Crear Nuevo Curso" → Configuración Curso (/config-curso)
├── Pestaña "Cursos" → Mis Cursos (/mis-cursos)
├── Pestaña "Chats" → Chat (/chat)
├── Click en perfil → Perfil Tutor (/perfil-tutor)
└── Botón "Cerrar Sesión" → Login (/login)

Mis Cursos (/mis-cursos)
├── Lista de cursos creados por el tutor
├── Botón "Crear Nuevo Curso" → Configuración Curso (/config-curso)
├── Botones "Editar/Eliminar" para cada curso
├── Pestaña "Panel" → Panel Tutor (/panel-tutor)
└── Botón "Cerrar Sesión" → Login (/login)

Configuración Curso (/config-curso)
├── Formulario completo para crear/editar cursos
├── Campos: Título, descripción, modalidad, precio, categoría, tags
├── Botón "Guardar Curso" → Panel Tutor (/panel-tutor)
├── Botón "Cancelar" → Panel Tutor (/panel-tutor)
└── Pestaña "Panel" → Panel Tutor (/panel-tutor)

Chat (/chat)
├── Lista de conversaciones
├── Mensajes en tiempo real
├── (Solo Tutores) Icono calendario → Modal de reservas
├── Click en perfil → Perfil según rol
└── Botón "Cerrar Sesión" → Login (/login)

Detalles del Curso (/curso/:id)
├── Botón "Reservar" → Chat (/chat)
├── Click en perfil → Perfil según rol
└── Botón "Cerrar Sesión" → Login (/login)

Perfil Estudiante (/perfil)
├── Botón "Editar Perfil" → Editar Perfil Estudiante (/edit-perfil)
├── Información personal y actividades
└── Botón "Cerrar Sesión" → Login (/login)

Perfil Tutor (/perfil-tutor)
├── Botón "Editar Perfil" → Editar Perfil Tutor (/edit-perfil-tutor)
├── Información profesional y comentarios
└── Botón "Cerrar Sesión" → Login (/login)

Editar Perfil Estudiante (/edit-perfil)
├── Formulario completo de edición
├── Cambio de foto de perfil
├── Cambio de contraseña opcional
└── Botón "Guardar" → Perfil Estudiante (/perfil)

Editar Perfil Tutor (/edit-perfil-tutor)
├── Formulario completo de edición profesional
├── Especialidades dinámicas
├── Cambio de foto de perfil
├── Cambio de contraseña opcional
└── Botón "Guardar" → Perfil Tutor (/perfil-tutor)
```

---

## 🎨 Características por Rol

### 👨‍🎓 **Estudiante:**
- ✅ **Landing page** con exploración de cursos
- ✅ Registro simple con datos básicos
- ✅ Home con listado de cursos disponibles
- ✅ Búsqueda y filtros de cursos
- ✅ Perfil personal con actividades editables
- ✅ Acceso a detalles de cursos
- ✅ **Chat con tutores** para reservas
- ✅ **Edición completa del perfil**

### 👨‍🏫 **Tutor:**
- ✅ **Landing page** con exploración de cursos
- ✅ Registro completo con documentos profesionales
- ✅ Panel de control con gestión de clases
- ✅ **Calendario para reservas** con fechas destacadas
- ✅ Perfil profesional con comentarios editables
- ✅ Gestión de cursos impartidos
- ✅ **Chat con estudiantes** para coordinación
- ✅ **Edición completa del perfil profesional**

---

## 🔧 Funcionalidades Técnicas

### ✅ **Sistema de Chat**
- **Interfaz moderna** con lista de conversaciones
- **Búsqueda de chats** por nombre
- **Mensajes diferenciados** (propios vs otros)
- **Información contextual** del curso en el header
- **Responsive design** para móviles

### ✅ **Calendario de Reservas**
- **Modal interactivo** con calendario completo
- **Navegación por meses** (anterior/siguiente)
- **Fechas destacadas** para reservas existentes
- **Selección de fechas** con feedback visual
- **Integración con el panel tutor**

### ✅ **Edición de Perfiles**
- **Formularios dinámicos** según el rol
- **Validación de campos** requeridos
- **Carga de imágenes** para fotos de perfil
- **Especialidades múltiples** para tutores
- **Cambio de contraseña** opcional y seguro

### ✅ **Navegación Avanzada**
- **Redirección inteligente** según rol de usuario
- **Protección de rutas** con autenticación
- **Enlaces contextuales** en cada página
- **Breadcrumbs implícitos** con botones de navegación

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
- Deberías ver la **página Landing** con cursos

### 3. Base de Datos Poblada:
- Ve a: `http://localhost:3000/api/cursos`
- Deberías ver una lista de cursos

### 4. Funcionalidades Nuevas:
- **Landing**: Explora cursos sin autenticación
- **Chat**: Comunícate con tutores/estudiantes
- **Calendario**: (Solo tutores) Reserva fechas
- **Edición**: Modifica tu perfil completamente

---

## 🎉 ¡Listo!

Tu aplicación Enseñamelo está **COMPLETAMENTE FUNCIONAL** con:

### ✅ **Para Estudiantes:**
- Landing page con exploración
- Registro e inicio de sesión
- Exploración de cursos
- Perfil personal editable
- Chat con tutores para reservas
- Navegación intuitiva

### ✅ **Para Tutores:**
- Landing page con exploración
- Registro profesional completo
- Panel de control avanzado
- Gestión de clases y horarios
- **Calendario de reservas interactivo**
- Perfil profesional editable
- **Chat con estudiantes** para coordinación

### ✅ **Sistema Completo:**
- **Página Landing** como punto de entrada
- **Sistema de Chat** completo y funcional
- **Calendario de reservas** para tutores
- **Edición de perfiles** avanzada
- Autenticación JWT robusta
- Base de datos MongoDB integrada
- Diseños responsivos y modernos
- Navegación inteligente por roles

**¡Tu plataforma educativa Enseñamelo está lista para conectar estudiantes con tutores de manera profesional!** 🎓

---

## 📞 Soporte

Si tienes algún problema:
1. Verifica que ambos servidores estén ejecutándose
2. Revisa la consola del navegador para errores
3. Asegúrate de que MongoDB esté conectado
4. Revisa las credenciales de prueba
5. **Nuevo**: Verifica que estés accediendo desde la página Landing

**¡Tu plataforma educativa completa está lista para usar!** 🚀
