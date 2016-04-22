const express = require('express')
const fallback = require('express-history-api-fallback')
const mongoose = require('mongoose')

const api = require('./api')

process.env.PORT = process.env.PORT || 8080
const app = express()

app.get('/api/mangas', api.mangaList)
app.get('/api/mangas/:id/chapters/:chapterId', api.mangaChapter)
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
  app.use(fallback('index.html', {root: './dist'}))
}

process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mangare'
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {
  console.log(`MongoDB started on ${process.env.MONGOLAB_URI}`)
})

module.exports = app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`)
})

