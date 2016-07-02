import 'whatwg-fetch'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMoment from 'vue-moment'
import VueProgressbar from 'vue-progressbar'
import VueTransferDom from 'vue-transfer-dom'
import VueTouch from 'vue-touch'
import configRouter from './config-router'
import store from './vuex/store'
import { sync } from 'vuex-router-sync'
import { heightToggle } from './transitions'

import '../lib/ga'
import 'normalize.css'

import App from './App'

Vue.use(VueRouter)
Vue.use(VueProgressbar)
Vue.use(VueTransferDom)
Vue.use(VueMoment)
Vue.use(VueTouch)
Vue.transition('height-toggle', heightToggle)

let router = new VueRouter({
  history: true,
  saveScrollPosition: true
})
sync(store, router)
configRouter(router)

router.start(App, '#app')

