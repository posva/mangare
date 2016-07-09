const Manga = require('../models/manga')
const _ = require('lodash')
const mangareader = require('../providers/mangareader')
const logger = require('../logger')('api/chapter')

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

exports.mangaChapter = function mangaChapter (req, res) {
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
}
