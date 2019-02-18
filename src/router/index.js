import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login'
import AppHome from '@/views/AppHome'
import Activities from '@/views/Activities'
import Manage from '@/views/Manage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: AppHome,
      redirect: '/home/activities',
      children: [
        {
          path: '/home/activities',
          name: 'activities',
          component: Activities
        }
      ]
    },
    {
      path: '/manage',
      name: 'manage',
      component: Manage
    }
  ]
})
