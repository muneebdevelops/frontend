<template>
  <div class="login-container">
    <div class="login">
      <h2 class="login-title">Login</h2>
      <form id="login_form" @submit.prevent="login">
        <label class="login-label">Email</label>
        <input class="login-input" type="email" required v-model="email">
        <label class="login-label">Password</label>
        <input class="login-input" type="password" required v-model="password">
        <button type="submit" class="btn btn-primary login-btn" v-on:click="push">Submit</button>
      </form>
      
      <p class="signup-link">Don't have an account? <router-link to="/signup">Sign up</router-link></p>
    </div>
  </div>
</template>
<script>


export default {
    data() {
        return {
            
            email:'',
            password:''
            
            ,
            returned_token:{},
            token_value:""
        }
    },
    methods:{

      session_add(data){
        const val_token = data['token'];
        const val_id = data['id']
        sessionStorage.setItem('token',val_token);
        sessionStorage.setItem('id',val_id)
        this.$router.push('/')
        
      },

      err_handle(data){
        console.log(data)
        alert("Invalid User")
        sessionStorage.clear()
        this.$router.go('/login')
      },

      

      async push(){

          const request = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({"email":this.email,"password":this.password})
          };
          fetch('http://127.0.0.1:5000/login', request)
              .then(response => response.json())
              .then(data => (this.session_add(data["data"])))
              .catch(data => (this.err_handle(data)));
                
      }

    }
    
    
}
</script>
<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif IM !important;
  background-color: #263d7e !important;  
}

.login {
  font-family: sans-serif;
  width: 400px; /* Increased width */
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s;
}

.login-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
}

.login-label {
  font-weight: bold;
  text-transform: capitalize;
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.login-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #2980b9;
}

.token {
  margin-top: 15px;
  text-align: center;
  color: #888;
}

.signup-link {
  text-align: center;
  margin-top: 15px;
  color: #333;
}
.signup-link a {
  color: #3498db;
  text-decoration: underline;
}
</style>