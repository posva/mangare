const restify = require('restify')
const mongoose = require('mongoose')
const Manga = require('./models/manga')

const mangareader = require('./providers/mangareader.js')
const prettyHrtime = require('pretty-hrtime')

process.env.PORT = process.env.PORT || 8080
const server = restify.createServer()

mongoose.connect('mongodb://localhost/mangare')
const db = mongoose.connection

server.get(/\/$/, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}))

server.get(/\/images\/?.*/, restify.serveStatic({
  directory: './public'
}))

server.get('/hello', (req, res, next) => {
  res.send({
    msg: 'Hello'
  })
  next()
})

server.get(/\/docs\/current\/?.*/, restify.serveStatic({
  directory: './documentation/v1',
  default: 'index.html'
}))

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {
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
  server.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`)
  })
})
