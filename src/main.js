import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import router from './router'
import App from './App.vue'
import store from './store'
import 'vuetify/dist/vuetify.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuex)
Vue.use(Vuetify)

new Vue({
  el: '#app',
  router,
  store: new Vuex.Store(store),
  render: h => h(App)
})
