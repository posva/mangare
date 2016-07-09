const _ = require('lodash')
const Manga = require('../models/manga')
const mangareader = require('../providers/mangareader')
const cloudinary = require('../cloudinary')
const logger = require('../logger')('api/manga')

// One day in milliseconds
const DAY = 1000 * 60 * 60 * 24

function mangaDetail (manga) {
  logger.debug('Converting manga data')
  return {
    _id: manga._id,
    name: manga.name,
    description: manga.description,
    image: manga.image,
    uri: manga.uri,
    updatedAt: manga.updatedAt,
    completed: manga.completed,
    chapterCount: manga.chapterCount,
    chapters: _.map(manga.chapters, (chapter) => _.pick(chapter, [
      'uri', 'name', '_id', 'date', 'updatedAt', 'pageCount'
    ]))
  }
}

function updateManga (manga, mangaUpdate) {
  _.merge(mangaUpdate.chapters, manga.chapters)
  Object.assign(manga, mangaUpdate)
}

exports.mangaList = function mangaList (req, res) {
  logger.info('Retrieving manga list')
  Manga.find({}, {
    name: true,
    description: true,
    image: true,
    uri: true,
    completed: true,
    updatedAt: true,
    chapterCount: true
  }, (err, mangas) => {
    if (err) {
      logger.error(err)
      return res.status(500).send(err)
    }
    logger.info(`Retrieved ${mangas.length} mangas`)
    res.send(mangas)
  })
}

exports.manga = function manga (req, res) {
  logger.info(`Retrieving manga ${req.params.id}`)
  Manga.findById(req.params.id, {
    name: true,
    description: true,
    completed: true,
    chapterCount: true,
    image: true,
    updatedAt: true,
    uri: true,
    chapters: true
  }, (err, manga) => {
    if (err) {
      logger.error(err)
      return res.status(500).send(err)
    }
    if (!manga) {
      logger.warn(`Manga ${req.params.id} not found`)
      return res.status(404).send('Manga not found')
    }

    const needsUpdate = manga.image == null ||
            (new Date() - new Date(manga.updatedAt)) > DAY
    if (needsUpdate) {
      logger.info(`Fetching data for Manga ${req.params.id}`)
      mangareader.getManga(manga)
        .then((mangaData) => {
          // upload image if we don't have it yet
          if (mangaData.image && !manga.image) {
            logger.info(`Uploading image for Manga ${req.params.id} to cloudinary`)
            cloudinary.upload(mangaData.image)
              .then((url) => {
                logger.info(`Uploaded image for Manga ${req.params.id} to cloudinary`)
                mangaData.image = url
                updateManga(manga, mangaData)
                logger.info(`Updating Manga ${req.params.id}`)
                manga.save(() => res.send(mangaDetail(manga)))
              })
          } else {
            logger.info(`Updating Manga ${req.params.id}`)
            updateManga(manga, mangaData)
            manga.save(() => res.send(mangaDetail(manga)))
          }
        }).catch((err) => {
          logger.error(err)
          res.status(500).send(err)
        })
    } else {
      logger.info(`Retrieved Manga ${req.params.id}`)
      res.send(mangaDetail(manga))
    }
  })
}
