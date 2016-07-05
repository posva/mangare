const express = require('express')
const compression = require('compression')
const fallback = require('express-history-api-fallback')
const mongoose = require('mongoose')

const api = require('./api')
const dbLogger = require('./logger')('MongoDB')
const logger = require('./logger')()

process.env.PORT = process.env.PORT || 8080
const app = express()
app.use(compression())

app.get('/api/mangas', api.mangaList)
app.get('/api/mangas/:id/chapters/:chapterId', api.mangaChapter)
app.get('/api/mangas/:id', api.manga)
app.get('/api/image', api.imageBase64)

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

db.on('error', dbLogger.error.bind(dbLogger))

db.once('open', () => {
  dbLogger.info(`MongoDB started on ${process.env.MONGODB_URI}`)
})

module.exports = app.listen(process.env.PORT, () => {
  logger.info(`Listening on ${process.env.PORT}`)
})

