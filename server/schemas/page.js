'use strict'
const mongoose = require('mongoose')

let pageSchema = mongoose.Schema({
  image: String,
  uri: {
    type: String,
    required: true,
  },
  updatedAt: Date
}, {
  autoIndex: true
})

pageSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = pageSchema
