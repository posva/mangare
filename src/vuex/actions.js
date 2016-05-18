export function fetchMangaList ({state, dispatch}, request) {
  request.then((response) => {
    dispatch('SET_MANGA_LIST', response.data)
  }, (response) => {
    console.error('Cannot retrieve manga: ', response)
    dispatch('ERROR_REQUEST', response)
  }).catch((err) => {
    dispatch('ERROR', err)
  })
}

export function updateManga ({ dispatch }, manga) {
  dispatch('UPDATE_MANGA', manga)
}

export function fetchManga ({ dispatch }, id, request) {
  dispatch('START_REFRESH_MANGA', id)
  request.then((response) => {
    const manga = response.data
    dispatch('END_REFRESH_MANGA', id)
    dispatch('UPDATE_MANGA', manga)
    // this.updateManga(this.manga)
    // transition.next()
  }, (response) => {
    console.error('Cannot retrieve manga: ', response)
    dispatch('ERROR_REQUEST', response)
    dispatch('END_REFRESH_MANGA', id)
  }).catch((err) => {
    dispatch('END_REFRESH_MANGA', id)
    dispatch('ERROR', err)
  })
}
