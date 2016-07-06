import fetchival from 'fetchival'
import _ from 'lodash'
import Pdf from '../../lib/jspdf'
import { nextTick, timeout } from '../utils'

const mangas = fetchival('/api/mangas')
const image = fetchival('/api/image', { responseAs: 'text' })

export function fetchMangaList ({ dispatch }) {
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

export function updateChapter ({ dispatch }, mangaId, chapter) {
  dispatch('UPDATE_CHAPTER', mangaId, chapter)
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

export function fetchChapter ({ dispatch }, mangaId, id) {
  const chapters = fetchival(`/api/mangas/${mangaId}/chapters/${id}`)
  // dispatch('START_REFRESH_MANGA', id)
  console.log('hello', mangaId, id)
  return chapters.get()
    .then((chapter) => {
      dispatch('UPDATE_CHAPTER', mangaId, chapter)
      // dispatch('END_REFRESH_MANGA', id)
    }).catch((err) => {
      // dispatch('END_REFRESH_MANGA', id)
      dispatch('ERROR_REQUEST', err)
    })
}

export function resetDownloadProgress ({ dispatch }, id) {
  dispatch('DOWNLOAD_SET_PROGRESS', { id, progress: 0 })
}

export function setDownloadProgress ({ dispatch }, id, progress) {
  dispatch({
    type: 'DOWNLOAD_SET_PROGRESS',
    silent: true,
    payload: { id, progress }
  })
}

export function downloadChapter ({ dispatch }, { _id, pages, name }, downloadButton) {
  let imagesPromises = []
  let images = []
  const chapterId = `${name} ${_id}`
  downloadButton.start()
  let counter = 0
  const total = pages.length * 2
  pages.forEach((page, i) => {
    imagesPromises.push(
      image.get({ url: page })
      .then((encodedImage) => {
        const image = {
          data: encodedImage,
          format: null
        }
        images[i] = image
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = () => {
            image.format = img.width > img.height ? ['a3', 'l'] : ['a4', 'p']
            setDownloadProgress({ dispatch }, chapterId, ++counter / total)
            resolve()
          }
          img.src = image.data
        })
      }).catch((err) => {
        dispatch('ERROR_REQUEST', err)
        downloadButton.fail()
      })
    )
  })

  return Promise.all(imagesPromises).then(() => {
    const pdf = new Pdf()
    let p = nextTick()
    images.forEach((image, i) => {
      p = p.then(() => {
        if (i > 0) {
          pdf.addPage.apply(pdf, image.format)
        }
        pdf.addImage(image.data, 0, 0, image.format[1] === 'l' ? 420 : 210, 297)

        setDownloadProgress({ dispatch }, chapterId, ++counter / total)
        // using nextTick doesn't work
        return timeout(0)
      })
    })
    p.then(() => {
      pdf.save(name + '.pdf')
    }).catch((err) => {
      dispatch('ERROR', err)
      downloadButton.fail()
    })
  })
}
