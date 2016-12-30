import * as types from './types.js'
import * as a from './actions.js'
import Vue from 'vue'

const state = {
  manga: null,
  currentChapter: 0,
  currentPage: 0
}

const mutations = {
  [types.SET_MANGA] (state, manga) {
    state.manga = manga
  },
  [types.SET_CHAPTER] (state, { mangaId, chapter }) {
    if (mangaId !== state.manga._id) return
    // Update the cache
    const chapters = state.manga.chapters
    for (let i = 0, l = chapters.length; i < l; ++i) {
      if (chapters[i]._id === chapter._id) {
        Vue.set(chapters, i, chapter)
        break
      }
    }
  },
  [types.SET_CURRENT_PAGE] (state, currentPage) {
    state.currentPage = Number(currentPage)
  },
  [types.SET_CURRENT_CHAPTER] (state, currentChapter) {
    state.currentChapter = Number(currentChapter)
  }
}

const actions = {
  [types.FETCH_MANGA]: a.fetchManga,
  [types.FETCH_CHAPTER]: a.fetchChapter,
  [types.NEXT_PAGE]: a.nextPage
}

const getters = {
  [types.PAGES]: (state, getters) => getters[types.CHAPTER] && getters[types.CHAPTER].pages || [],
  [types.MANGA]: state => state.manga,
  [types.CHAPTER]: ({ manga, currentChapter }) => manga && manga.chapters[currentChapter - 1],
  [types.CURRENT_PAGE]: (state, getters) => (
    getters[types.PAGES] &&
      getters[types.PAGES][state.currentPage - 1] ||
      ''
  ),
  [types.CURRENT_PAGE_INDEX]: state => state.currentPage,
  [types.PREVIOUS_PAGE_PARAMS]: (state, getters) => {
    return {
      mangaId: state.manga && state.manga._id || 0,
      chapter: getters[types.CHAPTER] && getters[types.CHAPTER]._id || 0,
      page: state.currentPage - 1
    }
  },
  [types.NEXT_PAGE_PARAMS]: (state) => {
    return {
      mangaId: state.manga && state.manga._id || 0,
      chapter: getters[types.CHAPTER] && getters[types.CHAPTER]._id || 0,
      page: state.currentPage + 1
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

export {
  actions,
  getters,
  mutations,
  types,
  state
}
