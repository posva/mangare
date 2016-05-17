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

export function fetchManga ({ dispatch }, request) {
  request.then((response) => {
    const manga = response.data
    dispatch('UPDATE_MANGA', manga)
    // this.updateManga(this.manga)
    // transition.next()
  }, (response) => {
    console.error('Cannot retrieve manga: ', response)
    dispatch('ERROR_REQUEST', response)
  }).catch((err) => {
    dispatch('ERROR', err)
  })
}
