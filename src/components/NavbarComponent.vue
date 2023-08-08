<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <router-link class="navbar-brand text-style" to="/"> FCC Event Management System </router-link>
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav ms-auto">
      <router-link class="btn btn-primary" to="/">Home</router-link>
      <router-link class="btn btn-success" to="/create">Create Event</router-link>
      <router-link class="btn btn-success" to="/login">Login</router-link>
    </div>
  </div>
</nav>
</template>

<script>
export default {

}
</script>

<style>
.text-style {
  font-size: 30px !important;
  font-family: sans-serif !important;
  color: navy !important;


 }
</style>