import {createRouter, createWebHistory} from "vue-router"
import HomeComponent from './components/HomeComponent'
import CreateComponent from './components/CreateComponent'
import LoginComponentVue from "./components/LoginComponent.vue"

import SignupComponent from './components/SignupComponent'
import AdminComponent from './components/AdminComponent'

//create routes here

const routes = [
    {
        path: '/',
        name: 'home', 
        component: HomeComponent
    },
    {
        path: '/create',
        name: 'create', 
        component: CreateComponent
    },
    {
        path: '/login',
        name: 'login',
        component: LoginComponentVue
    },
    {
        path: '/signup',
        name: 'Signup', 
        component: SignupComponent
    },
    {
        path: '/admin',
        name: 'Admin', 
        component: AdminComponent
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes,
});

export default router;