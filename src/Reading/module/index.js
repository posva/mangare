import * as types from './types.js'
import * as a from './actions.js'

const state = {
  manga: null,
  chapter: null,
  currentPage: 0
}

const mutations = {
  [types.SET_MANGA] (state, manga) {
    state.manga = manga
  },
  [types.SET_CHAPTER] (state, chapter) {
    state.chapter = chapter
  },
  [types.SET_CURRENT_PAGE] (state, currentPage) {
    state.currentPage = Number(currentPage)
  }
}

const actions = {
  [types.FETCH_MANGA]: a.fetchManga,
  [types.FETCH_CHAPTER]: a.fetchChapter,
  [types.NEXT_PAGE]: a.nextPage
}

const getters = {
  [types.PAGES]: state => state.chapter && state.chapter.pages || [],
  [types.MANGA]: state => state.manga,
  [types.CHAPTER]: state => state.chapter,
  [types.CURRENT_PAGE]: (state, getters) => (
    getters[types.PAGES] &&
      getters[types.PAGES][state.currentPage - 1] ||
      ''
  ),
  [types.PREVIOUS_PAGE_PARAMS]: (state) => {
    return {
      mangaId: state.manga && state.manga._id || 0,
      chapter: state.chapter && state.chapter._id || 0,
      page: state.currentPage - 1
    }
  },
  [types.NEXT_PAGE_PARAMS]: (state) => {
    return {
      mangaId: state.manga && state.manga._id || 0,
      chapter: state.chapter && state.chapter._id || 0,
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
