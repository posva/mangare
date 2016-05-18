import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

export const state = {
  mangaList: [],
  pendingRefreshRequests: 0,
  refreshingMangas: {}
}

export const mutations = {
  START_REFRESH_MANGA (state, id) {
    ++state.pendingRefreshRequests
    Vue.set(state.refreshingMangas, id, true)
  },
  END_REFRESH_MANGA (state, id) {
    --state.pendingRefreshRequests
    Vue.set(state.refreshingMangas, id, false)
  },
  SET_MANGA_LIST (state, mangaList) {
    state.mangaList = mangaList
  },
  UPDATE_MANGA (state, mangaData) {
    let manga = _.find(state.mangaList, { _id: mangaData._id })
    ;['image', 'name', 'description', 'updatedAt', 'completed', 'uri', 'chapterCount']
    .forEach((key) => {
      if (mangaData[key] !== undefined) {
        manga[key] = mangaData[key]
      }
    })
  }
}

export default new Vuex.Store({
  state,
  mutations
})
