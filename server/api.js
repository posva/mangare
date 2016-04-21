const Manga = require('./models/manga')
const mangareader = require('./providers/mangareader')

module.exports = {
  mangaList (req, res) {
    Manga.find({}, {
      name: true,
      image: true,
      uri: true,
      completed: true
    }, (err, mangas) => {
      if (err) return res.send(err)
      res.send(mangas)
    })
  },
  mangaChapter (req, res) {
    Manga.findById(req.params.id, {
      name: true,
      completed: true,
      image: true,
      uri: true,
      'chapters.name': true,
      'chapters.uri': true,
      'chapters.pages': true
    }, (err, manga) => {
      if (err) return res.status(500).send(err)
      if (!manga) return res.status(404).send('Manga not found')

      var chapter = manga.chapters[req.params.index]
      if (!chapter) {
        return res.status(404).send(`Chapter ${req.params.index} doesn't exist`)
      }
      if (!chapter.pages.length) {
        mangareader.getPages(chapter)
        .then((pages) => {
          chapter.pages = pages
          manga.save(() => {
            manga.chapter = chapter
            delete manga.chapters
            res.send(manga)
          })
        }).catch((err) => {
          console.log(err)
          res.send(err)
        })
      } else {
        manga.chapter = chapter
        delete manga.chapters
        res.send(manga)
      }
    })
  },
  mangaDetail (req, res) {
    Manga.findById(req.params.id, {
      name: true,
      completed: true,
      image: true,
      uri: true,
      'chapters.name': true,
      'chapters.uri': true
    }, (err, manga) => {
      if (err) return res.send(err)

      if (manga.image == null) {
        mangareader.getManga(manga)
        .then((mangaData) => {
          Object.assign(manga, mangaData)
          manga.save(() => res.send(manga))
        }).catch((err) => {
          console.log(err)
          res.send(err)
        })
      } else {
        res.send(manga)
      }
    })
  }
}

