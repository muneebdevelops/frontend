<template>
        <div id="app"> 
          <Navbar/>
          <router-view/>
        </div>
</template>

<script>
import Navbar from './components/NavbarComponent.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>

</style>
