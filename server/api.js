const Manga = require('./models/manga')
const _ = require('lodash')
const request = require('request')
const mangareader = require('./providers/mangareader')

const cloudinary = require('./cloudinary')

function chapterDetail (chapter) {
  return {
    _id: chapter._id,
    name: chapter.name,
    uri: chapter.uri,
    updatedAt: chapter.updatedAt,
    pages: _.map(chapter.pages, (page) => page.image)
  }
}

function mangaDetail (manga) {
  return {
    _id: manga._id,
    name: manga.name,
    description: manga.description,
    image: manga.image,
    uri: manga.uri,
    updatedAt: manga.updatedAt,
    completed: manga.completed,
    chapterCount: manga.chapterCount,
    chapters: _.map(manga.chapters, (chapter) => _.pick(chapter, ['uri', 'name', '_id']))
  }
}

module.exports = {
  mangaList (req, res) {
    Manga.find({}, {
      name: true,
      description: true,
      image: true,
      uri: true,
      completed: true,
      updatedAt: true,
      chapterCount: true
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
        }
      }
    }, (err, manga) => {
      if (err) {
        return res.status(500).send(err)
      }
      if (!manga) {
        return res.status(404).send('Manga not found')
      }
      const chapter = manga.chapters[0]
      if (!chapter) {
        return res.status(404).send('Chapter not found')
      }

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

  manga (req, res) {
    Manga.findById(req.params.id, {
      name: true,
      description: true,
      completed: true,
      image: true,
      updatedAt: true,
      uri: true,
      'chapters.name': true,
      'chapters.uri': true,
      'chapters._id': true
    }, (err, manga) => {
      if (err) return res.send(err)

      if (manga.image == null) {
        mangareader.getManga(manga)
        .then((mangaData) => {
          // upload image if we don't have it yet
          if (mangaData.image && !manga.image) {
            cloudinary.upload(mangaData.image)
            .then((url) => {
              mangaData.image = url
              Object.assign(manga, mangaData)
              manga.save(() => res.send(mangaDetail(manga)))
            })
          } else {
            Object.assign(manga, mangaData)
            manga.save(() => res.send(mangaDetail(manga)))
          }
        }).catch((err) => {
          console.log(err)
          res.send(err)
        })
      } else {
        res.send(mangaDetail(manga))
      }
    })
  },

  imageBase64 (req, res) {
    const query = req.query.url
    if (!query) {
      return res.status(404).send('Pass un url query')
    }
    const image = query.replace(/^(https?:)?\/\//, '')
    const url = `https://images.weserv.nl?url=${image}&encoding=base64`
    request.get(url, (err, response, data) => {
      if (err) {
        return res.status(500).send(err)
      }
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).send('Error')
      }
      res.send(data)
    })
  }
}

