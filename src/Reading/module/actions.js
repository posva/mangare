import fetchival from 'fetchival'
import * as types from './types.js'
import {
  startRequest,
  endRequest
} from 'src/shared/utils'
startRequest
endRequest

const mangas = fetchival('/api/mangas')

export function fetchManga ({ commit }, id) {
  startRequest(commit)
  return mangas(id).get()
    .then(manga => {
      commit(types.SET_MANGA, manga)
      endRequest(commit)
    }).catch(err => {
      console.error(err)
      endRequest(commit)
      // commit('ERROR_REQUEST', err)
    })
}

// TODO don't fetch if already fetched
export function fetchChapter ({ commit }, { mangaId, chapter }) {
  const chapters = mangas(`${mangaId}/chapters/${chapter}`)
  commit(types.SET_CURRENT_CHAPTER, chapter)
  startRequest(commit)
  return chapters.get()
    .then((chapterData) => {
      commit(types.SET_CHAPTER, {
        mangaId,
        chapter: chapterData
      })
      endRequest(commit)
    }).catch((err) => {
      console.error(err)
      endRequest(commit)
      // commit('ERROR_REQUEST', err)
    })
}

export function nextPage ({ commit, state }) {
  commit(types.SET_CURRENT_PAGE, state.currentPage + 1)
}
