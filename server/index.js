const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const fallback = require('express-history-api-fallback')
const mongoose = require('mongoose')
const passport = require('passport')
const jwtAuth = require('./auth/jwt')
require('./auth/anonymous')

const api = require('./api')
const dbLogger = require('./logger')('MongoDB')
const logger = require('./logger')()

process.env.PORT = process.env.PORT || 8080
const app = express()

app.use(compression())
app.use(bodyParser.json())
app.use(passport.initialize())

const authenticate = passport.authenticate(['jwt', 'anonymous'], {session: false})

app.get('/api/mangas', authenticate, api.mangaList)
app.get('/api/mangas/:id/chapters/:chapterId', authenticate, api.mangaChapter)
app.get('/api/mangas/:id', authenticate, api.manga)
app.get('/api/image', authenticate, api.imageBase64)

app.post('/api/register', api.register)

app.post('/api/auth-token', jwtAuth.generateToken)
app.get('/api/test-auth', authenticate, function (req, res) {
  res.json(req.user || {})
})

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
