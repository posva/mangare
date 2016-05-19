import fetchival from 'fetchival'
import _ from 'lodash'
const mangas = fetchival('/api/mangas')

export function fetchMangaList ({state, dispatch}, request) {
  return mangas.get()
  .then((mangaList) => {
    dispatch('SET_MANGA_LIST', mangaList)
  }).catch((err) => {
    dispatch('ERROR_REQUEST', err)
  })
}

export function updateManga ({ dispatch }, manga) {
  dispatch('UPDATE_MANGA', manga)
}

export function viewManga ({ dispatch, state }, id) {
  dispatch('SET_MANGA', _.find(state.mangaList, { _id: id }))
  dispatch('START_REFRESH_MANGA', id)
  return mangas(id).get()
  .then((manga) => {
    dispatch('SET_MANGA', manga)
    dispatch('UPDATE_MANGA', manga)
    dispatch('END_REFRESH_MANGA', id)
  }).catch((err) => {
    dispatch('END_REFRESH_MANGA', id)
    dispatch('ERROR_REQUEST', err)
  })
}

export function fetchManga ({ dispatch }, id) {
  dispatch('START_REFRESH_MANGA', id)
  return mangas(id).get()
  .then((manga) => {
    dispatch('UPDATE_MANGA', manga)
    dispatch('END_REFRESH_MANGA', id)
  }).catch((err) => {
    dispatch('END_REFRESH_MANGA', id)
    dispatch('ERROR_REQUEST', err)
  })
}
