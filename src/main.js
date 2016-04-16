import Vue from 'vue'
import VueRouter from 'vue-router'
import configRouter from './config-router'

import App from './App'

Vue.use(VueRouter)

let router = new VueRouter({
  history: true,
  saveScrollPosition: true
})
configRouter(router)

router.start(App, '#app')
