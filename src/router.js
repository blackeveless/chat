import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Login from './views/Login.vue'

Vue.use(Router)


const checkAuth = (to, from, next) => {
    if (to.path === '/login') {
      if (store.getters.isLoggedIn) {
        next('/main');
      } else {
        next();
      }
    } else {
      if (store.getters.isLoggedIn) {
        next();
      } else {
        next('/login');
      }
    }
}
const logout = (to, from, next) => {
  store.dispatch('logout').then(next('/login')).catch(err => next('/login'));
}


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/logout',
      beforeEnter: logout
    },
    {
      path: '/login',
      component: Login,
      beforeEnter: checkAuth
    },
    {
      path: '/main',
      component: () => import(/* webpackChunkName: "main" */ '@/views/Main.vue'),
      beforeEnter: checkAuth
    },
    {
      path: '/conerr',
      component: () => import(/* webpackChunkName: "errors" */ '@/views/errors/ConnectionError.vue') 
    },
    {
      path: '/logout/*',
      redirect: '/404'
    },
    {
      path: '/login/*',
      redirect: '/404'
    },
    {
      path: '/conerr/*',
      redirect: '/404'
    },
    {
      path: '*',
      component: () => import(/* webpackChunkName: "errors" */ '@/views/errors/NotFound.vue')
    }
  ]
})
