import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  mangaList: []
}

const mutations = {
  SET_MANGA_LIST (state, mangaList) {
    state.mangaList = mangaList
  }
}

export default new Vuex.Store({
  state,
  mutations
})
