const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')
const prettyHrtime = require('pretty-hrtime')

const Manga = require('./models/manga')
const mangareader = require('./providers/mangareader')

const api = require('./api')

process.env.PORT = process.env.PORT || 8080
const app = express()

app.get('/api/mangas', api.mangaList)
app.get('/api/mangas/:id/chapters/:index', api.mangaChapter)
app.get('/api/mangas/:id', api.mangaDetail)

// XXX don't use this in production
if (process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'debug' &&
    process.env.NODE_ENV !== 'testing'
   ) {
  const webpackMiddleware = require('../build/dev-server')
  webpackMiddleware(app, express.static('./static'))
} else {
  app.use('/', express.static('./dist'))
}

process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/mangare'
console.log(`Connecting on mongo to ${process.env.MONGOLAB_URI}`)
mongoose.connect(process.env.MONGOLAB_URI)
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {
  if (true) return
  console.log('Mongoose started')
  const start = process.hrtime()
  mangareader.getList()
    .then((mangaList) => Manga.populateMangaList(mangaList))
    .then((data) => {
      const end = process.hrtime(start)
      console.log(`Took ${prettyHrtime(end)} to get and populate(${data.time}) manga list(${data.data.insertedCount})`)
    })
    .catch((err) => {
      console.error(err)
    })
})

module.exports = app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`)
})

