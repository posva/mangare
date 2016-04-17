'use strict'
const mangaSchema = require('../schemas/manga.js')
const mongoose = require('mongoose')

let Manga = mongoose.model('Manga', mangaSchema)

module.exports = Manga
