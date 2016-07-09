const express = require('express')
const mongoose = require('mongoose')
const fallback = require('express-history-api-fallback')

const dbLogger = require('./logger')('MongoDB')
const logger = require('./logger')()
const app = require('./app')

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
mongoose.connect(process.env.MONGODB_URI, {config: { autoIndex: false }})
const db = mongoose.connection

db.on('error', dbLogger.error.bind(dbLogger))

db.once('open', () => {
  dbLogger.info(`MongoDB started on ${process.env.MONGODB_URI}`)
})

module.exports = app.listen(process.env.PORT, () => {
  logger.info(`Listening on ${process.env.PORT}`)
})
