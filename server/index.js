const restify = require('restify')
const restifyMongoose = require('restify-mongoose')
const mongoose = require('mongoose')
const Manga = require('./models/manga')

const mangareader = require('./providers/mangareader.js')
const prettyHrtime = require('pretty-hrtime')

process.env.PORT = process.env.PORT || 8090
const server = restify.createServer()

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

server.get('/mangas', (req, res, next) => {
  Manga.find({}, {
    name: true,
    completed: true
  }, (err, mangas) => {
    if (err) return next(err)
    res.send(mangas)
    next()
  })
})

const manga = restifyMongoose(Manga)

server.get('/mangas/:id', manga.detail())

mongoose.connect('mongodb://localhost/mangare')
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {
  server.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`)
  })
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
