const Manga = require('./models/manga')
const _ = require('lodash')
const mangareader = require('./providers/mangareader')

function chapterDetail (chapter) {
  return {
    _id: chapter._id,
    name: chapter.name,
    uri: chapter.uri,
    pages: _.map(chapter.pages, (page) => page.image)
  }
}

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
      chapters: {
        $elemMatch: {
          _id: req.params.chapterId
        },
      }
    }, (err, manga) => {
      if (err)
        return res.status(500).send(err)
      if (!manga)
        return res.status(404).send('Manga not found')
      const chapter = manga.chapters[0]
      if (!chapter)
        return res.status(404).send('Chapter not found')

      if (!chapter.pages.length) {
        mangareader.getPages(chapter)
        .then((pages) => {
          chapter.pages = pages
          Manga.update({
            _id: manga._id,
            'chapters._id': chapter._id
          }, {
            $set: {
              'chapters.$.pages': pages
            }
          }, () => {
            res.send(chapterDetail(chapter))
          })
        }).catch((err) => {
          console.log(err)
          res.status(500).send(err)
        })
      } else {
        res.send(chapterDetail(chapter))
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
      'chapters.uri': true,
      'chapters._id': true
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

