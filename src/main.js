import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueProgressbar from 'vue-progressbar'
import configRouter from './config-router'

require('normalize.css')

import App from './App'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueProgressbar)

// TODO progress bar
Vue.http.interceptors.push({
  request (request) {
    this.$progress.start(2000)
    return request
  },
  response (response) {
    if (response.status === 200) {
      this.$progress.finish()
    } else {
      this.$progress.failed()
    }
    return response
  }

})

let router = new VueRouter({
  history: true,
  saveScrollPosition: true
})
configRouter(router)

router.start(App, '#app')
