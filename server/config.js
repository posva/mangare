const secret = process.env.NODE_ENV === 'production'
  ? Math.random().toString(36).substr(2, 15)
  : 'secret' // use a simple secret in local

module.exports = {
  secret
}
