const prettyHrtime = require('pretty-hrtime')
const Manga = require('./models/manga')
const mangareader = require('./providers/mangareader')

module.exports = {
  updateMangaList () {
    console.log('Fetching Manga')
    const start = process.hrtime()
    return mangareader.getList()
    .then((mangaList) => Manga.populateMangaList(mangaList))
    .then((data) => {
      const end = process.hrtime(start)
      console.log(`Took ${prettyHrtime(end)} to get and populate(${data.time}) manga list(${data.data.insertedCount})`)
    })
  }
}
