const User = require('../models/user')
const logger = require('../logger')('api/user')

exports.register = function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  user.save(err => {
    if (err) {
      logger.error(err)
      return res.sendStatus(500)
    }
    res.json({ message: 'user created' })
  })
}

exports.me = function (req, res) {
  if (req.user) {
    res.json(req.user)
  } else {
    res.sendStatus(401)
  }
}
