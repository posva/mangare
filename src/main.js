import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMoment from 'vue-moment'
import VueResource from 'vue-resource'
import VueProgressbar from 'vue-progressbar'
import configRouter from './config-router'
import store from './vuex/store'
import { sync } from 'vuex-router-sync'

require('../lib/ga')
require('normalize.css')

import App from './App'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueProgressbar)
Vue.use(VueMoment)

Vue.http.interceptors.push({
  request (request) {
    this.$progress.start(5000)
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
sync(store, router)
configRouter(router)

router.start(App, '#app')

