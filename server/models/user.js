'use strict'
const userSchema = require('../schemas/user')
const mongoose = require('mongoose')

let User = null
try {
  User = mongoose.model('User')
} catch (e) {
  User = mongoose.model('User', userSchema)
}

module.exports = User
