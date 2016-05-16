import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

export const state = {
  mangaList: []
}

export const mutations = {
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
