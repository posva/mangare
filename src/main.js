import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import configRouter from './config-router'

import App from './App'

Vue.use(VueRouter)
Vue.use(VueResource)

// TODO progress bar
Vue.http.interceptors.push({
  request (request) {
    return request
  },
  response (response) {
    return response
  }

})

let router = new VueRouter({
  history: true,
  saveScrollPosition: true
})
configRouter(router)

router.start(App, '#app')
