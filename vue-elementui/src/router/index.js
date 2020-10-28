import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('../components/login')
  },
  {
    path: '/',
    redirect: '/user',
  },
  {
    path: '/home',
    redirect: '/user',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/user',
        name: 'user',
        component: () => import('../components/user')
      },
      {
        path: '/role',
        name: 'role',
        component: () => import('../components/role')
      },
      {
        path: '/private',
        name: 'private',
        component: () => import('../components/private')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import('../components/categories')
      },
      {
        path: '/goods_detail',
        name: 'goods_detail',
        component: () => import('../components/goods_detail')
      },
      {
        path: '/goods_params',
        name: 'goods_params',
        component: () => import('../components/goods_params')
      },
      {
        path: '/goods/add',
        name: 'add_goods',
        component: () => import('../components/add_goods')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import('../components/reports')
      },
    ]
  },


]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path == ('/login')) return next()

  const token = sessionStorage.getItem('token')
  if (!token) return next('/login')
  next();
})

export default router
