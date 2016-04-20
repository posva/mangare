'use strict'
const request = require('request')

const host = 'http://www.mangareader.net'
const reListElements = new RegExp('<li><a href="(/[^"]+)"> ?([^<]+)</a>(<span class)?', 'g')
const reName = /class="aname">([^<]+)/
const reAlternateName = /Alternate Name[^<]*<[^>]*>\n?<td>([^<]+)/i
// const reNumberOfChapters = /class="chico_manga".*\n?<a[^>]*>.*([0-9]+)<.a/i
const reChapters = /class="chico_manga".*\n?<a +href="([^"]+)[^>]*>[^<]+<.a> : ([^<]+)?/ig
const reChapterPage = /id="img"[^>]*src="([^"]+)/i
// const reNextPage = /<a[^>]*href="([^"]+)"[^>]*>next/i
const reChapterAllPages = /id="selectpage".*\n(?:.*<option.*\n)*/i
const reChapterSinglePage = /<option[^>]*value="([^"]+)".*\n/gi
const reMangaImage = /id="mangaimg" *>[ \n]*<img[^>]*src="([^"]+)/i

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
    return new Promise((resolve, reject) => {
      request.get(this.getListURL(), (err, response, data) => {
        let p1, p2, text
        if (err) {
          reject(err)
        } else if (response.statusCode !== 200) {
          reject('wrong status')
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
        resolve(list)
      })
    })
  },
  getManga (mangaDescriptor) {
    return new Promise((resolve, reject) => {
      request.get(this.getMangaURL(mangaDescriptor), (err, response, data) => {
        if (err) {
          reject(err)
        } else if (response.statusCode !== 200) {
          reject('wrong status')
        }
        let manga = {}
        manga.name = reName.exec(data)[1].trim()
        if (mangaDescriptor.name !== manga.name) {
          console.log(`Warning: Manga name missmatch: "${manga.name}" !=== "${mangaDescriptor.name}"`)
        }
        manga.image = reMangaImage.exec(data)[1]
        manga.alternate = reAlternateName.exec(data)
        manga.alternate = manga.alternate && manga.alternate[1]
        manga.chapters = []
        data = data.substring(data.indexOf('id="chapterlist"'))
        let match = reChapters.exec(data)
        let index = 1
        while (match) {
          manga.chapters.push({
            index: index,
            uri: match[1],
            name: (match[2] && match[2] + ' (' + index + ')') || manga.name + ' ' + index
          })
          match = reChapters.exec(data)
          ++index
        }
        resolve(manga)
      })
    })
  },
  getPages (chapterDescriptor) {
    return new Promise((resolve, reject) => {
      request.get(this.getChapterURL(chapterDescriptor), (err, response, data) => {
        if (err) {
          reject(err)
        } else if (response.statusCode !== 200) {
          reject('wrong status')
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
        Promise.all(imagesPromises).then(() => resolve(pages))
      })
    })
  }
}

module.exports = mangaReader
