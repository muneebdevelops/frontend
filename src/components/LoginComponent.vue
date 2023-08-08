<template>
<div class="login">
    <h2>Login</h2>
    <form id="login_form" @submit.prevent="push">
        <label>Email</label>
        <input type="email" required v-model="email">
        <label>Password</label>
        <input type="password" required v-model="password">
        <button type="submit" class="btn btn-primary" v-on:click="push">Submit</button>

    </form>
    {{ token_value }}
</div>
</template>
<script>


export default {
    data() {
        return {
            
            email:'',
            password:''
            
            ,
            returned_token:[],
            token_value:""
        }
    },
    methods:{

        async push(){
  
            const request = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"email":this.email,"password":this.password})
            };
            fetch('http://127.0.0.1:5000/login', request)
                .then(response => response.json())
                .then(data => (this.returned_token=data["data"]));
                localStorage.setItem('token',this.returned_token)
                this.token_value=localStorage.getItem('token')
        }

    }
    
    
}
</script>
<style>
.login{
    font-family: sans-serif;
  width: 300px;
  margin: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s;
}
label{
    font-weight: bold;
    text-transform: capitalize;
    text-align: left;
}
button{
    margin-top: 10px;
}
</style>