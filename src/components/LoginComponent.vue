<template>
<div class="login">
    <form id="login_form">
        <label>Email</label>
        <input type="email" required v-model="login.email">
        <label>Password</label>
        <input type="password" required v-model="login.password">
        <button type="button" class="btn btn-primary" v-on:click="push">Submit</button>

    </form>
    {{ returned_token }}
</div>
</template>
<script>


export default {
    data() {
        return {
            login:{
                email:'',
                password:''
            }
            ,
            returned_token:{}
        }
    },
    methods:{
        localstr(){
            localStorage.setItem('email',this.email)
            localStorage.setItem('password',this.password)
        },

        push(){

            

            const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.login)
            };
            
            fetch("http:127.0.0.1/login", requestOptions)
            .then(response => response.json())
            .then(data => (this.returned_token = data.data.token));
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