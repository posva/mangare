'use strict'
const request = require('request')
const logger = require('../logger')('MangaReader')

const host = 'http://www.mangareader.net'
const reListElements = new RegExp('<li><a href="(/[^"]+)"> ?([^<]+)</a>(<span class)?', 'g')
const reName = /class="aname">([^<]+)/
const reAlternateName = /Alternate Name[^<]*<[^>]*>\n?<td>([^<]+)/i
// const reNumberOfChapters = /class="chico_manga".*\n?<a[^>]*>.*([0-9]+)<.a/i
const reChapters = /class="chico_manga".*\n?<a +href="([^"]+)[^>]*>[^<]+<.a> : ([^<]+)?<\/td>[ \n]*<td>([^<]*)/ig
const reChapterPage = /id="img"[^>]*src="([^"]+)/i
// const reNextPage = /<a[^>]*href="([^"]+)"[^>]*>next/i
const reChapterAllPages = /id="selectpage".*\n(?:.*<option.*\n)*/i
const reChapterSinglePage = /<option[^>]*value="([^"]+)".*\n/gi
const reMangaImage = /id="mangaimg" *>[ \n]*<img[^>]*src="([^"]+)/i
const reMangaDescription = /id="readmangasum" *>[ \n]*<h2[^>]*>[^<]*<\/h2>[ \n]*<p[^>]*>([^<]+)/i

let mangaReader = {
  host: host,
  getListURL () {
    return `${host}/alphabetical`
  },
  getChapterURL (chapter) {
    return `${host}${chapter.uri}`
  },
  getMangaURL (manga) {
    return `${host}${manga.uri}`
  },
  getList () {
    logger.info('Retrieving Manga List')
    return new Promise((resolve, reject) => {
      request.get(this.getListURL(), (err, response, data) => {
        let p1, p2, text
        if (err) {
          logger.error(err)
          return reject(err)
        } else if (response.statusCode !== 200) {
          logger.error(`Wrong status code ${response.status}`)
          return reject('wrong status')
        }
        p1 = data.indexOf('class="content_bloc2"')
        p2 = data.indexOf('id="adfooter"')
        text = data.substr(p1, p2 - p1)
        let list = []
        let match = reListElements.exec(text)
        let cache = []
        while (match) {
          let uri = match[1]
          if (cache.indexOf(uri) < 0) {
            cache.push(uri)
            list.push({
              uri,
              name: match[2],
              completed: !!match[3]
            })
          }
          match = reListElements.exec(text)
        }
        logger.info('Retrieved Manga List')
        resolve(list)
      })
    })
  },
  getManga (mangaDescriptor) {
    logger.info(`Retrieving Manga ${mangaDescriptor.uri}`)
    return new Promise((resolve, reject) => {
      request.get(this.getMangaURL(mangaDescriptor), (err, response, data) => {
        if (err) {
          logger.error(err)
          return reject(err)
        } else if (response.statusCode !== 200) {
          logger.error(`Wrong status code ${response.status}`)
          return reject('wrong status')
        }
        let manga = {}
        manga.name = reName.exec(data)[1].trim()
        if (mangaDescriptor.name !== manga.name) {
          logger.warn(`Manga name missmatch: "${manga.name}" !=== "${mangaDescriptor.name}"`)
        }

        let tmp
        tmp = reMangaImage.exec(data)
        manga.image = tmp && tmp[1]
        tmp = reMangaDescription.exec(data)
        manga.description = tmp && tmp[1]
        tmp = reAlternateName.exec(data)
        manga.alternate = tmp && tmp[1]
        manga.chapters = []
        data = data.substring(data.indexOf('id="chapterlist"'))
        let match = reChapters.exec(data)
        let index = 1
        while (match) {
          manga.chapters.push({
            index: index,
            uri: match[1],
            name: (match[2] && match[2] + ' (' + index + ')') || manga.name + ' ' + index,
            date: new Date(match[3]) || null
          })
          match = reChapters.exec(data)
          ++index
        }
        logger.info(`Retrieved Manga ${mangaDescriptor.uri}`)
        resolve(manga)
      })
    })
  },
  getPages (chapterDescriptor) {
    logger.info(`Retrieving chapter ${chapterDescriptor.uri}`)
    return new Promise((resolve, reject) => {
      request.get(this.getChapterURL(chapterDescriptor), (err, response, data) => {
        if (err) {
          logger.error(err)
          return reject(err)
        } else if (response.statusCode !== 200) {
          logger.error(`Wrong status code ${response.status}`)
          return reject('wrong status')
        }
        let pages = []

        let pagesText = reChapterAllPages.exec(data)[0]
        let match = reChapterSinglePage.exec(pagesText)
        // we already got first page
        pages.push({
          uri: match[1],
          image: reChapterPage.exec(data)[1]
        })
        let index = 0
        match = reChapterSinglePage.exec(pagesText)
        while (match) {
          ++index
          pages.push({
            uri: match[1]
          })
          match = reChapterSinglePage.exec(pagesText)
        }
        let imagesPromises = []
        pages.forEach((page, index) => {
          // We already got first image
          if (index > 0) {
            imagesPromises.push(new Promise((resolve, reject) => {
              request.get(`${host}${page.uri}`, (err, response, data) => {
                if (err) {
                  logger.error(err)
                  pages[index].image = null
                } else {
                  pages[index].image = reChapterPage.exec(data)[1]
                }
                resolve()
              })
            }))
          }
        })
        // Wait for all request to end
        Promise.all(imagesPromises).then(() => {
          logger.info(`Retrieved chapter ${chapterDescriptor.uri}`)
          resolve(pages)
        })
      })
    })
  }
}

module.exports = mangaReader
