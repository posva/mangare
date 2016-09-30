import 'whatwg-fetch'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMoment from 'vue-moment'
// import VueProgressbar from 'vue-progressbar'
// import VueTransferDom from 'vue-transfer-dom'
// import VueTouch from 'vue-touch'
// import configRouter from './config-router'
import store from './vuex/store'
// import { sync } from 'vuex-router-sync'
// import { heightToggle } from './transitions'

import '../lib/ga'
import 'normalize.css'

import App from './App'
import router from './views'

Vue.use(VueRouter)
// TODO sync vuex vue-router
// Vue.use(VueProgressbar)
// Vue.use(VueTransferDom)
Vue.use(VueMoment)
// Vue.use(VueTouch)
// Vue.transition('height-toggle', heightToggle)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
