<template>
  <header class="navbar">
    <div class="nav-content">
      <div class="left">
        <div class="logo-dot"></div>
        <span class="brand">ENSEÑAMELO</span>
      </div>
      <nav class="right">
        <RouterLink to="/home">Inicio</RouterLink>
        <RouterLink to="/cursos">Cursos</RouterLink>
        <RouterLink to="/perfil">Perfil</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
// sin lógica por ahora
</script>

<style scoped>
.navbar { background:#2c3e50; color:#ecf0f1; }
.nav-content{
  max-width:1200px; margin:0 auto; padding:12px 16px;
  display:flex; align-items:center; justify-content:space-between;
}
.left{ display:flex; align-items:center; gap:10px; }
.logo-dot{ width:28px; height:28px; border-radius:50%; background:#90c0d8; }
.brand{ font-weight:800; letter-spacing:.5px; }
.right a{
  color:#ecf0f1; margin-left:16px; text-decoration:none; font-weight:600;
}
.right a.router-link-active{ color:#90c0d8; }
</style>
