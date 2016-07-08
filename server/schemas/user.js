const mongoose = require('mongoose')
const promisify = require('promisify-node')
const bcrypt = promisify('bcrypt-nodejs')

let userSchema = mongoose.Schema({
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
      .then((salt, err) => {
        if (err) throw err
        return bcrypt.hash(user.password, salt, null)
      }).then((hash, err) => {
        if (err) throw err
        user.password = hash
      })
  } else {
    return Promise.resolve()
  }
}

userSchema.pre('save', function (next) {
  assurePasswordHash(this)
    .then(next)
    .catch(err => next(err))
})

module.exports = userSchema
