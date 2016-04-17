const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const prettyHrtime = require('pretty-hrtime')
const webpackMiddleware = require('../build/dev-server')

const Manga = require('./models/manga')
const mangareader = require('./providers/mangareader.js')

process.env.PORT = process.env.PORT || 8080
// const server = restify.createServer()
const app = express()

app.get('/mangas', (req, res) => {
  Manga.find({}, {
    name: true,
    completed: true
  }, (err, mangas) => {
    if (err) return res.send(err)
    res.send(mangas)
  })
})

// const manga = restifyMongoose(Manga)

// server.get('/mangas/:id', manga.detail())
app.get('/mangas/:id', (req, res) => {
  Manga.findById(req.params.id, (err, manga) => {
    if (err) res.send(err)
    res.send(manga)
  })
})

// XXX don't use this in production
webpackMiddleware(app, express.static('./static'))

mongoose.connect('mongodb://localhost/mangare')
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

