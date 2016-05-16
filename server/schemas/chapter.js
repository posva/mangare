'use strict'
const mongoose = require('mongoose')
const pageSchema = require('./page')

let chapterSchema = mongoose.Schema({
  name: String,
  index: Number,
  uri: {
    type: String,
    required: true
  },
  updatedAt: Date,
  pages: {
    type: [pageSchema],
    default: []
  }
}, {
  autoIndex: true
})

chapterSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  this.pageCount = this.pages.length
  next()
})

module.exports = chapterSchema
