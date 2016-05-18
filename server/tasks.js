const prettyHrtime = require('pretty-hrtime')
const Manga = require('./models/manga')
const mangareader = require('./providers/mangareader')
const logger = require('./logger')('Tasks')

module.exports = {
  updateMangaList () {
    logger.info('Fetching Manga')
    const start = process.hrtime()
    return mangareader.getList()
    .then((mangaList) => Manga.populateMangaList(mangaList))
    .then((data) => {
      const end = process.hrtime(start)
      logger.info(`Took ${prettyHrtime(end)} to get and populate(${data.time}) manga list(${data.data.insertedCount})`)
    })
    .catch((err) => {
      logger.error(err)
    })
  }
}
