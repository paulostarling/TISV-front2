<template>
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
        <div class="sidebar-brand-icon rotate-n-15">
          <i class="fas fa-h-square"></i>
        </div>
        <div class="sidebar-brand-text mx-3">Hotel Cali Dreams</sup></div>
      </a>

      <!-- Divider -->
      <hr class="sidebar-divider my-0">

      <hr class="sidebar-divider">
      <div class="sidebar-heading">Administrativo</div>
      
            <!-- Nav Item - Dashboard -->
      <li class="nav-item">
        <a class="nav-link" href="/">
          <i class="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span></a>
      </li>

      <hr class="sidebar-divider">
      <div class="sidebar-heading">Pedidos</div>

      <li class="nav-item">
        <a class="nav-link" href="/criar_predido">
          <i class="fas fa-fw fa-history"></i>
          <span>Criar Pedido</span></a>
      </li>

      <li class="nav-item">
        <a class="nav-link" href="/consultar_pedidos">
          <i class="fas fa-fw fa-pen-alt"></i>
          <span>Consultar Pedidos</span></a>
      </li>

      <hr class="sidebar-divider">
      <div class="sidebar-heading">Cadastros</div>

      <li class="nav-item">
        <a class="nav-link" href="/produtos">
          <i class="fas fa-fw fa-history"></i>
          <span>Produtos</span></a>
      </li>

      <li class="nav-item">
        <a class="nav-link" href="/usuarios">
          <i class="fas fa-fw fa-user"></i>
          <span>Usuários</span></a>
      </li>

      <hr class="sidebar-divider d-none d-md-block">
    </ul>
</template>

<script>
export default {
    data: function(){
        return {}
    },
    methods: {}
}
</script>
