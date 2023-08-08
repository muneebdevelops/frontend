import {createRouter, createWebHistory} from "vue-router"
import HomeComponent from './components/HomeComponent'
import CreateComponent from './components/CreateComponent'
import LoginComponentVue from "./components/LoginComponent.vue"


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
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes,
})

export default router;