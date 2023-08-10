<template>
      <p class="token">{{ returned_token }}</p>
  <nav class="navbar navbar-expand-lg navbar-light bg-navy">
    <router-link class="navbar-brand text-style" to="/">FCC Event Management System</router-link>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav ms-auto">
        <router-link class="btn btn-skyblue" to="/">Home</router-link>
        <router-link class="btn btn-skyblue" to="/create">Create Event</router-link>
        <router-link v-if="is_admin" class="btn btn-skyblue" to="/admin">Admin</router-link>
        <router-link v-if="!is_authenticated" class="btn btn-skyblue" to="/login">Login</router-link>
     
        <div v-if="is_authenticated" class="user-info">
          <span class="username">{{ user }}</span>
          <img class="logout-icon" src="public\logout-icon.png" alt="Logout" @click="logout" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      token: sessionStorage.token,
      user:'name',
      is_admin:'is_admin', // Set this to your actual admin check logic
      is_authenticated: sessionStorage.token ? false : true, // Set this to your actual authentication check logic
      // username: data['name']// Set the logged-in user's name here
    };
  },
  methods: {
    
    session_add(data){
        this.user = data['name'];
        const val_admin = data['is_admin']
        sessionStorage.setItem('admin',val_admin);
      },

    getUser(token){
      const id_param=token
      const request = {
              method: "GET",
              headers: { "Content-Type": "application/json" },
          };
      fetch('http://127.0.0.1:5000/user?'+ new URLSearchParams({id:id_param}), request)
        .then(response => response.json())
        .then(data => (this.session_add(data["data"])))
    },
    logout() {
      // Add your logout logic here
       const id_param=sessionStorage.id
      const request = {
              method: "GET",
              headers: { "Content-Type": "application/json" },
          };
      fetch('http://127.0.0.1:5000/user/logout?'+ new URLSearchParams({id:id_param}), request)
        .then(response => response.json())
        .then(data => (console.log(data["data"])))
        this.$router.push('/login'); 
    },
  },
  mounted(){
    if(sessionStorage.id){
      this.token = sessionStorage.token
      this.getUser(sessionStorage.id);
    }else{
      this.token = 'user'
    }
  },
  created() {
    this.username = sessionStorage.getItem('name');
  }
};
</script>

<style>
.text-style {
  font-size: 30px !important;
  font-family: sans-serif !important;
  color: white !important;
}

.bg-navy {
  background-color: navy !important;
}

.btn-skyblue {
  background-color: skyblue !important;
  margin-right: 10px;
  width: 120px;
  margin-left: 5px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-left: 80px; /* Adjust the margin as needed */
  color: white;
  white-space: nowrap; /* Prevent text from wrapping */
}

.username {
  margin-right: 60px;
  max-width: 200px; /* Limit the width of the username */
  overflow: hidden;
  text-overflow: ellipsis; /* Show ellipsis if the text overflows */
}

.logout-icon {
  margin-right: 60px;
  width: 50px;
  cursor: pointer;
}
</style>



