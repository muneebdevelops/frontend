<template>
  <div>
    <h2>Signup</h2>
    <form @submit.prevent="signup">
      <label for="username">Username:</label>
      <input type="text" v-model="username" required />
      
      <label for="email">Email:</label>
      <input type="email" v-model="email" required />

      <label for="password">Password:</label>
      <input type="password" v-model="password" required />

      <label for="is_admin">Admin</label>
      <input type="checkbox" v-model="is_admin" />

      <button type="submit" class="btn btn-primary">Submit</button>

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
      is_admin:false
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
             this.$router.push('/'); 
        })
        .catch((error) => {
            console.log(error);
        });
      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  }
};
</script>

<style scoped>
form{
  font-family: sans-serif;
  width: 300px;
  margin: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s;
}
button{
  display: block;
}
</style>
