'use strict'
const mangaSchema = require('../schemas/manga.js')
const mongoose = require('mongoose')

let Manga = null
try {
  Manga = mongoose.model('Manga')
} catch (e) {
  Manga = mongoose.model('Manga', mangaSchema)
}

module.exports = Manga
