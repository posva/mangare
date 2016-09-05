const passport = require('passport')
// const BasicStrategy = require('passport-http').BasicStrategy
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) return done(err)

    // No user found with that username
    if (!user) return done(null, false)

    // Make sure the password is correct
    user.verifyPassword(password)
      .then(isMatch => {
        if (!isMatch) return done(null, false)
        // Success
        done(null, user)
      })
      .catch(err => {
        console.log('ERROR', err)
      })
  })
}))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  return done(null, {id: id})
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

module.exports = passport.authenticate('local')
