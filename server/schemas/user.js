const mongoose = require('mongoose')
const promisify = require('promisify-node')
const bcrypt = promisify('bcrypt-nodejs')
const logger = require('../logger')('model/user')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: String
})

function assurePasswordHash (user) {
  if (user.isModified('password')) {
    return bcrypt.genSalt(5)
      .then(salt => bcrypt.hash(user.password, salt, null))
      .then(hash => {
        user.password = hash
      })
  } else {
    return Promise.resolve()
  }
}

userSchema.pre('save', function (next) {
  assurePasswordHash(this)
    .then(next)
    .catch(err => {
      logger.error(err)
      next(err)
    })
})

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.password)
    .catch(err => {
      logger.error(err)
    })
}

module.exports = userSchema
