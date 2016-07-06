'use strict'
const mongoose = require('mongoose')
const pageSchema = require('./page')

let chapterSchema = mongoose.Schema({
  _id: Number,
  name: String,
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
})

chapterSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  this.pageCount = this.pages.length || this.pageCount || 0
  next()
})

module.exports = chapterSchema
