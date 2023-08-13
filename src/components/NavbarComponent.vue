<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-navy">
    <router-link id="toptext" class="navbar-brand text-style"  to="/">FCC Event Management System</router-link>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav ms-auto">
        <router-link class="btn btn-skyblue" to="/">Home</router-link>
        <router-link class="btn btn-skyblue" to="/create">Create Event</router-link>
        <router-link v-if="!is_authenticated" class="btn btn-skyblue" to="/signup">Signup</router-link>
        <router-link v-if="is_admin" class="btn btn-skyblue" to="/admin">Admin</router-link>
        <router-link v-if="!is_authenticated" class="btn btn-skyblue" to="/login">Login</router-link>
     
        <div v-if="is_authenticated" class="user-info">
          <label id="username">welcome, {{ user }} {{ login_reminder }}</label>
        </div>
        <!-- <div id="logout"><button v-show="loggedin" type="button" class="btn btn-secondary" @click="logout" :style="{ background: logoutColor }">Logout</button></div> -->
        <div id="logout">
          <img v-show="loggedin" src="@/assets/logout-red.png" @click="logout" id="logout-image" />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      logoutColor: 'darkred',
      token: sessionStorage.token,
      user:'user',
      loggedin:false,
      is_admin:'', // Set this to your actual admin check logic
      is_authenticated: sessionStorage.token ? true : false, // Set this to your actual authentication check logic
      // username: data['name']// Set the logged-in user's name here
    };
  },
  methods: {
    
    session_add(data){
        this.user = data['name'];
        const val_admin = data['is_admin']
        sessionStorage.setItem('admin',val_admin);
        this.is_admin=val_admin
        this.loggedin=true
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
      sessionStorage.clear()
      this.$router.go('/')
    },
  },
  mounted(){
    if(sessionStorage.id){
      this.token = sessionStorage.token
      this.getUser(sessionStorage.id);
    }else{
      this.token = 'user'
    }
  }
};
</script>

<style>
.text-style {
  font-size: 40px !important;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif IM !important;
  font-style: bold;
  color:#263d7e !important;
}

.bg-navy {
  background-color: white !important;
}

.btn-skyblue {
  background-color: #263d7e !important;
  color: white !important;
  margin-right: 20px;
  width: 120px;
  height: 43px;
  margin-left: 5px;
  margin-top: 10px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif IM !important;
}

.user-info {
  display:inline-flex;
  align-items:center;
  margin-left: 60px;
  color: #263d7e;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif IM !important;
  font-size: 16px !important;
  white-space:nowrap; /* Prevent text from wrapping */
}

.username {
  margin-right: 60px;
  max-width: 200px; /* Limit the width of the username */
  overflow: hidden;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif IM !important;
  text-overflow: ellipsis; /* Show ellipsis if the text overflows */
}

#logout {
  margin-right: 60px;
  cursor: pointer;
  padding: 10px;
  margin-left: 10px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif IM !important;
  display: flex; /* Add flex display for alignment */
  align-items: center; /* Center the image vertically */
}

#logout-image {
  width: 40px; /* Set the width of the image */
  height: 40px; /* Set the height of the image */
  margin-right: 10px; /* Adjust margin as needed */
}



</style>



