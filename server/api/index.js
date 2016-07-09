const manga = require('./manga')
const chapter = require('./chapter')
const page = require('./page')
const user = require('./user')

exports.mangaList = manga.mangaList
exports.manga = manga.manga
exports.mangaChapter = chapter.mangaChapter
exports.imageBase64 = page.imageBase64
exports.register = user.register
exports.me = user.me
