'use strict'
const mongoose = require('mongoose')
const pageSchema = require('./page')

let chapterSchema = mongoose.Schema({
  name: String,
  index: Number,
  pageCount: Number,
  date: Date,
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
  this.pageCount = this.pages.length || this.pageCount || 0
  next()
})

module.exports = chapterSchema
