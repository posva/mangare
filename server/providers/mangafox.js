'use strict'
const fetchival = require('fetchival')
fetchival.fetch = require('node-fetch')
const logger = require('../logger')('MangaReader')

const host = 'https://mangafox.site'
const reListElements = new RegExp('<li[^>]*>\\s*<a href="(/[^"]+)" [^>]*>([^<]+)</a>', 'g')
const reName = /<h1[^>]*>\s*<a[^<]*>([^<]+)/
const reAlternateName = /<span[^>]*>Also name:<\/span>\s*<span[^>]*>([^<]+)/i
const rePages = /<img[^>]*src="([^"]+)"[^>]*style="?margin:5px;/ig
const reChapters = /<div[^>]*margin:5px[^>]*>\s*<div[^>]*>\s*<a\s*href="([^"]+)"[^>]*>([^<]+)<\/a>\s*<\/div>\s*<div[^>]*>([^<]+)</ig
const reMangaImage = /<img style="border:2px solid #fff"[^>]*src="([^"]+)/i
const reMangaDescription = /<div style="line-height:1.8em; color:#dadada; margin:5px;"[^>]*>([^<]+)/i

let mangaReader = {
  host: host,
  getListURL () {
    return `${host}/list`
  },

  getChapterURL (chapter) {
    return `${host}${chapter.uri}`
  },

  getMangaURL (manga) {
    return `${host}${manga.uri}`
  },

  getList () {
    logger.info('Retrieving Manga List')
    return fetchival(this.getListURL(), { responseAs: 'text' }).get()
      .then(data => {
        let p1, p2, text
        p1 = data.indexOf('ul style="margin:0;padding:0;"')
        p2 = data.indexOf('id="menuBottom"')
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
              completed: null
            })
          }
          match = reListElements.exec(text)
        }
        return list
      })
      .catch(err => {
        logger.error(err)
      })
  },

  getManga (mangaDescriptor) {
    logger.info(`Retrieving Manga ${mangaDescriptor.uri}`)
    return fetchival(this.getMangaURL(mangaDescriptor), { responseAs: 'text' }).get()
      .then(data => {
        let manga = {}
        manga.name = reName.exec(data)[1].trim()
        if (mangaDescriptor.name !== manga.name) {
          logger.warn(`Manga name missmatch: "${manga.name}" !== "${mangaDescriptor.name}"`)
        }

        let tmp
        tmp = reMangaImage.exec(data)
        manga.image = tmp && tmp[1]
        tmp = reMangaDescription.exec(data)
        manga.description = tmp && tmp[1]
        tmp = reAlternateName.exec(data)
        manga.alternate = tmp && tmp[1]
        manga.chapters = []
        let match = reChapters.exec(data)
        while (match) {
          manga.chapters.push({
            _id: null,
            uri: match[1],
            name: match[2] || null,
            date: new Date(match[3]) || null
          })
          match = reChapters.exec(data)
        }
        manga.chapters.reverse()
        manga.chapters.forEach((chapter, index) => {
          chapter._id = index + 1
          chapter.name = chapter.name || `${manga.name} ${index + 1}`
        })
        logger.info(`Retrieved Manga ${mangaDescriptor.uri}`)
        return manga
      })
      .catch(err => {
        logger.error(err)
      })
  },

  getPages (chapterDescriptor) {
    logger.info(`Retrieving chapter ${chapterDescriptor.uri}`)
    return fetchival(this.getChapterURL(chapterDescriptor), { responseAs: 'text' }).get()
      .then(data => {
        let pages = []

        let match = rePages.exec(data)
        while (match) {
          pages.push({
            uri: chapterDescriptor.uri,
            image: match[1]
          })
          match = rePages.exec(data)
        }
        logger.info(`Retrieved chapter ${chapterDescriptor.uri}`)
        return pages
      })
      .catch(err => {
        logger.error(err)
      })
  }
}

module.exports = mangaReader
