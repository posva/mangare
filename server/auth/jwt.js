const passport = require('passport')
const jwt = require('jwt-simple')
const passportJWT = require('passport-jwt')
const config = require('../config.js')
const User = require('../models/user')
const logger = require('../logger')('auth/jwt')
const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy
const params = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
}

passport.use(new Strategy(params, function ({_id}, done) {
  User.findOne({_id}, (err, user) => {
    if (err) {
      logger.error(err)
      return done(err)
    }

    // No user found with that username
    if (!user) {
      logger.info(`User "${_id}" doesn't exist`)
      return done(null, false)
    }

    logger.info(`Request from "${user.username}" (${_id})`)
    done(null, user)
  })
}))

exports.generateToken = function (req, res) {
  if (req.body.username && req.body.password) {
    const username = req.body.username
    const password = req.body.password
    User.findOne({ username }, (err, user) => {
      if (err) return res.sendStatus(500)

      // No user found with that username
      if (!user) {
        logger.info(`User "${username}" doesn't exist`)
        return res.sendStatus(401)
      }

      // Make sure the password is correct
      user.verifyPassword(password)
        .then(isMatch => {
          if (!isMatch) {
            logger.info(`Token request fail "${username}"/"${password}"`)
            return res.sendStatus(401)
          }
          // Success
          const token = jwt.encode({_id: user._id}, config.secret)
          logger.info(`User "${user.username}" (${user._id}) requested a token`)
          res.json({token})
        })
        .catch(err => {
          logger.error(err)
          res.sendStatus(401)
        })
    })
  } else {
    logger.error('Missing username/password in login request')
    res.sendStatus(401)
  }
}
