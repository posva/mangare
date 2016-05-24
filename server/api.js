const Manga = require('./models/manga')
const _ = require('lodash')
const request = require('request')
const mangareader = require('./providers/mangareader')

const cloudinary = require('./cloudinary')
const logger = require('./logger')('api')

// One day in milliseconds
const DAY = 1000 * 60 * 60 * 24

function chapterDetail (chapter) {
  logger.debug('Converting chapter data')
  return {
    _id: chapter._id,
    name: chapter.name,
    date: chapter.date,
    uri: chapter.uri,
    updatedAt: chapter.updatedAt,
    pages: _.map(chapter.pages, (page) => page.image),
    pageCount: chapter.pageCount
  }
}

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

module.exports = {
  mangaList (req, res) {
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
  },

  mangaChapter (req, res) {
    if (!req.params || !req.params.id || !req.params.chapterId) {
      logger.warn(`Missing data: manga: ${req.params.id}, chapter: ${req.params.chapterId}`)
      return res.status(404).send('provide a manga and a chapter')
    }
    logger.info(`Retrieving chapter ${req.params.chapterId} from ${req.params.id} manga`)
    Manga.findById(req.params.id, {
      chapters: {
        $elemMatch: {
          _id: req.params.chapterId
        }
      }
    }, (err, manga) => {
      if (err) {
        logger.error(err)
        return res.status(500).send(err)
      }
      if (!manga) {
        logger.warn(`Manga ${req.params.id} not found`)
        return res.status(404).send('Manga not found')
      }
      const chapter = manga.chapters[0]
      if (!chapter) {
        logger.warn(`Chapter ${req.params.chapterId} for ${req.params.id} not found`)
        return res.status(404).send('Chapter not found')
      }

      if (!chapter.pages.length) {
        logger.info('Missing pages, using provider to get them')
        mangareader.getPages(chapter)
        .then((pages) => {
          logger.info(`Updating pages for ${req.params.chapterId} in ${req.params.id}`)
          chapter.pages = pages
          Manga.update({
            _id: manga._id,
            'chapters._id': chapter._id
          }, {
            $set: {
              'chapters.$.pages': pages,
              'chapters.$.pageCount': pages.length
            }
          }, () => {
            logger.info(`Updated pages for ${req.params.chapterId} in ${req.params.id}`)
            chapter.pageCount = pages.length
            res.send(chapterDetail(chapter))
          })
        }).catch((err) => {
          logger.error(err)
          res.status(500).send(err)
        })
      } else {
        logger.info(`Retrieved chapter ${req.params.chapterId} for ${req.params.id}`)
        res.send(chapterDetail(chapter))
      }
    })
  },

  manga (req, res) {
    logger.info(`Retrieving manga ${req.params.id}`)
    Manga.findById(req.params.id, {
      name: true,
      description: true,
      completed: true,
      chapterCount: true,
      image: true,
      updatedAt: true,
      uri: true,
      'chapters.name': true,
      'chapters.uri': true,
      'chapters.date': true,
      'chapters.updatedAt': true,
      'chapters.pageCount': true,
      'chapters._id': true
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
              Object.assign(manga, mangaData)
              logger.info(`Updating Manga ${req.params.id}`)
              manga.save(() => res.send(mangaDetail(manga)))
            })
          } else {
            logger.info(`Updating Manga ${req.params.id}`)
            Object.assign(manga, mangaData)
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
  },

  imageBase64 (req, res) {
    const query = req.query.url
    if (!query) {
      logger.warn('Missing url query')
      return res.status(404).send('Pass un url query')
    }
    const image = query.replace(/^(https?:)?\/\//, '')
    const url = `https://images.weserv.nl?url=${image}&encoding=base64`
    logger.debug(`Retrieving base64 for image ${req.query.url}`)
    request.get(url, (err, response, data) => {
      if (err) {
        logger.error(err)
        return res.status(500).send(err)
      }
      if (response.statusCode !== 200) {
        logger.error(`(${response.statusCode}) Could not retrieve base64 for image ${req.query.url}`)
        return res.status(response.statusCode).send('Error')
      }
      logger.debug(`Retrieved base64 for image ${req.query.url}`)
      res.send(data)
    })
  }
}

