const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy

const TWITTER_CONSUMER_KEY = 'GkI2mRDa64OSEkTsO2o1s5BWO'
// TODO make this a env variable
const TWITTER_CONSUMER_SECRET = 'k7gbQ57XUipWT9V7YP8pwcYNVtagU7CUsk25vsRclsui80pVpm'
const CALLBACK_URL = 'http://127.0.0.1:8080/auth/twitter/callback'

passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: CALLBACK_URL
}, function (token, tokenSecret, profile, done) {
  console.log(token, tokenSecret, profile)
  done(null, profile)
  // User.findOrCreate(..., function(err, user) {
  //   if (err) done(err)
  //   done(null, user)
  // })
}))

module.exports = passport.authenticate('twitter')
