import 'whatwg-fetch'
import 'intl'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueLazyload from 'vue-lazyload'
// import VueProgressbar from 'vue-progressbar'
// import VueTransferDom from 'vue-transfer-dom'
import VueTouch from './Touch/VueTouch.js'
// import configRouter from './config-router'
import store from './vuex/store'
import { formattedDate } from './shared/utils.js'
// import { sync } from 'vuex-router-sync'
// import { heightToggle } from './transitions'

import '../lib/ga'
import 'normalize.css'

import App from './App'
import router from './views'

Vue.use(VueLazyload)
Vue.use(VueRouter)
// TODO sync vuex vue-router
// Vue.use(VueProgressbar)
// Vue.use(VueTransferDom)
Vue.use(VueTouch)
// Vue.transition('height-toggle', heightToggle)
Vue.filter('formattedDate', formattedDate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
