<template>
  <div class="signup-container">
    <form @submit.prevent="signup" class="signup-form">
      <h2 class="signup-title">Signup</h2>
      <label for="username" class="signup-label">Name:</label>
      <input type="text" v-model="username" required class="signup-input">
      
      <label for="email" class="signup-label">Email:</label>
      <input type="email" v-model="email" required class="signup-input">

      <label for="password" class="signup-label">Password:</label>
      <input type="password" v-model="password" required class="signup-input">

      <label v-show="is_admin" for="is_admin" class="signup-label">Admin {{ is_admin_disabled_reminder }}</label>
      <input v-show="is_admin" type="checkbox" v-model="default_is_admin" class="signup-checkbox" :disabled="is_admin==false">

      <button type="submit" class="btn btn-primary signup-btn">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      default_is_admin:false,
      is_admin:false,
      is_admin_disabled_reminder:''
    };
  },
  methods: {

    async signup() {
      const userData = {
        name: this.username,
        email: this.email,
        password: this.password,
        is_admin: this.is_admin
      };

      try {
         let apiUrl = 'http://127.0.0.1:5000/signup';
         fetch(apiUrl, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            alert(data["message"])
             this.$router.back(); 
        })
        .catch((error) => {
            console.log(error);
        });
      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  },
  mounted(){
    if(sessionStorage.admin=='true'){
      this.is_admin=true
    }
    if(sessionStorage.admin!='true'){
      this.is_admin_disabled_reminder = '- DISABLED'
    }
  }

};
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2c3e50; /* Cool background color */
}

.signup-form {
  font-family: sans-serif;
  width: 400px; /* Increased width */
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s;
}

.signup-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
}

.signup-label {
  font-weight: bold;
  text-transform: capitalize;
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.signup-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
}

.signup-checkbox {
  margin-top: 5px;
}

.signup-btn {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.signup-btn:hover {
  background-color: #2980b9;
}
</style>