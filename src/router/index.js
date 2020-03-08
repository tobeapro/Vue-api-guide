import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const router = new Router({
    mode:'hash',
    routes:[
        {
            path:'/',
            name:'home',
            component: () => import('@/views/home')
        },
        {
            path:'/loadingDemo',
            name:'loadingDemo',
            component: () => import('@/views/loadingDemo')
        },
        {
            path:'/nextTickDemo',
            name:'nextTickDemo',
            component: () => import('@/views/nextTickDemo') 
        },
        {
            path: '/observableDemo',
            name:'observableDemo',
            component: () => import('@/views/observableDemo') 
        }
    ]
})
export default router