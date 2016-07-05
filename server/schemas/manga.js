'use strict'
const mongoose = require('mongoose')
const prettyHrtime = require('pretty-hrtime')
const _ = require('lodash')
const chapterSchema = require('../schemas/chapter')

let mangaSchema = mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  image: String,
  uri: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  completed: Boolean,
  updatedAt: Date,
  chapterCount: {
    type: Number,
    default: 0
  },
  chapters: {
    type: [chapterSchema],
    default: []
  }
}, {
  autoIndex: true
})

mangaSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  this.chapterCount = this.chapters.length || this.chapterCount || 0
  next()
})

mangaSchema.methods.updateChapters = function (chapters) {
  return new Promise((resolve, reject) => {
    // let start = process.hrtime()
  })
}

mangaSchema.statics.populateMangaList = function (mangaList) {
  return new Promise((resolve, reject) => {
    let start = process.hrtime()
    this.find({}, {_id: true}, (err, mangas) => {
      if (err) {
        reject(err)
      }
      mangaList.forEach(manga => manga._id = _.kebabCase(manga.name))
      let newMangas = _.differenceBy(mangaList, mangas, '_id')
      let now = new Date()
      newMangas.forEach(manga => manga.updatedAt = now)
      if (newMangas.length) {
        this.collection.insert(newMangas, (err, data) => {
          if (err) {
            reject(err)
          }
          resolve({
            data,
            time: prettyHrtime(process.hrtime(start))
          })
        })
      } else {
        resolve({
          data: {
            insertedCount: 0
          },
          time: prettyHrtime(process.hrtime(start))
        })
      }
    })
  })
}

module.exports = mangaSchema
