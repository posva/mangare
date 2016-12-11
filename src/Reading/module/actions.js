import fetchival from 'fetchival'
import * as types from './types.js'

const mangas = fetchival('/api/mangas')

export function fetchManga ({ commit }, id) {
  // commit('START_REFRESH_MANGA', id)
  return mangas(id).get()
    .then(manga => {
      commit(types.SET_MANGA, manga)
      // commit('END_REFRESH_MANGA', id)
    }).catch(err => {
      console.error(err)
      // commit('END_REFRESH_MANGA', id)
      // commit('ERROR_REQUEST', err)
    })
}

export function fetchChapter ({ commit }, { mangaId, chapter }) {
  const chapters = fetchival(`/api/mangas/${mangaId}/chapters/${chapter}`)
  // commit('START_REFRESH_MANGA', chapter)
  return chapters.get()
    .then((chapterData) => {
      commit(types.SET_CHAPTER, chapterData)
      // commit('END_REFRESH_MANGA', chapter)
    }).catch((err) => {
      console.error(err)
      // commit('ERROR_REQUEST', err)
      // commit('END_REFRESH_MANGA', chapter)
    })
}

export function nextPage ({ commit, state }) {
  commit(types.SET_CURRENT_PAGE, state.currentPage + 1)
}
