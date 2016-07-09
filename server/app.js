const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const passport = require('passport')
const jwtAuth = require('./auth/jwt')
require('./auth/anonymous')
const api = require('./api')

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
app.get('/api/me', authenticate, api.me)

app.post('/api/auth-token', jwtAuth.generateToken)
app.get('/api/test-auth', authenticate, function (req, res) {
  res.json(req.user || {})
})

module.exports = app
