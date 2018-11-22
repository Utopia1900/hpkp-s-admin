import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login'
import AppHome from '@/views/AppHome'
import Activities from '@/views/Activities'
/*import CreateActivity from '@/views/CreateActivity'
import CurrentMenuInfo from '@/views/CurrentMenuInfo'
import AddOpeningMenu from '@/views/AddOpeningMenu'*/
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
      name: '首页',
      component: AppHome,
      redirect: '/home/activities',
      children: [
        {
          path: '/home/activities',
          name: '活动列表',
          component: Activities
        }
      ]
    }
  ]
})
