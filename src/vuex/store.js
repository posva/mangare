import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

export const state = {
  mangaList: [],
  manga: {
    _id: null,
    name: null,
    description: null,
    image: null,
    updatedAt: null,
    uri: null,
    chapterCount: 0,
    chapters: [{
      date: null,
      _id: null,
      name: null,
      uri: null
    }],
    completed: false
  },
  pendingRefreshRequests: 0,
  refreshingMangas: {},
  downloads: {}
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
  SET_MANGA (state, manga) {
    if (manga) state.manga = manga
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
  },
  ERROR_REQUEST (state, err) {
    console.error(err)
  },
  ERROR (state, err) {
    console.error(err)
  },
  DOWNLOAD_SET_PROGRESS (state, { id, progress }) {
    Vue.set(state.downloads, id, progress)
  }
}

export default new Vuex.Store({
  state,
  mutations
})
