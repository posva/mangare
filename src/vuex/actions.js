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
