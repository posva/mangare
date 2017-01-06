import fetchival from 'fetchival'
import * as types from './types.js'
import {
  startRequest,
  failRequest,
  endRequest
} from 'src/shared/utils'

const mangas = fetchival('/api/mangas')

export function fetchManga ({ commit, state }, id) {
  // Exit if manga is already fetched
  if (state.manga && state.manga._id === id) return Promise.resolve()
  startRequest(commit)
  commit(types.RESET_MANGA)
  return mangas(id).get()
    .then(manga => {
      commit(types.SET_MANGA, manga)
      endRequest(commit)
    }).catch(err => {
      console.error(err)
      failRequest(commit)
      // commit('ERROR_REQUEST', err)
    })
}

// TODO don't fetch if already fetched
export function fetchChapter ({ commit, state, getters }, { mangaId, chapter }) {
  commit(types.SET_CURRENT_CHAPTER, chapter)

  // Exit if chapter is cached
  const cachedChapter = state.manga.chapters.find(({ _id }) => _id === chapter)
  if (cachedChapter && cachedChapter.pages) {
    return Promise.resolve(cachedChapter)
  }
  const chapters = mangas(`${mangaId}/chapters/${chapter}`)
  startRequest(commit)
  return chapters.get()
    .then((chapterData) => {
      commit(types.SET_CHAPTER, {
        mangaId,
        chapter: chapterData
      })
      endRequest(commit)
      return chapterData
    }).catch((err) => {
      console.error(err)
      failRequest(commit)
      // commit('ERROR_REQUEST', err)
    })
}

export function nextPage ({ commit, state }) {
  commit(types.SET_CURRENT_PAGE, state.currentPage + 1)
}
