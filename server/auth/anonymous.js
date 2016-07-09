const passport = require('passport')
const AnonymousStrategy = require('passport-anonymous')

passport.use(new AnonymousStrategy())

module.exports = passport.authenticate('anonymous', { session: false })
